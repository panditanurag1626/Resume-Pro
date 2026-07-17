"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const IFRAME_W = 794;
const IFRAME_H = 1123;

function ShowcaseCard({ id, name }: { id: number; name: string }) {
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
    <div ref={ref} className="relative aspect-[3/4] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition group-hover:shadow-md">
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

const showcase = [
  { id: 1, name: "Minimalist" },
  { id: 4, name: "Executive" },
  { id: 19, name: "Compact" },
  { id: 50, name: "Universal Pro" },
  { id: 58, name: "Classic" },
  { id: 60, name: "Luminary" },
];

export default function TemplateShowcase() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Built to impress recruiters
            </h2>
            <p className="mt-3 max-w-xl text-slate-600">
              62 professional templates, every one ATS-tested and ready for
              PDF export.
            </p>
          </div>
          <Link
            href="/templates"
            className="text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            Browse all 62 →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {showcase.map((t) => (
            <Link key={t.id} href={`/preview/${t.id}`} className="group block">
              <ShowcaseCard id={t.id} name={t.name} />
              <p className="mt-3 text-sm font-medium text-slate-700 group-hover:text-brand-700">
                {t.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
