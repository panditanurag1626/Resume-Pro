"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  getResume,
  newResumeId,
  saveResume,
  type LocalResume,
} from "@/lib/local-resumes";

type Basics = {
  name: string;
  label: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: { address: string; city: string; region: string; countryCode: string };
};

type WorkItem = {
  name: string;
  position: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
};

type EducationItem = {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
};

type SkillItem = { name: string; level?: string; keywords: string[] };
type ProjectItem = { name: string; description: string; url: string; highlights: string[] };
type CertItem = { name: string; issuer: string; date: string; url: string };
type LangItem = { language: string; fluency: string };
type AwardItem = { title: string; awarder: string; date: string; summary: string };

type ResumeData = {
  basics: Basics;
  work: WorkItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertItem[];
  languages: LangItem[];
  awards: AwardItem[];
};

const emptyBasics: Basics = {
  name: "",
  label: "",
  email: "",
  phone: "",
  url: "",
  summary: "",
  location: { address: "", city: "", region: "", countryCode: "" },
};

const emptyData: ResumeData = {
  basics: emptyBasics,
  work: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
};

const SECTIONS = [
  { id: "basics", label: "Basics" },
  { id: "summary", label: "Summary" },
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "languages", label: "Languages" },
  { id: "awards", label: "Awards" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function normalize(d: any): ResumeData {
  const src = d || {};
  return {
    basics: {
      ...emptyBasics,
      ...(src.basics || {}),
      location: { ...emptyBasics.location, ...(src.basics?.location || {}) },
    },
    work: Array.isArray(src.work) ? src.work : [],
    education: Array.isArray(src.education) ? src.education : [],
    skills: Array.isArray(src.skills) ? src.skills : [],
    projects: Array.isArray(src.projects) ? src.projects : [],
    certifications: Array.isArray(src.certifications) ? src.certifications : [],
    languages: Array.isArray(src.languages) ? src.languages : [],
    awards: Array.isArray(src.awards) ? src.awards : [],
  };
}

/* --------------------------------- UI bits -------------------------------- */

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  textarea = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-600">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      )}
    </label>
  );
}

