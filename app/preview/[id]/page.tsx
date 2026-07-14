import Link from "next/link";

export const metadata = {
  title: "Template preview — ResumeUp.AI",
};

export const dynamic = "force-dynamic";

export default function PreviewPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { resumeId?: string };
}) {
  const id = params.id;
  const resumeId = searchParams?.resumeId;

  const src = resumeId
    ? `/api/templates/${id}/preview?resumeId=${encodeURIComponent(resumeId)}`
    : `/api/templates/${id}/preview`;

  return (
    <div className="flex h-screen flex-col bg-[#fafafa]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              ← All templates
            </Link>
            <span className="hidden text-sm font-medium text-slate-900 md:inline">
              Template #{id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {resumeId && (
              <Link
                href={`/builder?resumeId=${resumeId}`}
                className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:border-slate-400"
              >
                Edit resume
              </Link>
            )}
            <Link
              href={`/builder?templateId=${id}`}
              className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
            >
              Use this template
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-slate-100 p-4">
        <iframe
          src={src}
          title={`Template ${id} preview`}
          sandbox="allow-same-origin allow-scripts"
          className="h-full w-full rounded-lg border border-slate-200 bg-white shadow-card"
        />
      </div>
    </div>
  );
}
