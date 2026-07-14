/**
 * Resume PDF/text parsing.
 *
 *   - extractPdfText: extract raw text from a PDF buffer using pdf-parse.
 *   - parseResumeText: try Ollama with a JSON-Resume system prompt;
 *     fall back to regex-based extraction if Ollama is unavailable.
 */

const PARSE_RESUME_SYSTEM_PROMPT = `You are an expert resume parser. Read the candidate's resume text and respond ONLY with a single valid JSON object that matches the JSON Resume schema (https://jsonresume.org/schema/). No prose, no markdown fences.

Extract:
- "basics": { "name", "label" (inferred target role), "email", "phone", "url" (personal site), "summary", "location": { "address", "city", "region", "postalCode", "countryCode" }, "profiles": [ { "network", "username", "url" } ] }
- "work": [ { "name" (company), "position", "url", "startDate" (YYYY-MM or YYYY-MM-DD), "endDate", "summary", "highlights": [string, ...], "location" } ]
- "education": [ { "institution", "url", "area", "studyType", "startDate", "endDate", "score", "courses": [string, ...] } ]
- "skills": [ { "name" (group, e.g. "Programming Languages"), "level", "keywords": [string, ...] } ]
- "projects": [ { "name", "description", "url", "startDate", "endDate", "highlights": [string, ...], "keywords": [string, ...] } ]
- "certificates": [ { "name", "date", "issuer", "url" } ]
- "languages": [ { "language", "fluency" } ]
- "awards": [ { "title", "date", "awarder", "summary" } ]
- "publications": [ { "name", "publisher", "releaseDate", "url", "summary" } ]
- "volunteer": [ { "organization", "position", "startDate", "endDate", "summary", "highlights": [string, ...] } ]
- "interests": [ { "name", "keywords": [string, ...] } ]

Rules:
- Use null or empty array if a section is absent — do NOT invent data.
- Highlights/bullets must be the candidate's own phrasing, trimmed.
- Dates: prefer YYYY-MM-DD; YYYY-MM is fine; if only year is available use YYYY-01-01.
- Phone & email must be taken verbatim from the resume.
- Group skills logically (Programming, Frameworks, Tools, Soft Skills, etc.).
- Output STRICT JSON. No code fences. No trailing text.
`;

export async function extractPdfText(buffer: Buffer): Promise<string> {
  // Dynamic import — pdf-parse touches the filesystem at import-time in some
  // builds, which Next.js dislikes if bundled eagerly.
  const mod: any = await import("pdf-parse");
  const pdfParse = mod.default || mod;
  const data = await pdfParse(buffer);
  return (data?.text ?? "").toString();
}

export async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

export async function extractImageText(buffer: Buffer): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  const { data: { text } } = await worker.recognize(buffer);
  await worker.terminate();
  return text || "";
}

function pickFirst<T>(...vals: (T | null | undefined)[]): T | null {
  for (const v of vals) {
    if (v !== null && v !== undefined && v !== ("" as any)) return v as T;
  }
  return null;
}

function fallbackParse(text: string): any {
  const t = text || "";

  // Basic regex extractions
  const emailMatch = t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = t.match(/(\+?\d[\d\s().-]{7,}\d)/);
  const urlMatches = t.match(/https?:\/\/[^\s)]+/gi) || [];
  const linkedin = urlMatches.find((u) => /linkedin\.com/i.test(u)) || null;
  const github = urlMatches.find((u) => /github\.com/i.test(u)) || null;
  const portfolio =
    urlMatches.find((u) => !/linkedin\.com|github\.com/i.test(u)) || null;

  // First non-empty line as guess for name
  const lines = t.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const name = lines.length > 0 ? lines[0] : null;

  // Section splitter: capture text between common headers
  const sectionRe =
    /\b(experience|work experience|employment|education|skills|projects|certifications?|summary|profile|objective|awards|publications|volunteer|languages|interests)\b[\s:]*\n/i;

  const sections: Record<string, string> = {};
  // Walk over headings sequentially
  const headingRe =
    /\b(experience|work experience|employment|education|skills|projects|certifications?|summary|profile|objective|awards|publications|volunteer|languages|interests)\b[\s:]*\n/gi;
  let lastHeader: string | null = null;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = headingRe.exec(t)) !== null) {
    if (lastHeader !== null) {
      sections[lastHeader.toLowerCase()] = t.slice(lastIndex, m.index).trim();
    }
    lastHeader = m[1];
    lastIndex = m.index + m[0].length;
  }
  if (lastHeader !== null) {
    sections[lastHeader.toLowerCase()] = t.slice(lastIndex).trim();
  }

  // Crude skills extraction: comma- or bullet-separated tokens in skills section
  const skillsBlock =
    sections["skills"] ||
    sections["technical skills"] ||
    "";
  const skillKeywords: string[] = skillsBlock
    ? skillsBlock
        .split(/[,•\n;|]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 40)
        .slice(0, 20)
    : [];

  const summary =
    sections["summary"] || sections["profile"] || sections["objective"] || null;

  return {
    basics: {
      name,
      label: null,
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0].trim() : null,
      url: portfolio,
      summary: summary ? summary.slice(0, 1000) : null,
      location: {
        address: null,
        city: null,
        region: null,
        postalCode: null,
        countryCode: null,
      },
      profiles: [
        ...(linkedin ? [{ network: "LinkedIn", username: null, url: linkedin }] : []),
        ...(github ? [{ network: "GitHub", username: null, url: github }] : []),
      ],
    },
    work: [],
    education: [],
    skills:
      skillKeywords.length > 0
        ? [{ name: "Skills", level: null, keywords: skillKeywords }]
        : [],
    projects: [],
    certificates: [],
    languages: [],
    awards: [],
    publications: [],
    volunteer: [],
    interests: [],
    _fallback: true,
  };
}

export async function parseResumeText(text: string): Promise<any> {
  const apiKey = process.env.OLLAMA_API_KEY;
  const model = process.env.MODEL_NAME || "gpt-oss:120b";

  if (!apiKey) return fallbackParse(text);

  try {
    let resumeText = text || "";
    if (resumeText.length > 24000) resumeText = resumeText.slice(0, 24000) + "...[truncated]";

    const payload = {
      model,
      messages: [
        { role: "system", content: PARSE_RESUME_SYSTEM_PROMPT },
        { role: "user", content: `Resume text:\n${resumeText}` },
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

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
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

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return fallbackParse(text);
    }

    // Make sure required keys exist
    parsed.basics = parsed.basics || {};
    parsed.work = Array.isArray(parsed.work) ? parsed.work : [];
    parsed.education = Array.isArray(parsed.education) ? parsed.education : [];
    parsed.skills = Array.isArray(parsed.skills) ? parsed.skills : [];
    return parsed;
  } catch {
    return fallbackParse(text);
  }
}
