/**
 * POST /api/ai-apply
 *
 * Takes original JSON Resume data + AI analysis (from /api/ats-analyze)
 * and returns the resume with all AI suggestions applied:
 *   - summary replaced with AI-rewritten version
 *   - missing skills added to skills section
 *   - career upgrade recommended_skills merged into skills
 *   - action verb upgrades applied to work highlights
 *   - quantification tips stored as comments (for user review)
 *
 * Body:
 *   { resume: <JSON Resume>, ai_analysis: <AI analysis object> }
 *
 * Returns:
 *   { status: 200, data: <updated JSON Resume>, changes: [...applied change descriptions] }
 */

import { NextRequest } from "next/server";
import { plainErrorEnvelope } from "@/lib/envelope";
import { corsPreflight, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function applySummary(resume: any, summary: string): string[] {
  if (!summary || !resume?.basics) return [];
  resume.basics.summary = summary;
  return ["Summary rewritten with AI-optimized version"];
}

function applyKeywords(resume: any, keywords: string[]): string[] {
  if (!keywords?.length) return [];
  if (!Array.isArray(resume.skills)) resume.skills = [];

  let targetGroup = resume.skills.find(
    (s: any) => s.name?.toLowerCase().includes("keyword") || s.name?.toLowerCase().includes("technical") || s.name?.toLowerCase().includes("tools")
  );
  if (!targetGroup && resume.skills.length > 0) {
    targetGroup = resume.skills[0];
  }
  if (!targetGroup) {
    targetGroup = { name: "Technical Skills", keywords: [] };
    resume.skills.push(targetGroup);
  }
  if (!Array.isArray(targetGroup.keywords)) targetGroup.keywords = [];

  const existing = new Set(targetGroup.keywords.map((k: string) => k.toLowerCase()));
  const added: string[] = [];
  for (const kw of keywords) {
    if (!existing.has(kw.toLowerCase())) {
      targetGroup.keywords.push(kw);
      added.push(kw);
    }
  }
  return added.length ? [`Added ${added.length} ATS keywords: ${added.join(", ")}`] : [];
}

function applyCareerSkills(resume: any, upgrades: any[]): string[] {
  if (!upgrades?.length) return [];
  if (!Array.isArray(resume.skills)) resume.skills = [];

  let careerGroup = resume.skills.find(
    (s: any) => s.name?.toLowerCase().includes("career") || s.name?.toLowerCase().includes("advanced")
  );
  if (!careerGroup) {
    careerGroup = { name: "Career Growth Skills", keywords: [] };
    resume.skills.push(careerGroup);
  }
  if (!Array.isArray(careerGroup.keywords)) careerGroup.keywords = [];

  const existing = new Set(careerGroup.keywords.map((k: string) => k.toLowerCase()));
  const added: string[] = [];
  for (const up of upgrades) {
    for (const skill of up.recommended_skills || []) {
      if (!existing.has(skill.toLowerCase())) {
        careerGroup.keywords.push(skill);
        added.push(skill);
      }
    }
  }
  return added.length ? [`Added ${added.length} career growth skills: ${added.join(", ")}`] : [];
}

function applyVerbUpgrades(resume: any, upgrades: any[]): string[] {
  if (!upgrades?.length || !Array.isArray(resume.work)) return [];

  const verbMap = new Map<string, string>();
  for (const u of upgrades) {
    if (u.weak && u.strong) verbMap.set(u.weak.toLowerCase(), u.strong);
  }
  if (verbMap.size === 0) return [];

  let count = 0;
  for (const w of resume.work) {
    if (!Array.isArray(w.highlights)) continue;
    w.highlights = w.highlights.map((h: string) => {
      if (typeof h !== "string") return h;
      const lower = h.toLowerCase();
      for (const [weak, strong] of verbMap) {
        if (lower.startsWith(weak)) {
          count++;
          return strong + h.slice(weak.length);
        }
      }
      return h;
    });
  }
  return count ? [`Upgraded ${count} weak action verb(s)`] : [];
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  const resume = body.resume;
  const ai = body.ai_analysis;

  if (!resume || typeof resume !== "object" || Array.isArray(resume)) {
    return plainErrorEnvelope(400, "Bad Request", "Provide { resume: <JSON Resume> }.");
  }
  if (!ai || typeof ai !== "object" || Array.isArray(ai)) {
    return plainErrorEnvelope(400, "Bad Request", "Provide { ai_analysis: <AI analysis object> }.");
  }

  const updated = JSON.parse(JSON.stringify(resume));
  const changes: string[] = [];

  changes.push(...applySummary(updated, ai.summary_rewrite || ai.rewritten_summary));
  changes.push(...applyKeywords(updated, ai.keyword_suggestions));
  changes.push(...applyCareerSkills(updated, ai.career_upgrades));
  changes.push(...applyVerbUpgrades(updated, ai.action_verb_upgrades));

  return withCors(
    new Response(
      JSON.stringify({
        status: 200,
        statusText: "OK",
        message: "AI suggestions applied to resume",
        data: updated,
        changes,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  );
}

export async function OPTIONS() {
  return corsPreflight();
}
