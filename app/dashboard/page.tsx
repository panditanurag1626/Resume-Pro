"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import {
  deleteResume,
  listResumes,
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

export default function DashboardPage() {
  const [resumes, setResumes] = useState<LocalResume[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setResumes(listResumes());
    setReady(true);
  }, []);

  function refresh() {
    setResumes(listResumes());
  }

  function onDelete(id: string) {
    if (!window.confirm("Delete this resume? This cannot be undone.")) return;
    deleteResume(id);
    refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
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
          <Link
            href="/builder"
            className="inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            New resume
          </Link>
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
              <Link
                href="/builder"
                className="mt-5 inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
              >
                Create your first resume
              </Link>
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
    </div>
  );
}
