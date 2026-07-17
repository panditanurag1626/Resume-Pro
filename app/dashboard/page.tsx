"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import {
  deleteResume,
  listResumes,
  saveResume,
  type LocalResume,
} from "@/lib/local-resumes";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function scoreColor(score?: number) {
  if (score == null) return "bg-slate-100 text-slate-600";
  if (score >= 80) return "bg-emerald-100 text-emerald-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

const UPLOAD_STEPS = [
  { label: "Reading your resume", icon: "upload" },
  { label: "AI parsing content", icon: "sparkle" },
  { label: "Extracting sections", icon: "brain" },
  { label: "Building your profile", icon: "magic" },
] as const;

type UploadStep = (typeof UPLOAD_STEPS)[number];
type UploadPhase = "idle" | "processing" | "saving" | "done";

function AiUploadModal({
  phase,
  steps,
  currentStep,
  fileName,
}: {
  phase: UploadPhase;
  steps: Record<string, "pending" | "active" | "done">;
  currentStep: number;
  fileName: string;
}) {
  const totalDone = Object.values(steps).filter((s) => s === "done").length;
  const progress = (totalDone / UPLOAD_STEPS.length) * 100;
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="ai-upload-modal relative w-full max-w-md mx-4 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 shadow-2xl">
        {/* Sparkle decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="ai-sparkle absolute -top-1 left-1/4 h-1 w-1 rounded-full bg-indigo-400" />
          <div className="ai-sparkle absolute top-8 -right-1 h-1.5 w-1.5 rounded-full bg-purple-400" style={{ animationDelay: "0.8s" }} />
          <div className="ai-sparkle absolute -bottom-1 left-1/3 h-1 w-1 rounded-full bg-cyan-400" style={{ animationDelay: "1.6s" }} />
          <div className="ai-sparkle absolute top-1/3 -left-1 h-1 w-1 rounded-full bg-pink-400" style={{ animationDelay: "2.4s" }} />
          <div className="ai-sparkle absolute bottom-12 right-8 h-1.5 w-1.5 rounded-full bg-amber-400" style={{ animationDelay: "0.4s" }} />
        </div>

        {/* Glow orb */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-3xl" />

        <div className="relative flex flex-col items-center">
          {/* Progress ring + AI icon */}
          <div className="relative mb-6">
            <svg className="ai-ring h-28 w-28 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5"
              />
              <circle
                cx="50" cy="50" r="42"
                fill="none" stroke="url(#aiGradient)" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="ai-icon-pulse flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-1 text-xl font-bold text-white">
            {phase === "done" ? "Resume Ready!" : "AI is Processing"}
          </h2>
          <p className="mb-6 max-w-xs text-center text-sm text-slate-400">
            {phase === "done"
              ? "Your resume has been parsed and is ready to edit."
              : `Analyzing ${fileName}`}
          </p>

          {/* Steps */}
          <div className="mb-6 w-full space-y-2.5">
            {UPLOAD_STEPS.map((step, i) => {
              const state = steps[step.label] || "pending";
              return (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-300 ${
                    state === "active"
                      ? "bg-white/10"
                      : state === "done"
                      ? "bg-white/5"
                      : "bg-transparent"
                  }`}
                >
                  {/* Icon circle */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      state === "done"
                        ? "bg-emerald-500"
                        : state === "active"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 ai-step-glow"
                        : "bg-white/10"
                    }`}
                  >
                    {state === "done" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : step.icon === "sparkle" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
                      </svg>
                    ) : step.icon === "brain" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.58.67 3 1.73 4.01L4 14h4l1.5-2.5" />
                        <path d="M14.5 2A5.5 5.5 0 0 1 20 7.5c0 1.58-.67 3-1.73 4.01L20 14h-4l-1.5-2.5" />
                        <path d="M8 18c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-2H8v2z" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      state === "done"
                        ? "text-emerald-400"
                        : state === "active"
                        ? "text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </span>

                  {/* Spinner for active */}
                  {state === "active" && (
                    <div className="ml-auto">
                      <div className="ai-spinner h-4 w-4 rounded-full border-2 border-indigo-400 border-t-transparent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Saving indicator */}
          {phase === "saving" && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="ai-spinner h-3.5 w-3.5 rounded-full border-2 border-slate-400 border-t-transparent" />
              Saving to builder...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<LocalResume[]>([]);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("idle");
  const [uploadSteps, setUploadSteps] = useState<Record<string, "pending" | "active" | "done">>({});
  const [uploadStepIdx, setUploadStepIdx] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setResumes(listResumes());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, []);

  function refresh() {
    setResumes(listResumes());
  }

  function onDelete(id: string) {
    if (!window.confirm("Delete this resume? This cannot be undone.")) return;
    deleteResume(id);
    refresh();
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setMenuOpen(false);
    setUploading(true);
    setUploadFileName(file.name.replace(/\.[^.]+$/, ""));
    setUploadPhase("processing");
    setUploadStepIdx(0);
    setUploadSteps(
      Object.fromEntries(UPLOAD_STEPS.map((s) => [s.label, "pending"] as const))
    );

    // Animate steps
    let idx = 0;
    const timer = setInterval(() => {
      if (idx >= UPLOAD_STEPS.length) {
        clearInterval(timer);
        return;
      }
      const step = UPLOAD_STEPS[idx];
      setUploadSteps((prev) => {
        const next = { ...prev };
        // Mark previous as done
        if (idx > 0) next[UPLOAD_STEPS[idx - 1].label] = "done";
        // Mark current as active
        next[step.label] = "active";
        return next;
      });
      setUploadStepIdx(idx);
      idx++;
    }, 800);
    stepTimerRef.current = timer;

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload-resume", { method: "POST", body: form });
      const json = await res.json();

      // Wait for all steps to animate
      const remaining = Math.max(0, (UPLOAD_STEPS.length - idx) * 800 + 400);
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
      clearInterval(timer);
      stepTimerRef.current = null;

      // Mark all as done
      setUploadSteps(
        Object.fromEntries(UPLOAD_STEPS.map((s) => [s.label, "done"] as const))
      );

      if (!res.ok) {
        setUploadPhase("idle");
        alert(json?.message || "Upload failed");
        return;
      }

      const data = json.data || json;

      setUploadPhase("saving");
      await new Promise((r) => setTimeout(r, 500));

      setUploadPhase("done");
      await new Promise((r) => setTimeout(r, 600));

      const saved = saveResume({
        title: file.name.replace(/\.[^.]+$/, ""),
        data,
      });
      window.location.href = `/builder?resumeId=${saved.id}`;
    } catch {
      clearInterval(timer);
      stepTimerRef.current = null;
      setUploadPhase("idle");
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <style>{`
        @keyframes ai-sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes ai-ring-pulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(129,140,248,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(129,140,248,0.6)); }
        }
        @keyframes ai-icon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes ai-glow {
          0%, 100% { box-shadow: 0 0 12px rgba(129,140,248,0.3); }
          50% { box-shadow: 0 0 24px rgba(129,140,248,0.6), 0 0 48px rgba(192,132,252,0.2); }
        }
        @keyframes ai-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ai-modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ai-upload-modal { animation: ai-modal-in 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .ai-sparkle { animation: ai-sparkle 3s ease-in-out infinite; }
        .ai-ring { animation: ai-ring-pulse 2s ease-in-out infinite; }
        .ai-icon-pulse { animation: ai-icon-float 3s ease-in-out infinite, ai-glow 2s ease-in-out infinite; }
        .ai-step-glow { animation: ai-glow 1.5s ease-in-out infinite; }
        .ai-spinner { animation: ai-spin 0.8s linear infinite; }
      `}</style>
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              My Resumes
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Your resumes live in this browser. Create, edit, and score them
              without an account.
            </p>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              disabled={uploading}
              className="inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "New resume"}
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-1 w-52 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <Link
                  href="/builder"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  Start from scratch
                </Link>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload resume
                </button>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
              className="hidden"
              onChange={onUpload}
            />
          </div>
        </div>

        <div className="mt-8">
          {!ready ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
              Loading…
            </div>
          ) : resumes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <svg
                  width="22"
                  height="22"
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
              <h3 className="text-base font-semibold text-slate-900">
                No resumes yet
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Create your first resume to get started.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Link
                  href="/builder"
                  className="inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
                >
                  Start from scratch
                </Link>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-60"
                >
                  {uploading ? "Uploading…" : "Upload resume"}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resumes.map((r) => (
                <div
                  key={r.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:border-brand-200 hover:shadow-soft"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-slate-900">
                        {r.title || "Untitled Resume"}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Template #{r.templateId} · Updated{" "}
                        {formatDate(r.updatedAt)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${scoreColor(
                        r.lastAtsScore
                      )}`}
                    >
                      {r.lastAtsScore != null
                        ? `ATS ${r.lastAtsScore}`
                        : "Not scored"}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/builder?resumeId=${r.id}`}
                      className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-3 text-xs font-medium text-white hover:bg-brand-700"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/builder?resumeId=${r.id}`}
                      className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:border-slate-400"
                    >
                      Preview
                    </Link>
                    <Link
                      href={`/ats?resumeId=${r.id}`}
                      className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:border-slate-400"
                    >
                      ATS
                    </Link>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="ml-auto inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-red-600 hover:border-red-300 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/templates"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:border-brand-200"
          >
            <h3 className="text-base font-semibold text-slate-900">
              Browse templates
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Professional templates designed for every industry.
            </p>
          </Link>
          <Link
            href="/ats"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:border-brand-200"
          >
            <h3 className="text-base font-semibold text-slate-900">
              ATS analyzer
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Score any resume and get actionable improvement tips.
            </p>
          </Link>
          <Link
            href="/builder"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:border-brand-200"
          >
            <h3 className="text-base font-semibold text-slate-900">
              Resume builder
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Edit every section with a live preview on the right.
            </p>
          </Link>
        </div>
      </main>

      <SiteFooter />

      {/* AI Upload Processing Modal */}
      {uploadPhase !== "idle" && (
        <AiUploadModal
          phase={uploadPhase}
          steps={uploadSteps}
          currentStep={uploadStepIdx}
          fileName={uploadFileName}
        />
      )}
    </div>
  );
}
