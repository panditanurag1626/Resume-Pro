import { Suspense } from "react";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import AtsAnalyzer from "./analyzer";

export const metadata = {
  title: "ATS Analyzer — ResumeUp.AI",
  description: "Score your resume against ATS rules and AI feedback.",
};

export default function AtsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <Header />

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            ATS Resume Analyzer
          </h1>
          <p className="mt-3 text-slate-600">
            Score your resume against modern ATS rules and get AI-powered
            suggestions you can apply in one click.
          </p>
        </div>

        <Suspense fallback={<div className="mt-10 text-center text-sm text-slate-500">Loading analyzer...</div>}>
          <AtsAnalyzer />
        </Suspense>
      </section>

      <SiteFooter />
    </div>
  );
}
