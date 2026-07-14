/**
 * AI-powered ATS analysis. Ports `analyze_resume_with_ai` + `_ats_ai_fallback`
 * from main.py. Uses Ollama Cloud (https://ollama.com/api/chat).
 */

import { calculateAtsScores, type AtsScores } from "@/lib/ats";

export const ATS_ANALYZE_SYSTEM_PROMPT = `You are an expert resume reviewer and ATS (Applicant Tracking System) consultant. Analyze the JSON Resume payload the user sends and respond ONLY with a single valid JSON object — no prose, no markdown fences.

The JSON must have EXACTLY these keys:
{
  "missing_sections": [ string, ... ],          // sections absent or empty that this resume should have (e.g. "summary", "projects", "certifications", "professional links")
  "weak_areas": [                                // specific weaknesses with concrete examples from the resume
    { "area": string, "issue": string, "fix": string }
  ],
  "keyword_suggestions": [ string, ... ],        // 6-12 ATS keywords this resume is likely missing for its inferred target role
  "action_verb_upgrades": [                      // 3-6 weak phrases in highlights/summary and stronger alternatives
    { "weak": string, "strong": string }
  ],
  "quantification_tips": [ string, ... ],        // 3-6 concrete metrics the candidate could add (e.g. "Mention % uplift in conversion in marketing role")
  "summary_rewrite": string,                     // a 2-3 sentence professional summary the candidate could copy-paste, derived from their data
  "strengths": [ string, ... ],                  // 3-5 things this resume already does well
  "ats_risk_flags": [ string, ... ],             // formatting/content issues that hurt ATS parsing (e.g. "Email missing", "No dates on roles", "Photos in ATS-strict templates")
  "overall_recommendation": string,              // one short paragraph (2-3 sentences) on the top 2-3 priorities
  "inferred_target_role": string,                // best-guess target role inferred from the resume content
  "career_upgrades": [                           // 2-3 advanced job roles candidate could qualify for, and the high-value skills to add to land them
    { "target_role": string, "market_demand": "High" | "Very High", "estimated_salary_boost": string, "recommended_skills": [string, ...] }
  ]
}

Rules:
- Be specific and refer to the candidate's actual data (e.g. "Your role at Amazon lacks quantified outcomes — add metrics like cost saved, latency reduced, users impacted").
- Suggest realistic, role-aligned keywords (no generic spam).
- summary_rewrite must use the candidate's real experience, NOT placeholder text.
- Keep each list item under 200 characters.
- Return STRICT JSON. No trailing text. No code fences.
`;

