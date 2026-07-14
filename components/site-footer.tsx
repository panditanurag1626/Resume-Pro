import Link from "next/link";

export function SiteFooter() {
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
            The fastest way to build an ATS-friendly resume that actually gets
            read. No signup. No watermarks.
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

export default SiteFooter;
