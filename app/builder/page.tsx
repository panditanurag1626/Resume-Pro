"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
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
  id,
  children,
  onAdd,
  addLabel,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <section id={id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
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

const IFRAME_W = 794;
const IFRAME_H = 1123;

function ModalTemplatePreview({ id, name }: { id: number; name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / IFRAME_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative aspect-[3/4] overflow-hidden bg-white">
      {scale > 0 && (
        <iframe
          src={`/api/templates/${id}/preview`}
          title={name}
          loading="lazy"
          sandbox="allow-same-origin allow-scripts"
          className="pointer-events-none absolute left-0 top-0 border-0"
          style={{
            width: IFRAME_W,
            height: IFRAME_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      )}
    </div>
  );
}

const PREVIEW_IFRAME_W = 794;
const PREVIEW_IFRAME_H = 1123;

function FullPagePreview({
  html,
  iframeRef,
}: {
  html: string;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [iframeH, setIframeH] = useState(PREVIEW_IFRAME_H);

  /* ── FIX: Observe wrapper size, compute scale to fit width.
        No Math.min cap — on narrow screens the scaled content
        can be smaller than the wrapper, so we let the inner
        container hold the FULL unscaled A4 dimensions and
        visually shrink via CSS transform. This way the scrollable
        area always matches the real content size. ──────────── */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const availableW = entry.contentRect.width;
      const s = Math.min(availableW / PREVIEW_IFRAME_W, 1);
      setScale(s);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    function onLoaded() {
      try {
        const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
        if (!doc) return;
        const h = doc.body?.scrollHeight || doc.documentElement?.scrollHeight;
        if (h && h > 0) setIframeH(h);
      } catch {}
    }
    iframe.addEventListener("load", onLoaded);
    return () => iframe.removeEventListener("load", onLoaded);
  }, [html]);

  /* ── FIX: Use FULL unscaled dimensions for the scrollable container.
        The iframe uses transform:scale to visually shrink, but the
        DOM box stays at full A4 size (794 × iframeH). This means
        the wrapper's scrollable area = real content size, so both
        vertical and horizontal scrollbars appear when needed. ── */
  return (
    <div
      ref={wrapperRef}
      className="w-full overflow-auto rounded-lg bg-slate-300"
      style={{ height: "calc(100vh - 84px)" }}
    >
      {scale > 0 && (
        <div
          style={{
            width: PREVIEW_IFRAME_W,
            height: iframeH,
            margin: "20px auto",
            position: "relative",
          }}
        >
          <iframe
            ref={iframeRef}
            srcDoc={html}
            title="Resume preview"
            className="pointer-events-none border-0"
            style={{
              width: PREVIEW_IFRAME_W,
              height: iframeH,
              border: "none",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}

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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

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
        const fetched = d?.data?.templates || d?.templates || [];
        templatesCache = fetched;
        setTemplates(fetched);
      })
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCategory("all");
    }
  }, [open]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t: any) => {
      if (t.category) set.add(t.category);
      (t.tags || []).forEach((tag: string) => set.add(tag));
    });
    return ["all", ...Array.from(set).slice(0, 10)];
  }, [templates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t: any) => {
      if (
        category !== "all" &&
        t.category !== category &&
        !(t.tags || []).includes(category)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.tags || []).some((tag: string) => tag.toLowerCase().includes(q))
      );
    });
  }, [templates, query, category]);

  if (!open) return null;

  const items =
    filtered.length > 0
      ? filtered
      : templates.length > 0
      ? templates
      : Array.from({ length: 62 }).map((_, i) => ({
          id: i + 1,
          name: `Template ${i + 1}`,
          description: "",
          tags: [],
        }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="flex h-[85vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-xl">
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
            <>
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-9 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:text-slate-600"
                      aria-label="Clear search"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        category === c
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {c === "all" ? "All" : c}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mb-4 text-sm text-slate-500">
                {items.length} of {templates.length} templates
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((t: any) => {
                  const active = t.id === currentId;
                  return (
                    <div
                      key={t.id}
                      className={`group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md ${
                        active
                          ? "ring-2 ring-brand-500 ring-offset-2"
                          : ""
                      }`}
                    >
                      <div className="block">
                        <ModalTemplatePreview id={t.id} name={t.name} />
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {t.name || `Template ${t.id}`}
                        </h3>
                        {t.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                            {t.description}
                          </p>
                        )}
                        {(t.tags || []).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {(t.tags || []).slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                className="inline-block rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-auto pt-3 border-t border-slate-100">
                          <button
                            onClick={() => {
                              onSelect(t.id);
                              onClose();
                            }}
                            className={`inline-flex h-8 w-full items-center justify-center rounded text-xs font-medium transition ${
                              active
                                ? "bg-brand-600 text-white hover:bg-brand-700"
                                : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                          >
                            {active ? "Selected" : "Select this"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {items.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
                  No templates match your search.
                </div>
              )}
            </>
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
  const [previewMode, setPreviewMode] = useState(() => params.get("preview") === "1");
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const didInitRef = useRef(false);

  function togglePreview(v: boolean) {
    setPreviewMode(v);
    const url = new URL(window.location.href);
    if (v) url.searchParams.set("preview", "1");
    else url.searchParams.delete("preview");
    window.history.replaceState({}, "", url.toString());
  }

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

  // Escape key exits preview mode
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && previewMode) {
        e.preventDefault();
        togglePreview(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [previewMode]);

  const updateBasics = useCallback((patch: Partial<Basics>) => {
    setData((d) => ({ ...d, basics: { ...d.basics, ...patch } }));
  }, []);

  const updateBasicsLocation = useCallback((patch: Partial<Basics["location"]>) => {
    setData((d) => ({
      ...d,
      basics: { ...d.basics, location: { ...d.basics.location, ...patch } },
    }));
  }, []);

  function isSectionFilled(id: SectionId): boolean {
    switch (id) {
      case "basics":
        return !!(data.basics.name || data.basics.label || data.basics.email);
      case "summary":
        return !!data.basics.summary;
      case "work":
        return data.work.some((w) => w.name || w.position);
      case "education":
        return data.education.some((e) => e.institution || e.area);
      case "skills":
        return data.skills.some((s) => s.name || (s.keywords || []).length);
      case "projects":
        return data.projects.some((p) => p.name || p.description);
      case "certifications":
        return data.certifications.some((c) => c.name || c.issuer);
      case "languages":
        return data.languages.some((l) => l.language);
      case "awards":
        return data.awards.some((a) => a.title || a.awarder);
      default:
        return false;
    }
  }

  function scrollToSection(id: SectionId) {
    setOpen((o) => ({ ...o, [id]: true }));
    setTimeout(() => {
      const el = document.getElementById(`section-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

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

  function cleanData(d: ResumeData): any {
    const b = d.basics;
    const hasBasics =
      b.name || b.label || b.email || b.phone || b.url || b.summary ||
      b.location.city || b.location.region || b.location.countryCode;

    const work = d.work.filter((w) => w.name || w.position || w.summary || (w.highlights || []).length);
    const education = d.education.filter((e) => e.institution || e.area || e.studyType);
    const skills = d.skills.filter((s) => s.name || (s.keywords || []).length);
    const projects = d.projects.filter((p) => p.name || p.description || (p.highlights || []).length);
    const certifications = d.certifications.filter((c) => c.name || c.issuer);
    const languages = d.languages.filter((l) => l.language);
    const awards = d.awards.filter((a) => a.title || a.awarder);

    return {
      basics: hasBasics ? b : { name: "", label: "", email: "", phone: "", url: "", summary: "", location: { address: "", city: "", region: "", countryCode: "" }, profiles: [] },
      work: work.length ? work : undefined,
      education: education.length ? education : undefined,
      skills: skills.length ? skills : undefined,
      projects: projects.length ? projects : undefined,
      certifications: certifications.length ? certifications : undefined,
      languages: languages.length ? languages : undefined,
      awards: awards.length ? awards : undefined,
    };
  }

  async function refreshPreview(useData?: ResumeData, useTemplate?: number) {
    const payloadData = useData ?? data;
    const tpl = useTemplate ?? templateId;
    setRendering(true);
    try {
      const res = await fetch(`/api/templates/${tpl}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: cleanData(payloadData) }),
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
    togglePreview(true);
  }

  async function downloadPdf() {
    if (!rendering && !previewHtml) return;

    try {
      const res = await fetch(`/api/templates/${templateId}/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: cleanData(data) }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(err?.message || "PDF generation failed");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("PDF generation failed. Please try again.");
    }
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
      {/* Top bar — hidden in preview mode */}
      {!previewMode && (
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
      )}

      {/* Full-screen preview mode */}
      {previewMode && (
        <div className="flex flex-1 flex-col">
          <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-3 shadow-sm backdrop-blur">
            <button
              onClick={() => togglePreview(false)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Edit
            </button>
            <button
              onClick={downloadPdf}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </button>
          </header>
          <div className="flex flex-1 items-start justify-center bg-slate-200 pt-[68px]">
            {previewHtml ? (
              <FullPagePreview html={previewHtml} iframeRef={previewIframeRef} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Rendering your resume…
              </div>
            )}
          </div>
        </div>
      )}

      {/* Two-column workspace */}
      {!previewMode && (
      <div className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* LEFT: form */}
        <div className="flex flex-col lg:max-h-[calc(100vh-110px)]">
          {/* Section toggles - sticky */}
          <div className="sticky top-0 z-10 mb-4 flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
            {SECTIONS.map((s) => {
              const filled = isSectionFilled(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 ${
                    filled
                      ? "border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-200 hover:border-purple-500 hover:text-purple-800"
                      : "border-slate-200 bg-white text-slate-500 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
                  }`}
                >
                  {filled && "✓ "}
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Scrollable sections */}
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">

          {/* Basics */}
          {open.basics && (
            <SectionShell title="Basics" id="section-basics">
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
            <SectionShell title="Summary" id="section-summary">
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
              id="section-work"
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
              id="section-education"
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
              id="section-skills"
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
              id="section-projects"
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
              id="section-certifications"
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
              id="section-languages"
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
              id="section-awards"
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
      )}

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
