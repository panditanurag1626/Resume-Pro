"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  getResume,
  listResumes,
  saveResume,
  type LocalResume,
} from "@/lib/local-resumes";
import { calculateAtsScores } from "@/lib/ats";

type BreakdownItem = {
  score?: number;
  max?: number;
  weight?: number;
  notes?: string[];
};

type RuleBased = {
  overall_score: number;
  breakdown?: Record<string, BreakdownItem | number>;
  feedback?: {
    missing?: string[];
    strong_verbs?: string[];
    weak_verbs?: string[];
    quick_wins?: string[];
    [k: string]: any;
  };
  stats?: Record<string, any>;
};

type CareerUpgrade = {
  target_role: string;
  market_demand: "High" | "Very High";
  estimated_salary_boost: string;
  recommended_skills: string[];
};

type AiAnalysis = {
  missing_sections?: string[];
  weak_areas?: Array<string | { area?: string; issue?: string; fix?: string }>;
  keyword_suggestions?: string[];
  rewritten_summary?: string;
  quick_wins?: string[];
  career_upgrades?: CareerUpgrade[];
  [k: string]: any;
};

type Result = {
  rule_based: RuleBased;
  ai_analysis?: AiAnalysis;
};

const SAMPLE = `{
  "basics": {
    "name": "Jane Doe",
    "label": "Senior Software Engineer",
    "email": "jane@example.com",
    "phone": "+1 555 123 4567",
    "summary": "Software engineer with 6+ years building scalable web apps."
  },
  "work": [
    {
      "name": "Acme Corp",
      "position": "Senior Engineer",
      "startDate": "2022-01",
      "endDate": "Present",
      "highlights": [
        "Shipped checkout redesign that lifted conversion by 18%",
        "Led migration of 40+ services to Kubernetes"
      ]
    }
  ],
  "skills": [
    { "name": "Languages", "keywords": ["TypeScript", "Python", "Go"] }
  ]
}`;

function CircularScore({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score || 0)));
  const color =
    clamped >= 80 ? "#16a34a" : clamped >= 60 ? "#d97706" : "#dc2626";
  const bg = `conic-gradient(${color} ${clamped * 3.6}deg, #e2e8f0 0deg)`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        className="grid h-44 w-44 place-items-center rounded-full"
        style={{ background: bg }}
      >
        <div className="grid h-36 w-36 place-items-center rounded-full bg-white">
          <div className="text-center">
            <div className="text-5xl font-semibold text-slate-900">
              {clamped}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              out of 100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  max = 100,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium capitalize text-slate-700">
          {label.replace(/_/g, " ")}
        </span>
        <span className="text-xs text-slate-500">
          {value}
          {max !== 100 && `/${max}`}
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex h-8 items-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:border-brand-300"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function getResumeHash(data: any): string {
  const str = JSON.stringify(data || {});
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return "ats_ai_cache_" + Math.abs(hash);
}

