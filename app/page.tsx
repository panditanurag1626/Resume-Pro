import Link from "next/link";
import TemplateShowcase from "./template-showcase";

export const metadata = {
  title: "ResumeUp.AI — Build a resume that gets you hired",
};

const features = [
  {
    title: "AI-Powered Writing",
    body: "Smart suggestions rewrite bullets into accomplishment statements with measurable impact.",
  },
  {
    title: "ATS-Optimized",
    body: "Score every resume against modern Applicant Tracking Systems and fix gaps in one click.",
  },
  {
    title: "62 Beautiful Templates",
    body: "From minimalist to executive — every template renders cleanly to PDF and ATS scanners.",
  },
  {
    title: "Live Preview",
    body: "Edit on the left, see the rendered resume update on the right in real time.",
  },
];

const NAV_LINKS = [
  { href: "/templates", label: "Templates" },
  { href: "/builder", label: "Builder" },
  { href: "/ats", label: "ATS Score" },
  { href: "/dashboard", label: "My Resumes" },
  { href: "/docs", label: "API Docs" },
];

function NavBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-7 w-7 rounded-lg bg-brand-600" />
          <span className="text-lg font-semibold tracking-tight">
            ResumeUp<span className="text-brand-600">.AI</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-slate-600 transition hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/builder"
          className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
        >
          Create resume
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded-md bg-brand-600" />
            <span className="font-semibold">ResumeUp.AI</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            The fastest way to build an ATS-friendly resume that actually gets read.
            No signup. No watermarks.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link href="/templates" className="hover:text-slate-900">
                Templates
              </Link>
            </li>
            <li>
              <Link href="/builder" className="hover:text-slate-900">
                Builder
              </Link>
            </li>
            <li>
              <Link href="/ats" className="hover:text-slate-900">
                ATS Analyzer
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-slate-900">
                My Resumes
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Developers</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link href="/docs" className="hover:text-slate-900">
                API Docs
              </Link>
            </li>
            <li>
              <Link href="/api/schema" className="hover:text-slate-900">
                JSON Resume Schema
              </Link>
            </li>
            <li>
              <Link href="/api/templates" className="hover:text-slate-900">
                Templates API
              </Link>
            </li>
            <li>
              <Link href="/api/ats-analyze" className="hover:text-slate-900">
                ATS API
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <span className="text-slate-400">Privacy</span>
            </li>
            <li>
              <span className="text-slate-400">Terms</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        © {year} Code Krafters & ResumeUp.AI. All rights reserved.
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <NavBar />

      {/* Hero */}
      <section className="bg-mesh relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              New · AI-powered ATS scoring
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
              Build a resume that{" "}
              <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
                gets you hired
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Pick a beautiful template, let AI sharpen your bullets, and score
              your resume against real ATS rules — all in one place.
            </p>
            <div className="mt-9 flex items-center justify-center gap-3">
              <Link
                href="/builder"
                className="inline-flex h-11 items-center rounded-lg bg-brand-600 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
              >
                Start building
              </Link>
              <Link
                href="/templates"
                className="inline-flex h-11 items-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 transition hover:border-slate-400"
              >
                View templates
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-slate-200/70 bg-white/60 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm font-medium text-slate-600 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-12 sm:gap-y-3 sm:grid-cols-none">
              <span className="text-center">62 templates</span>
              <span className="text-center">AI ATS scoring</span>
              <span className="text-center">1-click PDF</span>
              <span className="text-center">No watermarks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Everything you need to land the interview
          </h2>
          <p className="mt-4 text-slate-600">
            A modern builder that handles formatting, keywords, and structure so
            you can focus on your story.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:border-brand-200 hover:shadow-soft"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Template showcase */}
      <TemplateShowcase />

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-600 px-8 py-16 text-center text-white md:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Ready to land your dream job?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-violet-100">
            Create your first AI-powered resume in under five minutes. No credit
            card required.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/builder"
              className="inline-flex h-11 items-center rounded-lg bg-white px-6 text-sm font-medium text-brand-700 shadow-sm transition hover:bg-violet-50"
            >
              Start building
            </Link>
            <Link
              href="/templates"
              className="inline-flex h-11 items-center rounded-lg border border-white/30 bg-white/0 px-6 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View templates
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
