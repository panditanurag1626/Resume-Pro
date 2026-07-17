import { headers } from "next/headers";

import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import TemplatesBrowser from "./browser";

export const metadata = {
  title: "Templates — ResumeUp.AI",
  description: "62 beautiful, ATS-friendly resume templates.",
};

export const dynamic = "force-dynamic";

type Template = {
  id: number;
  name: string;
  description?: string;
  tags?: string[];
  category?: string;
};

async function loadTemplates(): Promise<Template[]> {
  // Try the registry first (sync, fastest)
  try {
    const reg = await import("@/lib/templates-registry").catch(() => null as any);
    const arr =
      reg && (reg.TEMPLATES || reg.default?.TEMPLATES || reg.default);
    if (Array.isArray(arr) && arr.length) return arr as Template[];
  } catch {
    // ignore
  }

  // Fall back to API on the same origin
  try {
    const h = headers();
    const host = h.get("host");
    const proto = h.get("x-forwarded-proto") || "http";
    const base = host ? `${proto}://${host}` : "";
    const res = await fetch(`${base}/api/templates?limit=200`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const arr = json?.data?.templates || json?.templates || [];
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch {
    // ignore
  }

  // Last-resort placeholder set
  return Array.from({ length: 62 }).map((_, i) => ({
    id: i + 1,
    name: `Template ${i + 1}`,
    description: "Professional, ATS-friendly resume layout.",
    tags: [],
  }));
}

export default async function TemplatesPage() {
  const templates = await loadTemplates();

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Beautiful templates for every career
          </h1>
          <p className="mt-3 text-slate-600">
            62 hand-crafted, ATS-friendly resumes. Pick one and start editing in
            seconds.
          </p>
        </div>

        <TemplatesBrowser templates={templates} />
      </section>

      <SiteFooter />
    </div>
  );
}