function atsAiFallback(jrData: any, ruleBased: AtsScores): any {
  const basics = (jrData && jrData.basics) || {};
  const work: any[] = Array.isArray(jrData?.work) ? jrData.work : [];
  const skills: any[] = Array.isArray(jrData?.skills) ? jrData.skills : [];
  const projects: any[] = Array.isArray(jrData?.projects) ? jrData.projects : [];
  const education: any[] = Array.isArray(jrData?.education) ? jrData.education : [];

  const missing: string[] = [];
  if (!basics.summary) missing.push("summary");
  if (projects.length === 0) missing.push("projects");
  if (!(jrData && jrData.certificates && jrData.certificates.length))
    missing.push("certifications");
  const profiles = Array.isArray(basics.profiles) ? basics.profiles : [];
  if (profiles.length === 0) missing.push("professional links");

  const weak: Array<{ area: string; issue: string; fix: string }> = [];
  for (const w of work) {
    if (w && typeof w === "object" && (!Array.isArray(w.highlights) || w.highlights.length === 0)) {
      weak.push({
        area: `Role: ${w.position ?? "Unknown"} @ ${w.name ?? "Unknown"}`,
        issue: "No achievement bullets attached to this role.",
        fix: "Add 3-5 bullets that begin with action verbs and end with measurable outcomes.",
      });
    }
  }

  const targetRole =
    basics.label ||
    (work.length > 0 && typeof work[0] === "object" ? work[0].position : null) ||
    "Professional";

  const firstSkillName =
    skills.length > 0 && typeof skills[0] === "object" && skills[0].name ? skills[0].name : null;
  const firstEduInstitution =
    education.length > 0 && typeof education[0] === "object" && education[0].institution
      ? education[0].institution
      : null;

  const summaryRewrite =
    `${targetRole} with ${work.length} role(s) of experience` +
    (firstSkillName ? ` in ${firstSkillName}` : "") +
    (firstEduInstitution ? `. Educated at ${firstEduInstitution}` : "") +
    ". Looking to bring measurable impact through technical excellence and collaborative delivery.";

  return {
    missing_sections: missing,
    weak_areas: weak.slice(0, 5),
    keyword_suggestions: [],
    action_verb_upgrades: [
      { weak: "Responsible for", strong: "Led / Drove / Owned" },
      { weak: "Worked on", strong: "Built / Shipped / Delivered" },
      { weak: "Helped with", strong: "Partnered with / Coordinated" },
    ],
    quantification_tips: [
      "Add % or absolute numbers to every highlight where possible (e.g. uplift, savings, users impacted).",
      "Mention team size or budget for leadership roles.",
      "Quantify project outcomes with adoption, performance, or revenue metrics.",
    ],
    summary_rewrite: summaryRewrite,
    strengths: [
      work.length > 0 ? `Has ${work.length} documented work experience(s)` : "Resume has basic structure",
      skills.length > 0 ? `Lists ${skills.length} skill group(s)` : "Skills section needs work",
      basics.email ? "Contact information is structured" : "Missing key contact info",
    ],
    ats_risk_flags: (ruleBased?.feedback ?? []).slice(0, 5),
    overall_recommendation:
      "Focus first on adding quantified achievements to every work experience bullet. " +
      "Then fill in any missing sections above and ensure your skills section uses keywords " +
      "directly from the job descriptions you're targeting.",
    inferred_target_role: targetRole,
    career_upgrades: [
      {
        target_role: `Senior ${targetRole}`,
        market_demand: "Very High",
        estimated_salary_boost: "+20% to 35%",
        recommended_skills: ["System Architecture", "Team Leadership", "Strategic Planning", "Project Management"],
      },
      {
        target_role: `${targetRole} Consultant`,
        market_demand: "High",
        estimated_salary_boost: "+15% to 25%",
        recommended_skills: ["Client Advisory", "Business Analytics", "Risk Assessment"],
      },
    ],
    ai_powered: false,
    fallback_reason: "AI provider not configured or unreachable; returning rule-based analysis.",
  };
}

export async function analyzeResumeWithAi(
  jrData: any
): Promise<{ rule_based: AtsScores; ai_analysis: any }> {
  const ruleBased = calculateAtsScores(jrData);

  if (!jrData || typeof jrData !== "object" || Array.isArray(jrData)) {
    return { rule_based: ruleBased, ai_analysis: atsAiFallback(jrData, ruleBased) };
  }

  const apiKey = process.env.OLLAMA_API_KEY;
  const model = process.env.MODEL_NAME || "gpt-oss:120b";

  if (!apiKey) {
    return { rule_based: ruleBased, ai_analysis: atsAiFallback(jrData, ruleBased) };
  }

  try {
    let resumeText = JSON.stringify(jrData);
    if (resumeText.length > 18000) {
      resumeText = resumeText.slice(0, 18000) + "...[truncated]";
    }

    const payload = {
      model,
      messages: [
        { role: "system", content: ATS_ANALYZE_SYSTEM_PROMPT },
        { role: "user", content: `Resume JSON:\n${resumeText}` },
      ],
      stream: false,
      format: "json",
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    let resp: Response;
    try {
      resp = await fetch("https://ollama.com/api/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const result: any = await resp.json();
    const content: any = result?.message?.content ?? result?.response ?? "";

    let parsed: any = null;
    try {
      parsed = typeof content === "string" ? JSON.parse(content) : content;
    } catch {
      if (typeof content === "string") {
        const m = content.match(/\{[\s\S]*\}/);
        if (m) {
          try {
            parsed = JSON.parse(m[0]);
          } catch {
            parsed = null;
          }
        }
      }
    }

    let ai: any;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      ai = atsAiFallback(jrData, ruleBased);
      ai.fallback_reason = "AI returned non-JSON; using rule-based fallback.";
    } else {
      parsed.ai_powered = true;
      ai = parsed;
    }

    return { rule_based: ruleBased, ai_analysis: ai };
  } catch (e: any) {
    const ai = atsAiFallback(jrData, ruleBased);
    ai.fallback_reason = `AI provider error: ${String(e?.message ?? e).slice(0, 160)}`;
    return { rule_based: ruleBased, ai_analysis: ai };
  }
}
