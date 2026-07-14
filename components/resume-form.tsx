"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type AnyObj = Record<string, any>;

export interface ResumeFormProps {
  value: AnyObj;
  onChange: (data: AnyObj) => void;
  className?: string;
}

type TabKey =
  | "basics"
  | "work"
  | "education"
  | "skills"
  | "projects"
  | "certificates"
  | "languages"
  | "awards";

const TABS: { key: TabKey; label: string }[] = [
  { key: "basics", label: "Basics" },
  { key: "work", label: "Work" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "certificates", label: "Certificates" },
  { key: "languages", label: "Languages" },
  { key: "awards", label: "Awards" },
];

function ensureArray<T = any>(v: any): T[] {
  return Array.isArray(v) ? v : [];
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  description,
  onAdd,
  addLabel,
}: {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-slate-100 pb-3">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        ) : null}
      </div>
      {onAdd ? (
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          {addLabel || "Add"}
        </Button>
      ) : null}
    </div>
  );
}

function ItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">{title}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
          aria-label="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function ResumeForm({ value, onChange, className }: ResumeFormProps) {
  const [tab, setTab] = useState<TabKey>("basics");
  const data = value || {};

  const update = (path: string[], next: any) => {
    const draft: AnyObj = { ...data };
    let cur: AnyObj = draft;
    for (let i = 0; i < path.length - 1; i++) {
      const k = path[i];
      cur[k] = { ...(cur[k] || {}) };
      cur = cur[k];
    }
    cur[path[path.length - 1]] = next;
    onChange(draft);
  };

  const updateArray = (key: string, next: any[]) => {
    onChange({ ...data, [key]: next });
  };

  // -------- BASICS --------
  const basics: AnyObj = data.basics || {};
  const location: AnyObj = basics.location || {};

  const setBasics = (k: string, v: any) =>
    onChange({ ...data, basics: { ...basics, [k]: v } });
  const setLocation = (k: string, v: any) =>
    onChange({
      ...data,
      basics: { ...basics, location: { ...location, [k]: v } },
    });

  // -------- WORK --------
  const work = ensureArray(data.work);
  const addWork = () =>
    updateArray("work", [
      ...work,
      {
        position: "",
        name: "",
        startDate: "",
        endDate: "",
        summary: "",
        highlights: [],
      },
    ]);
  const removeWork = (i: number) =>
    updateArray("work", work.filter((_, idx) => idx !== i));
  const setWork = (i: number, patch: AnyObj) =>
    updateArray(
      "work",
      work.map((w, idx) => (idx === i ? { ...w, ...patch } : w))
    );

  // -------- EDUCATION --------
  const education = ensureArray(data.education);
  const addEducation = () =>
    updateArray("education", [
      ...education,
      {
        institution: "",
        area: "",
        studyType: "",
        startDate: "",
        endDate: "",
        score: "",
      },
    ]);
  const removeEducation = (i: number) =>
    updateArray("education", education.filter((_, idx) => idx !== i));
  const setEducation = (i: number, patch: AnyObj) =>
    updateArray(
      "education",
      education.map((e, idx) => (idx === i ? { ...e, ...patch } : e))
    );

  // -------- SKILLS --------
  const skills = ensureArray(data.skills);
  const addSkill = () =>
    updateArray("skills", [...skills, { name: "", level: "", keywords: [] }]);
  const removeSkill = (i: number) =>
    updateArray("skills", skills.filter((_, idx) => idx !== i));
  const setSkill = (i: number, patch: AnyObj) =>
    updateArray(
      "skills",
      skills.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );

  // -------- PROJECTS --------
  const projects = ensureArray(data.projects);
  const addProject = () =>
    updateArray("projects", [
      ...projects,
      { name: "", description: "", url: "", startDate: "", endDate: "" },
    ]);
  const removeProject = (i: number) =>
    updateArray("projects", projects.filter((_, idx) => idx !== i));
  const setProject = (i: number, patch: AnyObj) =>
    updateArray(
      "projects",
      projects.map((p, idx) => (idx === i ? { ...p, ...patch } : p))
    );

  // -------- CERTIFICATES --------
  const certificates = ensureArray(data.certificates);
  const addCertificate = () =>
    updateArray("certificates", [
      ...certificates,
      { name: "", issuer: "", date: "", url: "" },
    ]);
  const removeCertificate = (i: number) =>
    updateArray("certificates", certificates.filter((_, idx) => idx !== i));
  const setCertificate = (i: number, patch: AnyObj) =>
    updateArray(
      "certificates",
      certificates.map((c, idx) => (idx === i ? { ...c, ...patch } : c))
    );

  // -------- LANGUAGES --------
  const languages = ensureArray(data.languages);
  const addLanguage = () =>
    updateArray("languages", [...languages, { language: "", fluency: "" }]);
  const removeLanguage = (i: number) =>
    updateArray("languages", languages.filter((_, idx) => idx !== i));
  const setLanguage = (i: number, patch: AnyObj) =>
    updateArray(
      "languages",
      languages.map((l, idx) => (idx === i ? { ...l, ...patch } : l))
    );

  // -------- AWARDS --------
  const awards = ensureArray(data.awards);
  const addAward = () =>
    updateArray("awards", [
      ...awards,
      { title: "", awarder: "", date: "", summary: "" },
    ]);
  const removeAward = (i: number) =>
    updateArray("awards", awards.filter((_, idx) => idx !== i));
  const setAward = (i: number, patch: AnyObj) =>
    updateArray(
      "awards",
      awards.map((a, idx) => (idx === i ? { ...a, ...patch } : a))
    );

  // -------- KEYWORDS HELPER --------
  function KeywordsEditor({
    keywords,
    onChange,
    placeholder = "Add keyword + Enter",
  }: {
    keywords: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
  }) {
    const [val, setVal] = useState("");
    const add = () => {
      const t = val.trim();
      if (!t) return;
      if (keywords.includes(t)) {
        setVal("");
        return;
      }
      onChange([...keywords, t]);
      setVal("");
    };
    return (
      <div>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {keywords.map((k) => (
            <span
              key={k}
              className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700"
            >
              {k}
              <button
                type="button"
                onClick={() => onChange(keywords.filter((x) => x !== k))}
                className="text-brand-600 hover:text-brand-800"
                aria-label={`Remove ${k}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
          <Button type="button" variant="outline" size="md" onClick={add}>
            Add
          </Button>
        </div>
      </div>
    );
  }

  // -------- RENDER --------
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Tabs */}
      <div className="sticky top-0 z-10 -mx-1 mb-4 overflow-x-auto bg-white/90 backdrop-blur">
        <div className="flex min-w-max gap-1 border-b border-slate-200 px-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "relative px-3 py-2.5 text-sm font-medium transition-colors",
                tab === t.key
                  ? "text-brand-700"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {t.label}
              {tab === t.key ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {tab === "basics" ? (
          <section className="space-y-4">
            <SectionHeader
              title="Basics"
              description="Your name, contact details, and a short summary."
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Full name">
                <Input
                  value={basics.name || ""}
                  onChange={(e) => setBasics("name", e.target.value)}
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Headline / Title">
                <Input
                  value={basics.label || ""}
                  onChange={(e) => setBasics("label", e.target.value)}
                  placeholder="Senior Software Engineer"
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={basics.email || ""}
                  onChange={(e) => setBasics("email", e.target.value)}
                  placeholder="jane@example.com"
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={basics.phone || ""}
                  onChange={(e) => setBasics("phone", e.target.value)}
                  placeholder="+1 555 123 4567"
                />
              </Field>
              <Field label="Website / URL">
                <Input
                  value={basics.url || ""}
                  onChange={(e) => setBasics("url", e.target.value)}
                  placeholder="https://jane.dev"
                />
              </Field>
              <Field label="Profile image URL">
                <Input
                  value={basics.image || ""}
                  onChange={(e) => setBasics("image", e.target.value)}
                  placeholder="https://..."
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="City">
                <Input
                  value={location.city || ""}
                  onChange={(e) => setLocation("city", e.target.value)}
                />
              </Field>
              <Field label="Region / State">
                <Input
                  value={location.region || ""}
                  onChange={(e) => setLocation("region", e.target.value)}
                />
              </Field>
              <Field label="Country">
                <Input
                  value={location.countryCode || ""}
                  onChange={(e) => setLocation("countryCode", e.target.value)}
                  placeholder="US"
                />
              </Field>
              <Field label="Postal code">
                <Input
                  value={location.postalCode || ""}
                  onChange={(e) => setLocation("postalCode", e.target.value)}
                />
              </Field>
              <Field label="Address" className="md:col-span-2">
                <Input
                  value={location.address || ""}
                  onChange={(e) => setLocation("address", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Summary">
              <Textarea
                value={basics.summary || ""}
                onChange={(e) => setBasics("summary", e.target.value)}
                placeholder="A short intro highlighting your strengths..."
                className="min-h-[120px]"
              />
            </Field>
          </section>
        ) : null}

        {tab === "work" ? (
          <section className="space-y-4">
            <SectionHeader
              title="Work Experience"
              description="List your most relevant roles, newest first."
              onAdd={addWork}
              addLabel="Add role"
            />
            {work.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                No roles yet. Click &quot;Add role&quot; to start.
              </p>
            ) : null}
            <div className="space-y-3">
              {work.map((w: AnyObj, i: number) => (
                <ItemCard
                  key={i}
                  title={w.position || w.name || `Role #${i + 1}`}
                  onRemove={() => removeWork(i)}
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Position">
                      <Input
                        value={w.position || ""}
                        onChange={(e) =>
                          setWork(i, { position: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Company">
                      <Input
                        value={w.name || ""}
                        onChange={(e) => setWork(i, { name: e.target.value })}
                      />
                    </Field>
                    <Field label="Start date">
                      <Input
                        type="month"
                        value={w.startDate || ""}
                        onChange={(e) =>
                          setWork(i, { startDate: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="End date">
                      <Input
                        type="month"
                        value={w.endDate || ""}
                        onChange={(e) =>
                          setWork(i, { endDate: e.target.value })
                        }
                        placeholder="Leave blank if current"
                      />
                    </Field>
                    <Field label="URL" className="md:col-span-2">
                      <Input
                        value={w.url || ""}
                        onChange={(e) => setWork(i, { url: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Summary">
                    <Textarea
                      value={w.summary || ""}
                      onChange={(e) => setWork(i, { summary: e.target.value })}
                    />
                  </Field>
                  <Field label="Highlights">
                    <KeywordsEditor
                      keywords={ensureArray(w.highlights)}
                      onChange={(next) => setWork(i, { highlights: next })}
                      placeholder="Add a highlight + Enter"
                    />
                  </Field>
                </ItemCard>
              ))}
            </div>
          </section>
        ) : null}

        {tab === "education" ? (
          <section className="space-y-4">
            <SectionHeader
              title="Education"
              onAdd={addEducation}
              addLabel="Add education"
            />
            <div className="space-y-3">
              {education.map((e: AnyObj, i: number) => (
                <ItemCard
                  key={i}
                  title={e.institution || `Education #${i + 1}`}
                  onRemove={() => removeEducation(i)}
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Institution">
                      <Input
                        value={e.institution || ""}
                        onChange={(ev) =>
                          setEducation(i, { institution: ev.target.value })
                        }
                      />
                    </Field>
                    <Field label="Area of study">
                      <Input
                        value={e.area || ""}
                        onChange={(ev) =>
                          setEducation(i, { area: ev.target.value })
                        }
                      />
                    </Field>
                    <Field label="Study type / Degree">
                      <Input
                        value={e.studyType || ""}
                        onChange={(ev) =>
                          setEducation(i, { studyType: ev.target.value })
                        }
                      />
                    </Field>
                    <Field label="Score / GPA">
                      <Input
                        value={e.score || ""}
                        onChange={(ev) =>
                          setEducation(i, { score: ev.target.value })
                        }
                      />
                    </Field>
                    <Field label="Start date">
                      <Input
                        type="month"
                        value={e.startDate || ""}
                        onChange={(ev) =>
                          setEducation(i, { startDate: ev.target.value })
                        }
                      />
                    </Field>
                    <Field label="End date">
                      <Input
                        type="month"
                        value={e.endDate || ""}
                        onChange={(ev) =>
                          setEducation(i, { endDate: ev.target.value })
                        }
                      />
                    </Field>
                  </div>
                </ItemCard>
              ))}
              {education.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                  No education entries yet.
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        {tab === "skills" ? (
          <section className="space-y-4">
            <SectionHeader
              title="Skills"
              description="Group your skills with keywords for ATS matching."
              onAdd={addSkill}
              addLabel="Add group"
            />
            <div className="space-y-3">
              {skills.map((s: AnyObj, i: number) => (
                <ItemCard
                  key={i}
                  title={s.name || `Skill group #${i + 1}`}
                  onRemove={() => removeSkill(i)}
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Group name">
                      <Input
                        value={s.name || ""}
                        onChange={(e) => setSkill(i, { name: e.target.value })}
                        placeholder="e.g. Frontend"
                      />
                    </Field>
                    <Field label="Level">
                      <Input
                        value={s.level || ""}
                        onChange={(e) => setSkill(i, { level: e.target.value })}
                        placeholder="Advanced"
                      />
                    </Field>
                  </div>
                  <Field label="Keywords">
                    <KeywordsEditor
                      keywords={ensureArray(s.keywords)}
                      onChange={(next) => setSkill(i, { keywords: next })}
                    />
                  </Field>
                </ItemCard>
              ))}
              {skills.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                  No skill groups yet.
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        {tab === "projects" ? (
          <section className="space-y-4">
            <SectionHeader
              title="Projects"
              onAdd={addProject}
              addLabel="Add project"
            />
            <div className="space-y-3">
              {projects.map((p: AnyObj, i: number) => (
                <ItemCard
                  key={i}
                  title={p.name || `Project #${i + 1}`}
                  onRemove={() => removeProject(i)}
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Name">
                      <Input
                        value={p.name || ""}
                        onChange={(e) =>
                          setProject(i, { name: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="URL">
                      <Input
                        value={p.url || ""}
                        onChange={(e) => setProject(i, { url: e.target.value })}
                      />
                    </Field>
                    <Field label="Start date">
                      <Input
                        type="month"
                        value={p.startDate || ""}
                        onChange={(e) =>
                          setProject(i, { startDate: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="End date">
                      <Input
                        type="month"
                        value={p.endDate || ""}
                        onChange={(e) =>
                          setProject(i, { endDate: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                  <Field label="Description">
                    <Textarea
                      value={p.description || ""}
                      onChange={(e) =>
                        setProject(i, { description: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Highlights">
                    <KeywordsEditor
                      keywords={ensureArray(p.highlights)}
                      onChange={(next) => setProject(i, { highlights: next })}
                      placeholder="Add highlight + Enter"
                    />
                  </Field>
                </ItemCard>
              ))}
              {projects.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                  No projects yet.
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        {tab === "certificates" ? (
          <section className="space-y-4">
            <SectionHeader
              title="Certificates"
              onAdd={addCertificate}
              addLabel="Add certificate"
            />
            <div className="space-y-3">
              {certificates.map((c: AnyObj, i: number) => (
                <ItemCard
                  key={i}
                  title={c.name || `Certificate #${i + 1}`}
                  onRemove={() => removeCertificate(i)}
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Name">
                      <Input
                        value={c.name || ""}
                        onChange={(e) =>
                          setCertificate(i, { name: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Issuer">
                      <Input
                        value={c.issuer || ""}
                        onChange={(e) =>
                          setCertificate(i, { issuer: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Date">
                      <Input
                        type="month"
                        value={c.date || ""}
                        onChange={(e) =>
                          setCertificate(i, { date: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="URL">
                      <Input
                        value={c.url || ""}
                        onChange={(e) =>
                          setCertificate(i, { url: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                </ItemCard>
              ))}
              {certificates.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                  No certificates yet.
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        {tab === "languages" ? (
          <section className="space-y-4">
            <SectionHeader
              title="Languages"
              onAdd={addLanguage}
              addLabel="Add language"
            />
            <div className="space-y-3">
              {languages.map((l: AnyObj, i: number) => (
                <ItemCard
                  key={i}
                  title={l.language || `Language #${i + 1}`}
                  onRemove={() => removeLanguage(i)}
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Language">
                      <Input
                        value={l.language || ""}
                        onChange={(e) =>
                          setLanguage(i, { language: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Fluency">
                      <Input
                        value={l.fluency || ""}
                        onChange={(e) =>
                          setLanguage(i, { fluency: e.target.value })
                        }
                        placeholder="Native, Fluent, Conversational..."
                      />
                    </Field>
                  </div>
                </ItemCard>
              ))}
              {languages.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                  No languages yet.
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        {tab === "awards" ? (
          <section className="space-y-4">
            <SectionHeader
              title="Awards"
              onAdd={addAward}
              addLabel="Add award"
            />
            <div className="space-y-3">
              {awards.map((a: AnyObj, i: number) => (
                <ItemCard
                  key={i}
                  title={a.title || `Award #${i + 1}`}
                  onRemove={() => removeAward(i)}
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Title">
                      <Input
                        value={a.title || ""}
                        onChange={(e) =>
                          setAward(i, { title: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Awarder">
                      <Input
                        value={a.awarder || ""}
                        onChange={(e) =>
                          setAward(i, { awarder: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Date">
                      <Input
                        type="month"
                        value={a.date || ""}
                        onChange={(e) => setAward(i, { date: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Summary">
                    <Textarea
                      value={a.summary || ""}
                      onChange={(e) =>
                        setAward(i, { summary: e.target.value })
                      }
                    />
                  </Field>
                </ItemCard>
              ))}
              {awards.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                  No awards yet.
                </p>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default ResumeForm;
