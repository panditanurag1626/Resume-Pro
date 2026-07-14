"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const IFRAME_W = 1000;
const IFRAME_H = 1333;

function TemplatePreview({ id, name }: { id: number; name: string }) {
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

type Template = {
  id: number;
  name: string;
  description?: string;
  tags?: string[];
  category?: string;
};

export default function TemplatesBrowser({
  templates,
}: {
  templates: Template[];
}) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => {
      if (t.category) set.add(t.category);
      (t.tags || []).forEach((tag) => set.add(tag));
    });
    return ["all", ...Array.from(set).slice(0, 10)];
  }, [templates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
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
        (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [templates, query, category]);

  function useTemplate(templateId: number) {
    router.push(`/builder?templateId=${templateId}`);
  }

  return (
    <div className="mt-10">
      {/* Search + filter */}
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
        {filtered.length} of {templates.length} templates
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md"
          >
            <Link href={`/preview/${t.id}`} className="block">
              <TemplatePreview id={t.id} name={t.name} />
            </Link>

            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-sm font-semibold text-slate-900">{t.name}</h3>
              {t.description && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {t.description}
                </p>
              )}
              {(t.tags || []).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {(t.tags || []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto pt-3 flex items-center gap-2 border-t border-slate-100">
                <Link
                  href={`/preview/${t.id}`}
                  className="inline-flex h-8 flex-1 items-center justify-center rounded border border-slate-300 bg-white text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                >
                  Preview
                </Link>
                <button
                  onClick={() => useTemplate(t.id)}
                  className="inline-flex h-8 flex-1 items-center justify-center rounded bg-slate-900 text-xs font-medium text-white transition hover:bg-slate-800"
                >
                  Use this
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
          No templates match your search.
        </div>
      )}
    </div>
  );
}