export default function AtsAnalyzer() {
  const searchParams = useSearchParams();
  const initialResumeId = searchParams.get("resumeId") || "";

  const [options, setOptions] = useState<LocalResume[]>([]);
  const [mode, setMode] = useState<"paste" | "saved" | "upload">(
    initialResumeId ? "saved" : "upload"
  );
  const [resumeId, setResumeId] = useState<string>(initialResumeId);
  const [jsonText, setJsonText] = useState<string>(SAMPLE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const autoRanRef = useRef(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const name = file.name.toLowerCase();
      if (
        name.endsWith(".pdf") ||
        name.endsWith(".docx") ||
        name.endsWith(".txt") ||
        name.endsWith(".png") ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg")
      ) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Unsupported file format. Please upload PDF, DOCX, TXT, PNG, or JPG/JPEG.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const name = file.name.toLowerCase();
      if (
        name.endsWith(".pdf") ||
        name.endsWith(".docx") ||
        name.endsWith(".txt") ||
        name.endsWith(".png") ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg")
      ) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Unsupported file format. Please upload PDF, DOCX, TXT, PNG, or JPG/JPEG.");
      }
    }
  };

  // Load local resumes
  useEffect(() => {
    const rows = listResumes();
    setOptions(rows);
    if (!initialResumeId && rows.length > 0) {
      setMode("saved");
    }
  }, [initialResumeId]);

  async function analyzeResume(resumeData: any, fromId?: string) {
    setError(null);
    setLoading(true);
    setAiLoading(true);

    // Stage 1: Instantly calculate the rule-based ATS score client-side and display it
    let ruleBased: any = null;
    try {
      ruleBased = calculateAtsScores(resumeData);
      setResult({ rule_based: ruleBased });
      setLoading(false); // Instantly stop primary loading screen!
    } catch (err) {
      console.error("Client-side ATS scoring failed:", err);
    }

    // Stage 1.5: Check client-side localStorage bubble memory cache
    const cacheKey = getResumeHash(resumeData);
    let cachedAnalysis: any = null;
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          cachedAnalysis = JSON.parse(cached);
        } catch (e) {
          console.error("Error parsing cached AI analysis:", e);
        }
      }
    }

    if (cachedAnalysis) {
      setResult({
        rule_based: ruleBased || calculateAtsScores(resumeData),
        ai_analysis: cachedAnalysis,
      });
      setAiLoading(false);
      return;
    }

    // Stage 2: Load the full AI analysis in the background
    try {
      const res = await fetch("/api/ats-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeData }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || `AI recommendations failed: status ${res.status}.`);
        return;
      }
      const body = await res.json();
      // The endpoint returns { status, data: <result> }, but tolerate either shape.
      const payload: Result = body?.data ?? body;
      setResult(payload);

      // Save to cache for next time!
      if (payload.ai_analysis && typeof window !== "undefined") {
        localStorage.setItem(cacheKey, JSON.stringify(payload.ai_analysis));
      }

      // Persist score on the local resume if we came from one
      if (fromId) {
        const overall = payload?.rule_based?.overall_score;
        if (typeof overall === "number") {
          const existing = getResume(fromId);
          if (existing) {
            saveResume({
              id: existing.id,
              title: existing.title,
              templateId: existing.templateId,
              data: existing.data,
              lastAtsScore: overall,
            });
            // Refresh local options so the dropdown reflects the new score
            setOptions(listResumes());
          }
        }
      }
    } catch {
      setError("Failed to fetch full AI suggestions.");
    } finally {
      setLoading(false);
      setAiLoading(false);
    }
  }

  async function onAnalyzeClick() {
    if (mode === "saved") {
      if (!resumeId) {
        setError("Please pick a resume.");
        return;
      }
      const row = getResume(resumeId);
      if (!row) {
        setError("That resume was not found in this browser.");
        return;
      }
      await analyzeResume(row.data, resumeId);
    } else if (mode === "paste") {
      let parsed: any;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        setError("Invalid JSON. Please check your input.");
        return;
      }
      await analyzeResume(parsed);
    } else if (mode === "upload") {
      if (!selectedFile) {
        setError("Please select a resume file to upload.");
        return;
      }
      setError(null);
      setResult(null);
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch("/api/upload-resume", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data?.message || data?.error || `Upload failed with status ${res.status}.`);
          return;
        }

        const body = await res.json();

        // Save parsed resume locally in localStorage
        const title = selectedFile.name.replace(/\.[a-zA-Z0-9]+$/i, "");
        const localRow = saveResume({
          title,
          templateId: 1,
          data: body.data,
          lastAtsScore: body.ats_scores?.overall_score || 0,
        });

        // Update active selection to local copy
        setResumeId(localRow.id);
        setOptions(listResumes());

        // NOW trigger full AI analysis using the parsed resume data! (non-blocking)
        analyzeResume(body.data, localRow.id);
      } catch (err: any) {
        setError(`Upload error: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    }
  }

  // Auto-load + analyze if resumeId provided in URL
  useEffect(() => {
    if (autoRanRef.current) return;
    if (!initialResumeId) return;
    const row = getResume(initialResumeId);
    if (!row) return;
    autoRanRef.current = true;
    analyzeResume(row.data, initialResumeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialResumeId]);

  const breakdown = result?.rule_based?.breakdown || {};

  return (
    <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr]">
      {/* Input */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-slate-900">Input</h2>

        <div className="mt-4 flex gap-1.5 flex-wrap">
          <button
            onClick={() => setMode("upload")}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              mode === "upload"
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
            }`}
          >
            Upload Resume
          </button>
          <button
            onClick={() => setMode("saved")}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              mode === "saved"
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
            }`}
          >
            Use a saved resume
          </button>
          <button
            onClick={() => setMode("paste")}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              mode === "paste"
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
            }`}
          >
            Paste JSON Resume
          </button>
        </div>

        {mode === "upload" && (
          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload Resume
            </label>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition min-h-[160px] ${
                dragActive
                  ? "border-brand-500 bg-brand-50/50"
                  : selectedFile
                  ? "border-emerald-500 bg-emerald-50/10"
                  : "border-slate-300 bg-slate-50 hover:border-slate-400"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {!selectedFile ? (
                <div className="space-y-3">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Drag and drop your resume here, or click to browse
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PDF, DOCX, TXT, PNG, or JPG/JPEG (max 16MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 z-20">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px] mx-auto">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="inline-flex items-center text-xs font-medium text-red-600 hover:text-red-700 relative z-30"
                  >
                    Remove file
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {mode === "saved" && (
          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-700">
              Pick a resume
            </label>
            {options.length === 0 ? (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                You have no saved resumes in this browser yet.{" "}
                <a href="/builder" className="font-medium underline">
                  Create one
                </a>{" "}
                or paste JSON instead.
              </p>
            ) : (
              <select
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                <option value="">Select a resume…</option>
                {options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.title || "Untitled Resume"}
                    {o.lastAtsScore != null ? ` (ATS ${o.lastAtsScore})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {mode === "paste" && (
          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-700">
              JSON Resume payload
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={16}
              spellCheck={false}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={onAnalyzeClick}
          disabled={loading}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              AI Engine Processing...
            </span>
          ) : (
            "Analyze resume"
          )}
        </button>
      </div>

      {/* Results */}
      <div>
        {!result ? (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Run an analysis
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Your results will show up here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
                <CircularScore score={result.rule_based?.overall_score || 0} />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Your ATS score
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Based on contact info, work history, quantification,
                    keywords and structure.
                  </p>
                  {result.rule_based?.stats && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {Object.entries(result.rule_based.stats)
                        .slice(0, 6)
                        .map(([k, v]) => (
                          <div
                            key={k}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                          >
                            <div className="text-xs uppercase tracking-wide text-slate-500">
                              {k.replace(/_/g, " ")}
                            </div>
                            <div className="text-sm font-semibold text-slate-900">
                              {typeof v === "number" || typeof v === "string"
                                ? String(v)
                                : JSON.stringify(v)}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Breakdown */}
            {Object.keys(breakdown).length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-base font-semibold text-slate-900">
                  Category breakdown
                </h3>
                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {Object.entries(breakdown).map(([key, item]: any) => {
                    const val =
                      typeof item === "number"
                        ? item
                        : item?.score ?? item?.value ?? 0;
                    const max =
                      typeof item === "number" ? 100 : item?.max ?? 100;
                    return <Bar key={key} label={key} value={val} max={max} />;
                  })}
                </div>
              </div>
            )}

            {/* AI Career Progression Hub (Ultra-personalized AI style) */}
            {result.ai_analysis?.career_upgrades?.length ? (
              <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/20 p-6 shadow-[0_4px_25px_rgba(99,102,241,0.06)]">
                {/* AI glow effect */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent uppercase">
                    AI Career Progression Hub
                  </h3>
                </div>
                <p className="mt-2 text-sm text-slate-500 max-w-xl">
                  Based on your current experience, our AI has mapped out higher-paying target roles and the exact skills you need to add to land them.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  {result.ai_analysis.career_upgrades.map((up, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl border border-slate-200/80 bg-white p-5 transition-all duration-300 hover:border-indigo-300 hover:shadow-[0_4px_20px_rgba(99,102,241,0.08)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-md font-semibold text-slate-900 group-hover:text-indigo-900 transition">
                            {up.target_role}
                          </h4>
                          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200/50">
                              {up.market_demand} Demand
                            </span>
                            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200/50">
                              Estimated Boost: {up.estimated_salary_boost}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Recommended Skills to Add
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {up.recommended_skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="inline-flex items-center rounded-lg bg-indigo-50/50 px-2.5 py-1 text-xs font-medium text-indigo-700 border border-indigo-100 hover:bg-indigo-100/50 transition cursor-pointer"
                            >
                              + {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : aiLoading ? (
              <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/10 p-6 shadow-[0_4px_25px_rgba(99,102,241,0.06)] animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent uppercase">
                    AI Insights Loading...
                  </h3>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Our advanced AI model is analyzing your resume content to build a personalized career roadmap and target skill suggestions...
                </p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-slate-200/50 bg-slate-50/50 h-28" />
                  <div className="rounded-xl border border-slate-200/50 bg-slate-50/50 h-28" />
                </div>
              </div>
            ) : null}

            {/* AI Summary & Suggestions Skeleton */}
            {aiLoading && !result.ai_analysis?.rewritten_summary && (
              <div className="rounded-2xl border border-brand-100 bg-brand-50/5 p-6 animate-pulse">
                <div className="h-4 w-40 rounded bg-slate-200" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-4/5 rounded bg-slate-100" />
                </div>
              </div>
            )}

            {/* Missing */}
            {(result.rule_based?.feedback?.missing?.length ||
              result.ai_analysis?.missing_sections?.length) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-base font-semibold text-slate-900">
                  What&apos;s missing
                </h3>
                <ul className="mt-3 space-y-2">
                  {[
                    ...(result.rule_based?.feedback?.missing || []),
                    ...(result.ai_analysis?.missing_sections || []),
                  ].map((m, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strong / weak verbs */}
            {(result.rule_based?.feedback?.strong_verbs?.length ||
              result.rule_based?.feedback?.weak_verbs?.length) && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                  <h4 className="text-sm font-semibold text-emerald-700">
                    Strong verbs
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(result.rule_based?.feedback?.strong_verbs || []).map(
                      (v, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                        >
                          {v}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                  <h4 className="text-sm font-semibold text-red-700">
                    Weak verbs
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(result.rule_based?.feedback?.weak_verbs || []).map(
                      (v, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                        >
                          {v}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AI rewritten summary */}
            {result.ai_analysis?.rewritten_summary && (
              <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">
                    AI-rewritten summary
                  </h3>
                  <CopyButton text={result.ai_analysis.rewritten_summary} />
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {result.ai_analysis.rewritten_summary}
                </p>
              </div>
            )}

            {/* Keywords */}
            {result.ai_analysis?.keyword_suggestions?.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-base font-semibold text-slate-900">
                  Keyword suggestions
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {result.ai_analysis.keyword_suggestions.map((k, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Quick wins */}
            {(result.rule_based?.feedback?.quick_wins?.length ||
              result.ai_analysis?.quick_wins?.length) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-base font-semibold text-slate-900">
                  Quick wins
                </h3>
                <ul className="mt-3 space-y-2">
                  {[
                    ...(result.rule_based?.feedback?.quick_wins || []),
                    ...(result.ai_analysis?.quick_wins || []),
                  ].map((w, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weak areas */}
            {result.ai_analysis?.weak_areas?.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-base font-semibold text-slate-900">
                  Weak areas
                </h3>
                <ul className="mt-3 space-y-4">
                  {result.ai_analysis.weak_areas.map((w, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </span>
                      <div className="flex-1">
                        {typeof w === "string" ? (
                          <span>{w}</span>
                        ) : (
                          <div>
                            {w.area && <span className="font-semibold text-slate-800 block">{w.area}</span>}
                            <span className="text-slate-600 block mt-0.5">{w.issue}</span>
                            {w.fix && (
                              <span className="text-brand-600 font-medium text-xs block mt-1">
                                Fix: {w.fix}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
