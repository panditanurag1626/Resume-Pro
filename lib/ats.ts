/**
 * ATS scoring ported from main.py `calculate_ats_scores` (Python).
 * Same 8 categories with the same weights and identical logic so that
 * the TS port produces the same numbers for the same input.
 *
 *   contact_info   10%
 *   summary        10%
 *   work_experience 25%
 *   quantification 15%
 *   skills         15%
 *   education      10%
 *   projects       10%
 *   certifications  5%
 */

export interface AtsBreakdown {
  contact_info: number;
  summary: number;
  work_experience: number;
  quantification: number;
  skills: number;
  education: number;
  projects: number;
  certifications: number;
}

export interface AtsScores {
  overall_score: number;
  breakdown: Record<string, number>;
  feedback: string[];
  stats: Record<string, number>;
}

export const WEAK_VERBS: ReadonlySet<string> = new Set([
  "responsible", "worked", "helped", "assisted", "involved", "participated",
  "tasked", "duties", "various", "handled", "did", "made", "got",
]);

export const STRONG_VERBS: ReadonlySet<string> = new Set([
  "led", "drove", "owned", "built", "delivered", "launched", "shipped",
  "designed", "architected", "implemented", "developed", "managed",
  "increased", "reduced", "improved", "optimized", "scaled", "automated",
  "created", "founded", "spearheaded", "executed", "achieved", "negotiated",
  "mentored", "coached", "trained", "researched", "analyzed", "engineered",
  "deployed", "migrated", "refactored", "established", "streamlined",
]);

// Same regex as Python — using 'g' would mutate state across calls, so use a
// fresh RegExp object per call where needed. The pattern is global-flag-free.
const NUMBER_RE_SOURCE =
  "(\\d+(?:[\\.,]\\d+)?\\s*(?:%|k|m|x|hrs?|hours?|minutes?|users?|customers?|clients?|projects?|teams?|members?|countries|languages?|years?|days?|months?|weeks?|engineers?|developers?|reports?|revenue|sales|orders?|leads?|tickets?|requests?))|\\$\\s?\\d+|\\d+\\+|\\d+x";

function numberRe(): RegExp {
  return new RegExp(NUMBER_RE_SOURCE);
}

const TECH_SKILL_HINTS: ReadonlySet<string> = new Set([
  "python", "java", "javascript", "typescript", "react", "node", "sql", "aws",
  "docker", "kubernetes", "git", "linux", "html", "css", "go", "rust", "c++",
  "c#", ".net", "spring", "django", "flask", "fastapi", "postgres", "mysql",
  "mongo", "redis", "kafka", "spark", "hadoop", "tableau", "powerbi", "excel",
  "figma", "photoshop", "illustrator",
]);

/**
 * Inspect a list of highlight strings and return
 * [quant, strong, weak, total]. Mirrors `_highlight_metrics` in main.py.
 */
function highlightMetrics(highlights: any): [number, number, number, number] {
  if (!Array.isArray(highlights) || highlights.length === 0) return [0, 0, 0, 0];
  let quant = 0;
  let strong = 0;
  let weak = 0;
  let total = 0;
  for (const h of highlights) {
    if (typeof h !== "string" || !h.trim()) continue;
    total += 1;
    if (numberRe().test(h.toLowerCase())) quant += 1;
    // Python: re.findall(r"[A-Za-z]+", h.strip())[0]
    const firstMatch = h.trim().match(/[A-Za-z]+/);
    if (firstMatch) {
      const w = firstMatch[0].toLowerCase();
      if (STRONG_VERBS.has(w)) strong += 1;
      else if (WEAK_VERBS.has(w)) weak += 1;
    }
  }
  return [quant, strong, weak, total];
}

