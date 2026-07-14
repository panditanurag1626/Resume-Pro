import Link from "next/link";

export const metadata = {
  title: "Page not found — ResumeUp.AI",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 inline-flex items-center gap-2">
          <span className="inline-block h-8 w-8 rounded-lg bg-brand-600" />
          <span className="text-lg font-semibold tracking-tight">
            ResumeUp<span className="text-brand-600">.AI</span>
          </span>
        </div>
        <p className="text-7xl font-semibold text-brand-600">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you were looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
          >
            Back home
          </Link>
          <Link
            href="/templates"
            className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:border-slate-400"
          >
            Browse templates
          </Link>
        </div>
      </div>
    </div>
  );
}