function SectionShell({
  title,
  children,
  onAdd,
  addLabel,
}: {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex h-8 items-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700"
          >
            + {addLabel || "Add"}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

/* -------------------------------- Templates modal ------------------------- */

// Client-side cache to make subsequent modal opens instant
let templatesCache: any[] | null = null;

function TemplateModal({
  open,
  onClose,
  onSelect,
  currentId,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (id: number) => void;
  currentId: number;
}) {
  const [templates, setTemplates] = useState<any[]>(templatesCache || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (templatesCache) {
      const cached = templatesCache;
      setTemplates(cached);
      return;
    }
    setLoading(true);
    fetch("/api/templates?limit=100")
      .then((r) => r.json())
      .then((d) => {
        const fetched = d?.templates || [];
        templatesCache = fetched;
        setTemplates(fetched);
      })
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const items =
    templates.length > 0
      ? templates
      : Array.from({ length: 30 }).map((_, i) => ({
          id: i + 1,
          name: `Template ${i + 1}`,
          description: "",
          tags: [],
        }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="flex h-[80vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Choose a template
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading…</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {items.map((t: any) => {
                const active = t.id === currentId;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelect(t.id);
                      onClose();
                    }}
                    className={`group overflow-hidden rounded-xl border text-left transition ${
                      active
                        ? "border-brand-500 ring-2 ring-brand-200"
                        : "border-slate-200 hover:border-brand-300"
                    }`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                      <iframe
                        src={`/api/templates/${t.id}/preview`}
                        title={t.name || `Template ${t.id}`}
                        className="pointer-events-none absolute left-0 top-0 origin-top-left scale-[0.6] border-0"
                        style={{ width: "166.67%", height: "166.67%" }}
                        sandbox="allow-same-origin allow-scripts"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-transparent" />
                    </div>
                    <div className="border-t border-slate-200 p-3">
                      <div className="text-sm font-medium text-slate-900">
                        {t.name || `Template ${t.id}`}
                      </div>
                      <div className="text-xs text-slate-500">#{t.id}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Page ------------------------------------ */

function BuilderContent() {
  const router = useRouter();
  const params = useSearchParams();
  const resumeIdParam = params.get("resumeId");
  const templateIdParam = params.get("templateId");

  const [resumeId, setResumeId] = useState<string | null>(resumeIdParam);
  const [templateId, setTemplateId] = useState<number>(
    templateIdParam ? Number(templateIdParam) || 1 : 1
  );
  const [title, setTitle] = useState<string>("Untitled Resume");
  const [data, setData] = useState<ResumeData>(emptyData);
  const [open, setOpen] = useState<Record<SectionId, boolean>>({
    basics: true,
    summary: true,
    work: true,
    education: true,
    skills: true,
    projects: false,
    certifications: false,
    languages: false,
    awards: false,
  });
  const [showTemplates, setShowTemplates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [rendering, setRendering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const didInitRef = useRef(false);

  // Load existing resume (or stay blank). Runs once on mount.
  useEffect(() => {
    if (didInitRef.current) return;

    if (resumeIdParam) {
      const row = getResume(resumeIdParam);
      if (row) {
        setResumeId(row.id);
        setTitle(row.title || "Untitled Resume");
        setTemplateId(row.templateId || 1);
        const loadedData = normalize(row.data);
        setData(loadedData);
        refreshPreview(loadedData, row.templateId || 1).then(() => {
          setIsLoaded(true);
        });
        didInitRef.current = true;
        return;
      }
      // Not found — treat as new draft
      setResumeId(null);
    }
    refreshPreview(emptyData, templateId).then(() => {
      setIsLoaded(true);
    });
    didInitRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeIdParam]);

  const updateBasics = useCallback((patch: Partial<Basics>) => {
    setData((d) => ({ ...d, basics: { ...d.basics, ...patch } }));
  }, []);

  const updateBasicsLocation = useCallback((patch: Partial<Basics["location"]>) => {
    setData((d) => ({
      ...d,
      basics: { ...d.basics, location: { ...d.basics.location, ...patch } },
    }));
  }, []);

  function updateList<K extends keyof ResumeData>(
    key: K,
    index: number,
    patch: Partial<ResumeData[K] extends Array<infer U> ? U : never>
  ) {
    setData((d) => {
      const list = [...(d[key] as any[])];
      list[index] = { ...list[index], ...patch };
      return { ...d, [key]: list } as ResumeData;
    });
  }

  function addRow<K extends keyof ResumeData>(key: K, row: any) {
    setData((d) => ({ ...d, [key]: [...(d[key] as any[]), row] } as ResumeData));
  }

  function removeRow<K extends keyof ResumeData>(key: K, index: number) {
    setData((d) => {
      const list = [...(d[key] as any[])];
      list.splice(index, 1);
      return { ...d, [key]: list } as ResumeData;
    });
  }

  function save(): LocalResume {
    setSaving(true);
    try {
      const id = resumeId || newResumeId();
      const row = saveResume({
        id,
        title,
        templateId,
        data,
      });
      if (!resumeId) {
        setResumeId(row.id);
        const next = new URL(window.location.href);
        next.searchParams.set("resumeId", row.id);
        window.history.replaceState({}, "", next.toString());
      }
      setSavedAt(new Date().toLocaleTimeString());
      return row;
    } finally {
      setSaving(false);
    }
  }

  async function refreshPreview(useData?: ResumeData, useTemplate?: number) {
    const payloadData = useData ?? data;
    const tpl = useTemplate ?? templateId;
    setRendering(true);
    try {
      const res = await fetch(`/api/templates/${tpl}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: payloadData }),
      });
      if (!res.ok) {
        setPreviewHtml(
          `<html><body style="font-family:system-ui;padding:24px;color:#475569;">Preview failed (status ${res.status}).</body></html>`
        );
        return;
      }
      const body = await res.json();
      const html = body?.data?.html || "";
      setPreviewHtml(html);
    } catch {
      setPreviewHtml(
        `<html><body style="font-family:system-ui;padding:24px;color:#475569;">Could not render preview.</body></html>`
      );
    } finally {
      setRendering(false);
    }
  }

  async function saveAndPreview() {
    save();
    await refreshPreview();
  }

  // Render once after first data load completes
  useEffect(() => {
    if (!isLoaded) return;
    refreshPreview(data, templateId);
    // We intentionally render only when templateId changes — manual refresh
    // button covers the data-edit case.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              ← My Resumes
            </Link>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-md px-2 py-1 text-sm font-medium text-slate-900 hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            {savedAt && (
              <span className="text-xs text-slate-400">Saved {savedAt}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(true)}
              className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:border-slate-400"
            >
              Template #{templateId}
            </button>
            <button
              onClick={() => refreshPreview()}
              disabled={rendering}
              className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-60"
            >
              {rendering ? "Rendering…" : "Refresh Preview"}
            </button>
            <Link
              href={resumeId ? `/ats?resumeId=${resumeId}` : "/ats"}
              className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:border-slate-400"
            >
              Run ATS
            </Link>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={saveAndPreview}
              disabled={saving}
              className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-3 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:opacity-60"
            >
              Save &amp; Preview
            </button>
          </div>
        </div>
      </header>

      {/* Two-column workspace */}
      <div className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* LEFT: form */}
        <div className="space-y-4 lg:max-h-[calc(100vh-110px)] lg:overflow-y-auto lg:pr-2">
          {/* Section toggles */}
          <div className="flex flex-wrap gap-1.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() =>
                  setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))
                }
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  open[s.id]
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Basics */}
          {open.basics && (
            <SectionShell title="Basics">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Field
                  label="Full name"
                  value={data.basics.name}
                  onChange={(v) => updateBasics({ name: v })}
                  placeholder="Jane Doe"
                />
                <Field
                  label="Headline"
                  value={data.basics.label}
                  onChange={(v) => updateBasics({ label: v })}
                  placeholder="Senior Software Engineer"
                />
                <Field
                  label="Email"
                  type="email"
                  value={data.basics.email}
                  onChange={(v) => updateBasics({ email: v })}
                  placeholder="you@example.com"
                />
                <Field
                  label="Phone"
                  value={data.basics.phone}
                  onChange={(v) => updateBasics({ phone: v })}
                  placeholder="+1 555 123 4567"
                />
                <Field
                  label="Website"
                  value={data.basics.url}
                  onChange={(v) => updateBasics({ url: v })}
                  placeholder="https://yourdomain.com"
                />
                <Field
                  label="City"
                  value={data.basics.location.city}
                  onChange={(v) => updateBasicsLocation({ city: v })}
                  placeholder="San Francisco"
                />
                <Field
                  label="Region / State"
                  value={data.basics.location.region}
                  onChange={(v) => updateBasicsLocation({ region: v })}
                  placeholder="CA"
                />
                <Field
                  label="Country code"
                  value={data.basics.location.countryCode}
                  onChange={(v) => updateBasicsLocation({ countryCode: v })}
                  placeholder="US"
                />
              </div>
            </SectionShell>
          )}

          {/* Summary */}
          {open.summary && (
            <SectionShell title="Summary">
              <Field
                label="Professional summary"
                value={data.basics.summary}
                onChange={(v) => updateBasics({ summary: v })}
                textarea
                rows={5}
                placeholder="A short 2-4 sentence summary of your experience and impact."
              />
            </SectionShell>
          )}

          {/* Work */}
          {open.work && (
            <SectionShell
              title="Work Experience"
              addLabel="Add role"
              onAdd={() =>
                addRow("work", {
                  name: "",
                  position: "",
                  startDate: "",
                  endDate: "",
                  summary: "",
                  highlights: [],
                })
              }
            >
              <div className="space-y-4">
                {data.work.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No work experience yet. Add your first role.
                  </p>
                )}
                {data.work.map((w, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Role #{i + 1}
                      </span>
                      <button
                        onClick={() => removeRow("work", i)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Field
                        label="Company"
                        value={w.name}
                        onChange={(v) => updateList("work", i, { name: v })}
                      />
                      <Field
                        label="Position"
                        value={w.position}
                        onChange={(v) => updateList("work", i, { position: v })}
                      />
                      <Field
                        label="Start date"
                        value={w.startDate}
                        onChange={(v) => updateList("work", i, { startDate: v })}
                        placeholder="2022-01"
                      />
                      <Field
                        label="End date"
                        value={w.endDate}
                        onChange={(v) => updateList("work", i, { endDate: v })}
                        placeholder="Present"
                      />
                    </div>
                    <div className="mt-3">
                      <Field
                        label="Summary"
                        value={w.summary}
                        onChange={(v) => updateList("work", i, { summary: v })}
                        textarea
                        rows={3}
                      />
                    </div>
                    <div className="mt-3">
                      <Field
                        label="Highlights (one per line)"
                        value={(w.highlights || []).join("\n")}
                        onChange={(v) =>
                          updateList("work", i, {
                            highlights: v
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        textarea
                        rows={4}
                        placeholder={"Shipped X to reduce Y by Z%\nLed team of 4 engineers"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionShell>
          )}

          {/* Education */}
          {open.education && (
            <SectionShell
              title="Education"
              addLabel="Add school"
              onAdd={() =>
                addRow("education", {
                  institution: "",
                  area: "",
                  studyType: "",
                  startDate: "",
                  endDate: "",
                  score: "",
                })
              }
            >
              <div className="space-y-4">
                {data.education.map((ed, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Education #{i + 1}
                      </span>
                      <button
                        onClick={() => removeRow("education", i)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Field
                        label="Institution"
                        value={ed.institution}
                        onChange={(v) => updateList("education", i, { institution: v })}
                      />
                      <Field
                        label="Area of study"
                        value={ed.area}
                        onChange={(v) => updateList("education", i, { area: v })}
                      />
                      <Field
                        label="Degree / type"
                        value={ed.studyType}
                        onChange={(v) => updateList("education", i, { studyType: v })}
                      />
                      <Field
                        label="GPA / score"
                        value={ed.score}
                        onChange={(v) => updateList("education", i, { score: v })}
                      />
                      <Field
                        label="Start date"
                        value={ed.startDate}
                        onChange={(v) => updateList("education", i, { startDate: v })}
                      />
                      <Field
                        label="End date"
                        value={ed.endDate}
                        onChange={(v) => updateList("education", i, { endDate: v })}
                      />
                    </div>
                  </div>
                ))}
                {data.education.length === 0 && (
                  <p className="text-sm text-slate-500">Add your first school.</p>
                )}
              </div>
            </SectionShell>
          )}

          {/* Skills */}
          {open.skills && (
            <SectionShell
              title="Skills"
              addLabel="Add skill group"
              onAdd={() => addRow("skills", { name: "", level: "", keywords: [] })}
            >
              <div className="space-y-4">
                {data.skills.map((sk, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Group #{i + 1}
                      </span>
                      <button
                        onClick={() => removeRow("skills", i)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Field
                        label="Group name"
                        value={sk.name}
                        onChange={(v) => updateList("skills", i, { name: v })}
                        placeholder="Languages"
                      />
                      <Field
                        label="Level"
                        value={sk.level || ""}
                        onChange={(v) => updateList("skills", i, { level: v })}
                        placeholder="Advanced"
                      />
                    </div>
                    <div className="mt-3">
                      <Field
                        label="Keywords (comma separated)"
                        value={(sk.keywords || []).join(", ")}
                        onChange={(v) =>
                          updateList("skills", i, {
                            keywords: v
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="TypeScript, Python, Go"
                      />
                    </div>
                  </div>
                ))}
                {data.skills.length === 0 && (
                  <p className="text-sm text-slate-500">Add your first skill group.</p>
                )}
              </div>
            </SectionShell>
          )}

          {/* Projects */}
          {open.projects && (
            <SectionShell
              title="Projects"
              addLabel="Add project"
              onAdd={() =>
                addRow("projects", { name: "", description: "", url: "", highlights: [] })
              }
            >
              <div className="space-y-4">
                {data.projects.map((p, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Project #{i + 1}
                      </span>
                      <button
                        onClick={() => removeRow("projects", i)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Field
                        label="Name"
                        value={p.name}
                        onChange={(v) => updateList("projects", i, { name: v })}
                      />
                      <Field
                        label="URL"
                        value={p.url}
                        onChange={(v) => updateList("projects", i, { url: v })}
                      />
                    </div>
                    <div className="mt-3">
                      <Field
                        label="Description"
                        value={p.description}
                        onChange={(v) => updateList("projects", i, { description: v })}
                        textarea
                        rows={3}
                      />
                    </div>
                    <div className="mt-3">
                      <Field
                        label="Highlights (one per line)"
                        value={(p.highlights || []).join("\n")}
                        onChange={(v) =>
                          updateList("projects", i, {
                            highlights: v.split("\n").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        textarea
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                {data.projects.length === 0 && (
                  <p className="text-sm text-slate-500">Add your first project.</p>
                )}
              </div>
            </SectionShell>
          )}

          {/* Certifications */}
          {open.certifications && (
            <SectionShell
              title="Certifications"
              addLabel="Add certification"
              onAdd={() =>
                addRow("certifications", { name: "", issuer: "", date: "", url: "" })
              }
            >
              <div className="space-y-4">
                {data.certifications.map((c, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Certification #{i + 1}
                      </span>
                      <button
                        onClick={() => removeRow("certifications", i)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Field
                        label="Name"
                        value={c.name}
                        onChange={(v) => updateList("certifications", i, { name: v })}
                      />
                      <Field
                        label="Issuer"
                        value={c.issuer}
                        onChange={(v) => updateList("certifications", i, { issuer: v })}
                      />
                      <Field
                        label="Date"
                        value={c.date}
                        onChange={(v) => updateList("certifications", i, { date: v })}
                      />
                      <Field
                        label="URL"
                        value={c.url}
                        onChange={(v) => updateList("certifications", i, { url: v })}
                      />
                    </div>
                  </div>
                ))}
                {data.certifications.length === 0 && (
                  <p className="text-sm text-slate-500">Add your first certification.</p>
                )}
              </div>
            </SectionShell>
          )}

          {/* Languages */}
          {open.languages && (
            <SectionShell
              title="Languages"
              addLabel="Add language"
              onAdd={() => addRow("languages", { language: "", fluency: "" })}
            >
              <div className="space-y-4">
                {data.languages.map((l, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Language #{i + 1}
                      </span>
                      <button
                        onClick={() => removeRow("languages", i)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Field
                        label="Language"
                        value={l.language}
                        onChange={(v) => updateList("languages", i, { language: v })}
                      />
                      <Field
                        label="Fluency"
                        value={l.fluency}
                        onChange={(v) => updateList("languages", i, { fluency: v })}
                      />
                    </div>
                  </div>
                ))}
                {data.languages.length === 0 && (
                  <p className="text-sm text-slate-500">Add your first language.</p>
                )}
              </div>
            </SectionShell>
          )}

          {/* Awards */}
          {open.awards && (
            <SectionShell
              title="Awards"
              addLabel="Add award"
              onAdd={() =>
                addRow("awards", { title: "", awarder: "", date: "", summary: "" })
              }
            >
              <div className="space-y-4">
                {data.awards.map((a, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Award #{i + 1}
                      </span>
                      <button
                        onClick={() => removeRow("awards", i)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Field
                        label="Title"
                        value={a.title}
                        onChange={(v) => updateList("awards", i, { title: v })}
                      />
                      <Field
                        label="Awarder"
                        value={a.awarder}
                        onChange={(v) => updateList("awards", i, { awarder: v })}
                      />
                      <Field
                        label="Date"
                        value={a.date}
                        onChange={(v) => updateList("awards", i, { date: v })}
                      />
                    </div>
                    <div className="mt-3">
                      <Field
                        label="Summary"
                        value={a.summary}
                        onChange={(v) => updateList("awards", i, { summary: v })}
                        textarea
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                {data.awards.length === 0 && (
                  <p className="text-sm text-slate-500">Add your first award.</p>
                )}
              </div>
            </SectionShell>
          )}
        </div>

        {/* RIGHT: preview */}
        <div className="lg:sticky lg:top-[70px] lg:h-[calc(100vh-110px)]">
          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
              <span className="text-xs font-medium text-slate-500">
                Live preview · Template #{templateId}
                {rendering && " · rendering…"}
              </span>
              <button
                onClick={() => refreshPreview()}
                disabled={rendering}
                className="text-xs font-medium text-brand-700 hover:text-brand-800 disabled:opacity-60"
              >
                Refresh
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {isLoaded && previewHtml ? (
                <iframe
                  srcDoc={previewHtml}
                  className="h-full w-full"
                  title="Resume preview"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-50 p-8 text-center text-sm text-slate-500">
                  {rendering || !isLoaded
                    ? "Rendering your resume…"
                    : "Click Refresh Preview to render your resume."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <TemplateModal
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={(id) => setTemplateId(id)}
        currentId={templateId}
      />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#fafafa]"><div className="text-sm text-slate-500">Loading builder...</div></div>}>
      <BuilderContent />
    </Suspense>
  );
}