export function calculateAtsScores(jrData: any): AtsScores {
  const emptyBreakdown: AtsBreakdown = {
    contact_info: 0, summary: 0, work_experience: 0,
    quantification: 0, skills: 0, education: 0,
    projects: 0, certifications: 0,
  };

  if (!jrData || typeof jrData !== "object" || Array.isArray(jrData)) {
    return {
      overall_score: 0,
      breakdown: { ...emptyBreakdown },
      feedback: ["Resume data is empty."],
      stats: {},
    };
  }

  let basics = jrData.basics ?? {};
  if (typeof basics !== "object" || basics === null || Array.isArray(basics)) {
    basics = {};
  }
  let work: any[] = Array.isArray(jrData.work) ? jrData.work : [];
  let education: any[] = Array.isArray(jrData.education) ? jrData.education : [];
  let skillsList: any[] = Array.isArray(jrData.skills) ? jrData.skills : [];
  let projects: any[] = Array.isArray(jrData.projects) ? jrData.projects : [];
  let certificates: any[] = Array.isArray(jrData.certificates) ? jrData.certificates : [];

  const feedback: string[] = [];

  // ---- 1. Contact info (0-100) ----
  let contactScore = 0;
  if (basics.email) contactScore += 25;
  else feedback.push("Missing email address — most ATS reject resumes without one.");

  if (basics.phone) contactScore += 25;
  else feedback.push("Missing phone number.");

  const location = basics.location ?? {};
  if (
    location && typeof location === "object" && !Array.isArray(location) &&
    (location.address || location.city || location.region)
  ) {
    contactScore += 20;
  } else {
    feedback.push("Add a city / region — recruiters filter by location.");
  }

  const profiles = basics.profiles ?? [];
  if (Array.isArray(profiles) && profiles.length > 0) {
    contactScore += Math.min(20, profiles.length * 10);
    const nets = new Set<string>();
    for (const p of profiles) {
      if (p && typeof p === "object" && !Array.isArray(p)) {
        nets.add(String(p.network ?? "").toLowerCase());
      }
    }
    if (!Array.from(nets).join(" ").includes("linkedin")) {
      feedback.push("Add a LinkedIn profile URL — it's the single most-checked link.");
    }
  } else {
    feedback.push("Add professional links (LinkedIn, GitHub, portfolio) to your contact section.");
  }

  if (basics.url) contactScore += 10;
  contactScore = Math.min(100, contactScore);

  // ---- 2. Summary (0-100) ----
  const summaryText = String(basics.summary ?? "").trim();
  let summaryScore = 0;
  if (!summaryText) {
    feedback.push(
      "No professional summary. Add a 3-4 line summary at the top — it's the first thing ATS and recruiters read."
    );
  } else {
    const words = summaryText.split(/\s+/).filter(Boolean).length;
    if (words < 20) {
      summaryScore = 40;
      feedback.push(
        "Summary is too short — aim for 40-80 words mentioning your role, key skills, and years of experience."
      );
    } else if (words <= 120) {
      summaryScore = 100;
    } else if (words <= 200) {
      summaryScore = 80;
    } else {
      summaryScore = 60;
      feedback.push("Summary is too long — keep it under 120 words for ATS readability.");
    }
    const lower = summaryText.toLowerCase();
    const hasNumber = numberRe().test(lower) || /\d+\s*(?:year|yr)/.test(lower);
    if (!hasNumber) {
      summaryScore = Math.max(0, summaryScore - 10);
      const joined = feedback.join(" ");
      if (!joined.includes("Summary is too short") && !joined.includes("too long")) {
        feedback.push("Mention years of experience or a concrete number in your summary.");
      }
    }
  }

  // ---- 3. Work experience (0-100) ----
  let workScore = 0;
  let totalHighlights = 0;
  let totalQuant = 0;
  let totalStrong = 0;
  let totalWeak = 0;
  let jobsWithDates = 0;
  let jobsWithHighlights = 0;

  if (work.length === 0) {
    feedback.push("No work experience found. Add roles to showcase your career history.");
  } else {
    workScore += 20; // base for having a section
    const numJobs = work.length;
    workScore += Math.min(20, numJobs * 7);

    for (const job of work) {
      if (!job || typeof job !== "object" || Array.isArray(job)) continue;
      const highlights = Array.isArray(job.highlights) ? job.highlights : [];
      if (highlights.length > 0) jobsWithHighlights += 1;
      const [quant, strong, weak, totals] = highlightMetrics(highlights);
      totalHighlights += totals;
      totalQuant += quant;
      totalStrong += strong;
      totalWeak += weak;
      if (job.startDate || job.endDate) jobsWithDates += 1;
    }

    if (numJobs > 0) {
      const cov = jobsWithHighlights / numJobs;
      workScore += Math.floor(cov * 20);
      const dateCov = jobsWithDates / numJobs;
      workScore += Math.floor(dateCov * 15);
    }

    const avgHl = totalHighlights / Math.max(1, numJobs);
    if (avgHl >= 4) workScore += 25;
    else if (avgHl >= 3) workScore += 18;
    else if (avgHl >= 2) workScore += 10;
    else feedback.push(`Add more bullets per role (target 3-5). Average right now is ${avgHl.toFixed(1)}.`);

    if (jobsWithDates < numJobs) {
      feedback.push("Add start/end dates to every role — missing dates are an ATS red flag.");
    }
  }
  workScore = Math.min(100, workScore);

  // ---- 4. Quantification & action verbs (0-100) ----
  let quantScore = 0;
  if (totalHighlights === 0) {
    feedback.push("No bullet points found in work experience. Add 3-5 achievement bullets per role.");
  } else {
    const quantRatio = totalQuant / totalHighlights;
    quantScore += Math.floor(quantRatio * 60);
    if (quantRatio < 0.4) {
      feedback.push(
        `Only ${Math.floor(quantRatio * 100)}% of your bullets include numbers/metrics. Quantify outcomes (%, $, users, time saved) to dramatically boost ATS score.`
      );
    }

    const strongRatio = totalStrong / totalHighlights;
    quantScore += Math.floor(strongRatio * 30);
    if (strongRatio < 0.3) {
      feedback.push("Use strong action verbs (Led, Drove, Shipped, Reduced…) at the start of each bullet.");
    }

    const weakRatio = totalWeak / totalHighlights;
    quantScore -= Math.floor(weakRatio * 20);
    if (totalWeak >= 2) {
      feedback.push(
        `Found ${totalWeak} bullet(s) starting with weak verbs (e.g. 'Responsible for', 'Worked on'). Rephrase with action verbs.`
      );
    }

    if (totalQuant >= 5) quantScore += 10;
    quantScore = Math.max(0, Math.min(100, quantScore));
  }

  // ---- 5. Skills (0-100) ----
  let skillsScore = 0;
  const allKeywords: string[] = [];
  for (const sg of skillsList) {
    if (sg && typeof sg === "object" && !Array.isArray(sg)) {
      const kws = Array.isArray(sg.keywords) ? sg.keywords : [];
      for (const k of kws) {
        if (typeof k === "string" && k.trim()) allKeywords.push(k);
      }
    }
  }

  if (allKeywords.length === 0) {
    feedback.push("No skills section found. List 8-15 keywords matched to your target role's job description.");
  } else {
    const n = allKeywords.length;
    skillsScore += 20;
    if (n >= 12) skillsScore += 50;
    else if (n >= 8) skillsScore += 38;
    else if (n >= 5) skillsScore += 24;
    else {
      skillsScore += n * 4;
      feedback.push(`Only ${n} skills listed. Add at least 8 (technical + soft) to pass ATS keyword filters.`);
    }

    let nonEmptyGroups = 0;
    for (const sg of skillsList) {
      if (sg && typeof sg === "object" && !Array.isArray(sg) && sg.keywords) {
        // Python truthy check: dict.get("keywords") truthy means non-empty list/etc.
        if (Array.isArray(sg.keywords) ? sg.keywords.length > 0 : !!sg.keywords) {
          nonEmptyGroups += 1;
        }
      }
    }
    if (nonEmptyGroups >= 3) skillsScore += 15;
    else if (nonEmptyGroups >= 2) skillsScore += 8;
    else {
      feedback.push(
        "Group your skills into 2-3 categories (e.g. 'Programming', 'Tools', 'Soft Skills') for clearer ATS parsing."
      );
    }

    const lowerKws = new Set(allKeywords.map((k) => k.toLowerCase()));
    let techHit = false;
    for (const k of lowerKws) {
      if (TECH_SKILL_HINTS.has(k)) {
        techHit = true;
        break;
      }
    }
    if (techHit) skillsScore += 15;
  }
  skillsScore = Math.min(100, skillsScore);

  // ---- 6. Education (0-100) ----
  let eduScore = 0;
  if (education.length === 0) {
    feedback.push("No education section. Add your highest degree even if work experience is your main signal.");
  } else {
    eduScore += 50;
    eduScore += Math.min(30, education.length * 15);
    const hasDates = education.some(
      (e: any) =>
        e && typeof e === "object" && !Array.isArray(e) && (e.startDate || e.endDate)
    );
    if (hasDates) eduScore += 10;
    else feedback.push("Add graduation year to your education entries.");
    const hasScore = education.some(
      (e: any) => e && typeof e === "object" && !Array.isArray(e) && e.score
    );
    if (hasScore) eduScore += 10;
  }
  eduScore = Math.min(100, eduScore);

  // ---- 7. Projects (0-100) ----
  let projScore = 0;
  if (projects.length === 0) {
    feedback.push("Add 2-3 projects with description, tech keywords, and a link to demonstrate hands-on work.");
  } else {
    projScore += 40;
    projScore += Math.min(30, projects.length * 15);
    const withDesc = projects.filter(
      (p: any) =>
        p && typeof p === "object" && !Array.isArray(p) && (p.description || p.highlights)
    ).length;
    if (withDesc > 0) {
      projScore += Math.floor((withDesc / projects.length) * 20);
    } else {
      feedback.push("Your projects have no description or highlights — add a sentence and outcome for each.");
    }
    const withKw = projects.filter(
      (p: any) => p && typeof p === "object" && !Array.isArray(p) && p.keywords
    ).length;
    if (withKw > 0) projScore += 10;
  }
  projScore = Math.min(100, projScore);

  // ---- 8. Certifications (0-100) ----
  let certScore = 0;
  if (certificates.length === 0) {
    certScore = 0;
  } else {
    certScore = Math.min(100, 50 + certificates.length * 15);
  }

  // ---- Weighted overall ----
  const overallRaw =
    contactScore * 0.10 +
    summaryScore * 0.10 +
    workScore * 0.25 +
    quantScore * 0.15 +
    skillsScore * 0.15 +
    eduScore * 0.10 +
    projScore * 0.10 +
    certScore * 0.05;
  const overall = Math.max(0, Math.min(100, Math.round(overallRaw)));

  // Cap feedback length
  let trimmedFeedback = feedback.slice(0, 6);
  if (trimmedFeedback.length === 0) {
    trimmedFeedback = ["Strong resume — meets every standard ATS guideline."];
  }

  return {
    overall_score: overall,
    breakdown: {
      contact_info: contactScore,
      summary: summaryScore,
      work_experience: workScore,
      quantification: quantScore,
      skills: skillsScore,
      education: eduScore,
      projects: projScore,
      certifications: certScore,
    },
    feedback: trimmedFeedback,
    stats: {
      total_highlights: totalHighlights,
      quantified_highlights: totalQuant,
      strong_verb_highlights: totalStrong,
      weak_verb_highlights: totalWeak,
      num_work: work.length,
      num_skills_keywords: allKeywords.length,
      num_projects: projects.length,
      num_certificates: certificates.length,
    },
  };
}
