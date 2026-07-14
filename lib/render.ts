/**
 * Server-side Nunjucks template rendering.
 * Mirrors the Flask `_build_template_context` shape so the same
 * .html templates work unchanged.
 */

import path from "path";
import nunjucks from "nunjucks";

let envInstance: nunjucks.Environment | null = null;

function getEnv(): nunjucks.Environment {
  if (envInstance) return envInstance;
  const templatesDir = path.join(process.cwd(), "templates");
  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(templatesDir, { noCache: false }),
    {
      autoescape: true,
      trimBlocks: true,
      lstripBlocks: true,
    }
  );

  // Custom `head(str, n)` filter — used widely in our HTML templates to
  // slice YYYY-MM-DD dates down to year, etc.
  env.addFilter("head", (s: any, n: number) => {
    if (s == null) return "";
    return String(s).slice(0, n);
  });

  envInstance = env;
  return env;
}

export function buildTemplateContext(jrData: any): Record<string, any> {
  const jr = jrData && typeof jrData === "object" && !Array.isArray(jrData) ? jrData : {};

  const basics = (jr.basics && typeof jr.basics === "object" && !Array.isArray(jr.basics))
    ? jr.basics : {};
  const location =
    basics.location && typeof basics.location === "object" && !Array.isArray(basics.location)
      ? basics.location
      : {};

  const locationParts = [
    location.address,
    location.city,
    location.region,
    location.countryCode,
  ].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(", ") : null;

  const profiles = Array.isArray(basics.profiles) ? basics.profiles : [];
  const work = Array.isArray(jr.work) ? jr.work : [];
  const projects = Array.isArray(jr.projects) ? jr.projects : [];
  const volunteer = Array.isArray(jr.volunteer) ? jr.volunteer : [];
  const education = Array.isArray(jr.education) ? jr.education : [];
  const skillGroups = Array.isArray(jr.skills) ? jr.skills : [];
  const languages = Array.isArray(jr.languages) ? jr.languages : [];
  const certificates = Array.isArray(jr.certificates) ? jr.certificates : [];
  const awards = Array.isArray(jr.awards) ? jr.awards : [];
  const publications = Array.isArray(jr.publications) ? jr.publications : [];
  const interests = Array.isArray(jr.interests) ? jr.interests : [];
  const references = Array.isArray(jr.references) ? jr.references : [];

  // Flat keyword list (e.g. for "Skills: HTML, CSS, JavaScript")
  const skillKeywords: string[] = [];
  for (const g of skillGroups) {
    if (g && typeof g === "object" && Array.isArray(g.keywords)) {
      for (const k of g.keywords) if (typeof k === "string" && k.trim()) skillKeywords.push(k);
    }
  }

  // Find common profile URLs
  let linkedinUrl: string | null = null;
  let githubUrl: string | null = null;
  let twitterUrl: string | null = null;
  for (const p of profiles) {
    if (!p || typeof p !== "object") continue;
    const net = String(p.network ?? "").toLowerCase();
    const url = p.url || p.username || null;
    if (net.includes("linkedin")) linkedinUrl = url;
    else if (net.includes("github")) githubUrl = url;
    else if (net.includes("twitter") || net === "x") twitterUrl = url;
  }

  // Certificates aliased to certifications with old + new keys
  const certifications = certificates.map((c: any) => ({
    name: c?.name,
    date: c?.date,
    issuer: c?.issuer,
    url: c?.url,
    issuing_organization: c?.issuer,
    date_obtained: c?.date,
  }));

  // Projects with backwards-compatible `technologies` alias
  const projectsCtx = projects.map((p: any) => ({
    name: p?.name,
    description: p?.description,
    url: p?.url,
    startDate: p?.startDate,
    endDate: p?.endDate,
    highlights: Array.isArray(p?.highlights) ? p.highlights : [],
    keywords: Array.isArray(p?.keywords) ? p.keywords : [],
    technologies: Array.isArray(p?.keywords) ? p.keywords : [],
  }));

  // Education with old-style aliases (school/degree/major/start_year/...)
  const educationCtx = education.map((e: any) => ({
    institution: e?.institution,
    url: e?.url,
    area: e?.area,
    studyType: e?.studyType,
    startDate: e?.startDate,
    endDate: e?.endDate,
    score: e?.score,
    courses: Array.isArray(e?.courses) ? e.courses : [],
    school: e?.institution,
    degree: e?.studyType,
    major: e?.area,
    start_year: (e?.startDate ? String(e.startDate).slice(0, 4) : null) || null,
    end_year: (e?.endDate ? String(e.endDate).slice(0, 4) : null) || null,
    grade: e?.score,
  }));

  // Hobbies derived from interests
  const hobbiesFlat: string[] = interests
    .map((i: any) => i?.name)
    .filter((n: any) => typeof n === "string" && n.trim());

  return {
    // JSON Resume native
    basics,
    location,
    location_str: locationStr,
    profiles,
    work,
    volunteer,
    awards,
    certificates,
    publications,
    languages,
    interests,
    references,

    projects: projectsCtx,
    education: educationCtx,
    certifications,

    // Skills
    skill_groups: skillGroups,
    skills: skillKeywords,
    skill_keywords: skillKeywords,
    technical_skills: skillKeywords,
    soft_skills: [],

    hobbies: hobbiesFlat,

    // Convenience shortcuts
    name: basics.name || "Your Name",
    label: basics.label || null,
    image: basics.image || "",
    email: basics.email || null,
    phone: basics.phone || null,
    url: basics.url || null,
    summary: basics.summary || null,
    linkedin_url: linkedinUrl,
    github_url: githubUrl,
    twitter_url: twitterUrl,
    portfolio_url: basics.url || null,

    // Backwards-compat
    full_name: basics.name || null,
    address: locationStr,
    inferred_job_title: basics.label || null,
    years_of_experience: 0,
  };
}

export function renderTemplate(templateFile: string, jrData: any): string {
  const env = getEnv();
  const ctx = buildTemplateContext(jrData);
  return env.render(templateFile, ctx);
}
