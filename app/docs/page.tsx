import type { Metadata } from "next";
import Header from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { TEMPLATES } from "@/lib/templates-registry";

export const metadata: Metadata = {
  title: "API Docs — Resume Builder",
  description:
    "REST API reference for the Resume Builder: parse PDFs, render 62 templates, ATS-score resumes via JSON Resume schema. No signup required.",
};

/* ============================================================
   Presentation primitives (pure server components — no JS)
   ============================================================ */

function MethodBadge({ method }: { method: "GET" | "POST" | "PUT" | "DELETE" }) {
  const color =
    method === "GET"
      ? "bg-green-500"
      : method === "POST"
      ? "bg-brand-600"
      : method === "PUT"
      ? "bg-amber-500"
      : "bg-red-500";
  return (
    <span
      className={`inline-block ${color} text-white text-xs font-bold uppercase tracking-wider rounded px-2 py-0.5`}
    >
      {method}
    </span>
  );
}

function Endpoint({
  method,
  path,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
}) {
  return (
    <div className="my-3 inline-flex max-w-full items-center gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
      <MethodBadge method={method} />
      <span className="break-all font-mono font-medium text-slate-900">
        {path}
      </span>
    </div>
  );
}

function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center bg-slate-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
      {children}
    </span>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-slate-200/70 bg-slate-100 px-1.5 py-[1px] font-mono text-[12.5px] font-medium text-brand-700">
      {children}
    </code>
  );
}

function CodeBlock({
  children,
  language,
}: {
  children: string;
  language?: string;
}) {
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-[#0b1020] shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </div>
        {language ? (
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {language}
          </span>
        ) : null}
      </div>
      <pre className="overflow-x-auto whitespace-pre p-4 font-mono text-[13px] leading-[1.6] text-slate-100">
        {children}
      </pre>
    </div>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4 mt-12 scroll-mt-20"
    >
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">
      {children}
    </h3>
  );
}

function TabLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mt-5 mb-1">
      {children}
    </h4>
  );
}

function Callout({
  variant = "brand",
  title,
  children,
}: {
  variant?: "brand" | "warn" | "danger" | "success";
  title?: string;
  children: React.ReactNode;
}) {
  const styles =
    variant === "warn"
      ? "border-amber-500 bg-amber-50"
      : variant === "danger"
      ? "border-red-500 bg-red-50"
      : variant === "success"
      ? "border-green-500 bg-green-50"
      : "border-brand-500 bg-brand-50";
  return (
    <div className={`border-l-4 ${styles} px-4 py-3 rounded-r my-4 text-sm text-slate-700`}>
      {title ? <strong className="block mb-1 text-slate-900">{title}</strong> : null}
      {children}
    </div>
  );
}

function Step({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 my-5">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-sm flex items-center justify-center">
        {num}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
        {children}
      </div>
    </div>
  );
}

/* Table primitives */
function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
      {children}
    </th>
  );
}

function TD({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-3 py-2 border-t border-slate-100 text-[13px] text-slate-700 align-top">
      {children}
    </td>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  );
}

/* ============================================================
   Sidebar navigation data
   ============================================================ */

const NAV: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: "Getting Started",
    items: [
      { id: "intro", label: "Introduction" },
      { id: "quick-start", label: "Quick Start" },
    ],
  },
  {
    group: "Resume API",
    items: [
      { id: "upload", label: "Upload Resume" },
      { id: "get-resume", label: "Get Parsed Resume" },
      { id: "jsonresume", label: "Get as JSON Resume" },
      { id: "response-schema", label: "Response Schema" },
    ],
  },
  {
    group: "Templates API",
    items: [
      { id: "list-templates", label: "List Templates" },
      { id: "single-template", label: "Single Template" },
      { id: "categories", label: "Categories" },
      { id: "live-preview", label: "Live Preview (form→HTML)" },
      { id: "render-json", label: "Render (JSON)" },
      { id: "preview", label: "Preview (GET)" },
      { id: "available-templates", label: "Available Templates" },
    ],
  },
  {
    group: "ATS API",
    items: [
      { id: "ats-analyze", label: "ATS Analyze" },
      { id: "ai-feedback", label: "AI Feedback" },
    ],
  },
  {
    group: "Reference",
    items: [
      { id: "errors", label: "Error Codes" },
      { id: "client-examples", label: "Client Examples" },
      { id: "cheatsheet", label: "API Cheatsheet" },
    ],
  },
];

/* ============================================================
   Page
   ============================================================ */

export default function DocsPage() {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row gap-8 px-4 sm:px-6 py-8">
          {/* Sidebar */}
          <aside className="hidden md:block md:w-60 md:flex-shrink-0">
            <nav
              className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2"
              aria-label="Docs navigation"
            >
              {NAV.map((g) => (
                <div key={g.group} className="mb-5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                    {g.group}
                  </h4>
                  <ul>
                    {g.items.map((it) => (
                      <li key={it.id}>
                        <a
                          href={`#${it.id}`}
                          className="block px-3 py-1.5 text-sm text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded transition-colors"
                        >
                          {it.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 max-w-4xl">
            {/* Hero */}
            <section id="intro" className="scroll-mt-20">
              <div className="bg-gradient-to-br from-brand-50 to-violet-50 p-10 rounded-2xl border border-brand-100">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                  Resume Parser API
                </h1>
                <p className="mt-3 text-slate-700 text-base md:text-lg max-w-2xl">
                  Upload a PDF → get parsed JSON. Render into 62 beautiful
                  templates. AI-powered ATS scoring. No signup required.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <HeroBadge>Next.js</HeroBadge>
                  <HeroBadge>AI-Powered</HeroBadge>
                  <HeroBadge>62 Templates</HeroBadge>
                  <HeroBadge>CORS Enabled</HeroBadge>
                  <HeroBadge>REST API</HeroBadge>
                  <HeroBadge>JSON Resume</HeroBadge>
                  <HeroBadge>Free</HeroBadge>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4 mt-12 scroll-mt-20">
                Introduction
              </h2>
              <p className="text-slate-700 leading-relaxed">
                The Resume Parser API is a Next.js App Router REST service that
                does four things:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">1. Parse PDFs</h4>
                  <p className="text-[13px] text-slate-600">
                    Extract structured data from resume PDFs using AI, returning
                    the standard JSON Resume schema.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">2. Template Gallery</h4>
                  <p className="text-[13px] text-slate-600">
                    Browse 62 resume templates via a simple JSON API — ideal for
                    a template picker screen.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">3. HTML Rendering</h4>
                  <p className="text-[13px] text-slate-600">
                    Render any JSON Resume into any template and get back raw
                    HTML for live preview or PDF export.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">4. ATS Scoring</h4>
                  <p className="text-[13px] text-slate-600">
                    Rule-based scoring plus AI-generated feedback covering
                    keywords, action verbs, weak areas and more.
                  </p>
                </div>
              </div>
              <p className="text-slate-700 mt-4">
                <strong>Base URL:</strong>{" "}
                <InlineCode>http://localhost:3000</InlineCode> (or your deployed
                origin). From the browser, prefer relative paths like{" "}
                <InlineCode>/api/templates</InlineCode>.
              </p>
              <p className="text-slate-700 mt-2">
                <strong>Schema:</strong> Every endpoint that accepts or returns
                resume data uses the standardized{" "}
                <a
                  href="https://jsonresume.org/schema"
                  className="text-brand-700 underline hover:text-brand-800"
                  target="_blank"
                  rel="noreferrer"
                >
                  JSON Resume
                </a>{" "}
                shape (<InlineCode>basics</InlineCode>,{" "}
                <InlineCode>work</InlineCode>, <InlineCode>education</InlineCode>,{" "}
                <InlineCode>skills</InlineCode>, etc.).
              </p>
            </section>

            {/* Quick Start */}
            <section id="quick-start" className="scroll-mt-20">
              <SectionTitle id="quick-start-h">Quick Start</SectionTitle>
              <p className="text-slate-700">The full workflow in 4 API calls:</p>

              <Step num={1} title="Upload a PDF">
                <Endpoint method="POST" path="/api/upload-resume" />
                <p className="text-[14px] text-slate-700">
                  Send the PDF as <InlineCode>multipart/form-data</InlineCode>.
                  You get back parsed JSON Resume + ATS scores +{" "}
                  <InlineCode>upload_id</InlineCode>.
                </p>
              </Step>

              <Step num={2} title="List available templates">
                <Endpoint method="GET" path="/api/templates" />
                <p className="text-[14px] text-slate-700">
                  Show thumbnails in a grid and let the user pick one of 62
                  designs.
                </p>
              </Step>

              <Step num={3} title="Render the chosen template">
                <Endpoint method="POST" path="/api/templates/{id}/html" />
                <p className="text-[14px] text-slate-700">
                  Pipe the parsed JSON (or <InlineCode>upload_id</InlineCode>)
                  back in and stream HTML into an iframe&apos;s{" "}
                  <InlineCode>srcDoc</InlineCode>.
                </p>
              </Step>

              <Step num={4} title="Get ATS feedback">
                <Endpoint method="POST" path="/api/ats-analyze" />
                <p className="text-[14px] text-slate-700">
                  Score the resume with rule-based + AI feedback to drive your
                  ATS UI.
                </p>
              </Step>
            </section>

            {/* Upload Resume */}
            <section id="upload" className="scroll-mt-20">
              <SectionTitle id="upload-h">1. Upload Resume</SectionTitle>
              <Endpoint method="POST" path="/api/upload-resume" />
              <p className="text-slate-700">
                Upload a PDF file and get back structured, parsed resume data in
                JSON Resume format plus ATS scoring.
              </p>

              <SubTitle>Request</SubTitle>
              <p className="text-slate-700 text-sm">
                <strong>Content-Type:</strong>{" "}
                <InlineCode>multipart/form-data</InlineCode>
              </p>
              <Table>
                <thead>
                  <tr>
                    <TH>Field</TH>
                    <TH>Type</TH>
                    <TH>Required</TH>
                    <TH>Description</TH>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <TD>
                      <InlineCode>file</InlineCode>
                    </TD>
                    <TD>File</TD>
                    <TD>Yes</TD>
                    <TD>PDF resume, max 16 MB</TD>
                  </tr>
                </tbody>
              </Table>

              <SubTitle>Code Examples</SubTitle>

              <TabLabel>cURL</TabLabel>
              <CodeBlock>{`curl -X POST \\
  -F "file=@resume.pdf" \\
  http://localhost:3000/api/upload-resume`}</CodeBlock>

              <TabLabel>JavaScript (fetch)</TabLabel>
              <CodeBlock>{`const form = new FormData();
form.append("file", pdfFile);        // File from <input type="file">

const res = await fetch("/api/upload-resume", {
  method: "POST",
  body: form,
});
const json = await res.json();

// JSON Resume schema response
const uploadId = json.upload_id;
const basics = json.data.basics;
const summary = json.data.basics.summary;
const work = json.data.work;
console.log(basics.name, basics.email);`}</CodeBlock>

              <TabLabel>React Native</TabLabel>
              <CodeBlock>{`import * as DocumentPicker from "expo-document-picker";

// 1. Pick the PDF
const pick = await DocumentPicker.getDocumentAsync({
  type: "application/pdf",
});
if (pick.canceled) return;
const file = pick.assets[0];

// 2. Upload
const formData = new FormData();
formData.append("file", {
  uri: file.uri,
  name: file.name,
  type: "application/pdf",
});

const res = await fetch("http://192.168.1.10:3000/api/upload-resume", {
  method: "POST",
  body: formData,
  headers: { "Content-Type": "multipart/form-data" },
});
const json = await res.json();
// Save upload_id for later template rendering
await AsyncStorage.setItem("upload_id", String(json.upload_id));`}</CodeBlock>

              <TabLabel>Axios</TabLabel>
              <CodeBlock>{`import axios from "axios";

const form = new FormData();
form.append("file", file);

const { data } = await axios.post(
  "/api/upload-resume",
  form,
  { headers: { "Content-Type": "multipart/form-data" } }
);
console.log(data.upload_id, data.data.basics, data.ats_scores);`}</CodeBlock>

              <SubTitle>Success Response (200) — JSON Resume Schema</SubTitle>
              <Callout variant="success" title="JSON Resume Schema">
                The response uses the standardized JSON Resume shape:{" "}
                <InlineCode>basics</InlineCode>, <InlineCode>work</InlineCode>,{" "}
                <InlineCode>education</InlineCode>, <InlineCode>skills</InlineCode>,{" "}
                <InlineCode>projects</InlineCode>,{" "}
                <InlineCode>certificates</InlineCode>,{" "}
                <InlineCode>awards</InlineCode>,{" "}
                <InlineCode>publications</InlineCode>,{" "}
                <InlineCode>languages</InlineCode>,{" "}
                <InlineCode>interests</InlineCode>,{" "}
                <InlineCode>references</InlineCode>,{" "}
                <InlineCode>volunteer</InlineCode>.
              </Callout>

              <CodeBlock>{`{
  "status": 200,
  "statusText": "OK",
  "message": "Resume uploaded and parsed successfully",
  "upload_id": 18,
  "resume_file": "resume_JOHN-DOE_18_1776874753.pdf",
  "schema": "jsonresume",
  "data": {
    "basics": {
      "name": "John Doe",
      "label": "Programmer",
      "image": "",
      "email": "john@gmail.com",
      "phone": "(912) 555-4321",
      "url": "https://johndoe.com",
      "summary": "A summary of John Doe…",
      "location": {
        "address": "2712 Broadway St",
        "postalCode": "CA 94115",
        "city": "San Francisco",
        "countryCode": "US",
        "region": "California"
      },
      "profiles": [{
        "network": "Twitter",
        "username": "john",
        "url": "https://twitter.com/john"
      }]
    },
    "work": [{
      "name": "Company",
      "position": "President",
      "url": "https://company.com",
      "startDate": "2013-01-01",
      "endDate": "2014-01-01",
      "summary": "Description…",
      "highlights": ["Started the company"]
    }],
    "education": [{
      "institution": "University",
      "url": "https://institution.com/",
      "area": "Software Development",
      "studyType": "Bachelor",
      "startDate": "2011-01-01",
      "endDate": "2013-01-01",
      "score": "4.0",
      "courses": ["DB1101 - Basic SQL"]
    }],
    "skills": [{
      "name": "Web Development",
      "level": "Master",
      "keywords": ["HTML", "CSS", "JavaScript"]
    }],
    "projects": [{
      "name": "Project",
      "startDate": "2019-01-01",
      "endDate": "2021-01-01",
      "description": "Description...",
      "highlights": ["Won award at AIHacks 2016"],
      "url": "https://project.com/"
    }],
    "certificates": [{
      "name": "Certificate",
      "date": "2021-11-07",
      "issuer": "Company",
      "url": "https://certificate.com"
    }],
    "awards": [{
      "title": "Award",
      "date": "2014-11-01",
      "awarder": "Company",
      "summary": "There is no spoon."
    }],
    "publications": [{
      "name": "Publication",
      "publisher": "Company",
      "releaseDate": "2014-10-01",
      "url": "https://publication.com",
      "summary": "Description…"
    }],
    "languages": [{
      "language": "English",
      "fluency": "Native speaker"
    }],
    "interests": [{
      "name": "Wildlife",
      "keywords": ["Ferrets", "Unicorns"]
    }],
    "references": [{
      "name": "Jane Doe",
      "reference": "Reference…"
    }],
    "volunteer": [{
      "organization": "Organization",
      "position": "Volunteer",
      "url": "https://organization.com/",
      "startDate": "2012-01-01",
      "endDate": "2013-01-01",
      "summary": "Description…",
      "highlights": ["Awarded 'Volunteer of the Month'"]
    }]
  },
  "ats_scores": {
    "overall_score": 75,
    "breakdown": {
      "contact_info": 80,
      "work_experience": 75,
      "education": 80,
      "skills": 70
    },
    "feedback": [
      "Add more quantitative achievements to your work experience.",
      "Consider adding links to your projects."
    ]
  }
}`}</CodeBlock>

              <Callout variant="warn" title="Save the upload_id">
                <InlineCode>upload_id</InlineCode> is at the top level. Save it
                locally to fetch later via{" "}
                <InlineCode>/api/resume/&lt;upload_id&gt;</InlineCode> or to
                render templates without re-uploading.
              </Callout>

              <Callout title="Bidirectional">
                The same JSON Resume payload can be sent back to{" "}
                <InlineCode>/api/templates/&lt;id&gt;/html</InlineCode> or{" "}
                <InlineCode>/render</InlineCode> — your data stays in the same
                shape end-to-end.
              </Callout>
            </section>

            {/* Get Resume */}
            <section id="get-resume" className="scroll-mt-20">
              <SectionTitle id="get-resume-h">2. Get Parsed Resume</SectionTitle>
              <Endpoint method="GET" path="/api/resume/{upload_id}" />
              <p className="text-slate-700">
                Retrieve a previously parsed resume by its{" "}
                <InlineCode>upload_id</InlineCode>. Returns JSON Resume schema
                plus ATS scores. No re-upload needed.
              </p>

              <TabLabel>cURL</TabLabel>
              <CodeBlock>{`curl http://localhost:3000/api/resume/18`}</CodeBlock>

              <TabLabel>JavaScript</TabLabel>
              <CodeBlock>{`const res = await fetch(\`/api/resume/\${uploadId}\`);
const { data, ats_scores } = await res.json();`}</CodeBlock>

              <SubTitle>Response (200)</SubTitle>
              <CodeBlock>{`{
  "status": 200,
  "statusText": "OK",
  "message": "Resume fetched successfully",
  "upload_id": 18,
  "resume_file": "resume_JOHN-DOE_18_1776874753.pdf",
  "schema": "jsonresume",
  "data": {
    "basics": {...},
    "work": [...],
    "education": [...],
    "skills": [...],
    "projects": [...],
    "certificates": [...],
    "awards": [...],
    "publications": [...],
    "languages": [...],
    "interests": [...],
    "references": [...],
    "volunteer": [...]
  },
  "ats_scores": {
    "overall_score": 75,
    "breakdown": { "contact_info": 80, "work_experience": 75, "education": 80, "skills": 70 },
    "feedback": [
      "Add more quantitative achievements to your work experience.",
      "Consider adding links to your projects."
    ]
  }
}`}</CodeBlock>

              <Callout variant="warn" title="Persistence note">
                If <InlineCode>upload_id</InlineCode> returns 404, the upload
                record was wiped (e.g. ephemeral container restart). Re-upload
                the PDF.
              </Callout>
            </section>

            {/* JSON Resume Get */}
            <section id="jsonresume" className="scroll-mt-20">
              <SectionTitle id="jsonresume-h">3. Get as JSON Resume</SectionTitle>
              <Endpoint method="GET" path="/api/jsonresume/{upload_id}" />
              <p className="text-slate-700">
                Identical payload to <InlineCode>/api/resume/&lt;id&gt;</InlineCode>,
                but explicitly tagged with{" "}
                <InlineCode>schema: &quot;jsonresume&quot;</InlineCode> and a{" "}
                <InlineCode>spec_url</InlineCode> reference. Use this when you
                want clients to know the response conforms to the public spec.
              </p>

              <SubTitle>Response (200)</SubTitle>
              <CodeBlock>{`{
  "status": 200,
  "statusText": "OK",
  "message": "JSON Resume fetched successfully",
  "schema": "jsonresume",
  "spec_url": "https://jsonresume.org/schema",
  "upload_id": 18,
  "data": { "basics": {...}, "work": [...], "education": [...], "skills": [...] }
}`}</CodeBlock>

              <TabLabel>cURL</TabLabel>
              <CodeBlock>{`curl http://localhost:3000/api/jsonresume/18`}</CodeBlock>
            </section>

            {/* Response Schema */}
            <section id="response-schema" className="scroll-mt-20">
              <SectionTitle id="response-schema-h">4. Response Schema</SectionTitle>
              <p className="text-slate-700">
                The <InlineCode>data</InlineCode> object follows the JSON Resume
                spec. Top-level keys:
              </p>

              <SubTitle>Top-level fields</SubTitle>
              <Table>
                <thead>
                  <tr>
                    <TH>Field</TH>
                    <TH>Type</TH>
                    <TH>Description</TH>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <TD><InlineCode>upload_id</InlineCode></TD>
                    <TD>integer</TD>
                    <TD>Save this to fetch data later</TD>
                  </tr>
                  <tr>
                    <TD><InlineCode>resume_file</InlineCode></TD>
                    <TD>string</TD>
                    <TD>Server-generated filename</TD>
                  </tr>
                  <tr>
                    <TD><InlineCode>schema</InlineCode></TD>
                    <TD>string</TD>
                    <TD>Always <InlineCode>&quot;jsonresume&quot;</InlineCode></TD>
                  </tr>
                  <tr>
                    <TD><InlineCode>data</InlineCode></TD>
                    <TD>object</TD>
                    <TD>JSON Resume payload (see below)</TD>
                  </tr>
                  <tr>
                    <TD><InlineCode>ats_scores</InlineCode></TD>
                    <TD>object</TD>
                    <TD>Overall score + breakdown + feedback</TD>
                  </tr>
                </tbody>
              </Table>

              <SubTitle>basics</SubTitle>
              <Table>
                <thead>
                  <tr><TH>Field</TH><TH>Type</TH><TH>Description</TH></tr>
                </thead>
                <tbody>
                  <tr><TD><InlineCode>name</InlineCode></TD><TD>string</TD><TD>Full name</TD></tr>
                  <tr><TD><InlineCode>label</InlineCode></TD><TD>string</TD><TD>Headline / current title</TD></tr>
                  <tr><TD><InlineCode>image</InlineCode></TD><TD>string</TD><TD>Optional photo URL</TD></tr>
                  <tr><TD><InlineCode>email</InlineCode></TD><TD>string</TD><TD>Primary email</TD></tr>
                  <tr><TD><InlineCode>phone</InlineCode></TD><TD>string</TD><TD>Primary phone</TD></tr>
                  <tr><TD><InlineCode>url</InlineCode></TD><TD>string</TD><TD>Portfolio / personal site</TD></tr>
                  <tr><TD><InlineCode>summary</InlineCode></TD><TD>string</TD><TD>One-paragraph bio</TD></tr>
                  <tr><TD><InlineCode>location</InlineCode></TD><TD>object</TD><TD>address, city, region, postalCode, countryCode</TD></tr>
                  <tr><TD><InlineCode>profiles[]</InlineCode></TD><TD>array</TD><TD>network, username, url</TD></tr>
                </tbody>
              </Table>

              <SubTitle>work[]</SubTitle>
              <Table>
                <thead>
                  <tr><TH>Field</TH><TH>Type</TH></tr>
                </thead>
                <tbody>
                  <tr><TD><InlineCode>name</InlineCode></TD><TD>string (company)</TD></tr>
                  <tr><TD><InlineCode>position</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>url</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>startDate</InlineCode></TD><TD>string (YYYY-MM-DD)</TD></tr>
                  <tr><TD><InlineCode>endDate</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>summary</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>highlights[]</InlineCode></TD><TD>array of strings (bullets)</TD></tr>
                </tbody>
              </Table>

              <SubTitle>education[]</SubTitle>
              <Table>
                <thead>
                  <tr><TH>Field</TH><TH>Type</TH></tr>
                </thead>
                <tbody>
                  <tr><TD><InlineCode>institution</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>url</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>area</InlineCode></TD><TD>string (field of study)</TD></tr>
                  <tr><TD><InlineCode>studyType</InlineCode></TD><TD>string (Bachelor, Master, ...)</TD></tr>
                  <tr><TD><InlineCode>startDate</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>endDate</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>score</InlineCode></TD><TD>string (GPA)</TD></tr>
                  <tr><TD><InlineCode>courses[]</InlineCode></TD><TD>array of strings</TD></tr>
                </tbody>
              </Table>

              <SubTitle>skills[]</SubTitle>
              <Table>
                <thead><tr><TH>Field</TH><TH>Type</TH></tr></thead>
                <tbody>
                  <tr><TD><InlineCode>name</InlineCode></TD><TD>string (skill group)</TD></tr>
                  <tr><TD><InlineCode>level</InlineCode></TD><TD>string (Beginner ... Master)</TD></tr>
                  <tr><TD><InlineCode>keywords[]</InlineCode></TD><TD>array of strings</TD></tr>
                </tbody>
              </Table>

              <SubTitle>projects[]</SubTitle>
              <Table>
                <thead><tr><TH>Field</TH><TH>Type</TH></tr></thead>
                <tbody>
                  <tr><TD><InlineCode>name</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>description</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>highlights[]</InlineCode></TD><TD>array of strings</TD></tr>
                  <tr><TD><InlineCode>url</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>startDate</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>endDate</InlineCode></TD><TD>string</TD></tr>
                </tbody>
              </Table>

              <SubTitle>certificates[]</SubTitle>
              <Table>
                <thead><tr><TH>Field</TH><TH>Type</TH></tr></thead>
                <tbody>
                  <tr><TD><InlineCode>name</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>date</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>issuer</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>url</InlineCode></TD><TD>string</TD></tr>
                </tbody>
              </Table>

              <SubTitle>awards[]</SubTitle>
              <Table>
                <thead><tr><TH>Field</TH><TH>Type</TH></tr></thead>
                <tbody>
                  <tr><TD><InlineCode>title</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>date</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>awarder</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>summary</InlineCode></TD><TD>string</TD></tr>
                </tbody>
              </Table>

              <SubTitle>publications[]</SubTitle>
              <Table>
                <thead><tr><TH>Field</TH><TH>Type</TH></tr></thead>
                <tbody>
                  <tr><TD><InlineCode>name</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>publisher</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>releaseDate</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>url</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>summary</InlineCode></TD><TD>string</TD></tr>
                </tbody>
              </Table>

              <SubTitle>languages[]</SubTitle>
              <Table>
                <thead><tr><TH>Field</TH><TH>Type</TH></tr></thead>
                <tbody>
                  <tr><TD><InlineCode>language</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>fluency</InlineCode></TD><TD>string</TD></tr>
                </tbody>
              </Table>

              <SubTitle>interests[]</SubTitle>
              <Table>
                <thead><tr><TH>Field</TH><TH>Type</TH></tr></thead>
                <tbody>
                  <tr><TD><InlineCode>name</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>keywords[]</InlineCode></TD><TD>array of strings</TD></tr>
                </tbody>
              </Table>

              <SubTitle>references[]</SubTitle>
              <Table>
                <thead><tr><TH>Field</TH><TH>Type</TH></tr></thead>
                <tbody>
                  <tr><TD><InlineCode>name</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>reference</InlineCode></TD><TD>string</TD></tr>
                </tbody>
              </Table>

              <SubTitle>volunteer[]</SubTitle>
              <Table>
                <thead><tr><TH>Field</TH><TH>Type</TH></tr></thead>
                <tbody>
                  <tr><TD><InlineCode>organization</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>position</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>url</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>startDate</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>endDate</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>summary</InlineCode></TD><TD>string</TD></tr>
                  <tr><TD><InlineCode>highlights[]</InlineCode></TD><TD>array of strings</TD></tr>
                </tbody>
              </Table>

              <SubTitle>ats_scores</SubTitle>
              <Table>
                <thead><tr><TH>Field</TH><TH>Type</TH><TH>Description</TH></tr></thead>
                <tbody>
                  <tr><TD><InlineCode>overall_score</InlineCode></TD><TD>number (0-100)</TD><TD>Composite ATS score</TD></tr>
                  <tr><TD><InlineCode>breakdown</InlineCode></TD><TD>object</TD><TD>Per-section sub-scores</TD></tr>
                  <tr><TD><InlineCode>feedback[]</InlineCode></TD><TD>array of strings</TD><TD>Human-readable tips</TD></tr>
                </tbody>
              </Table>
            </section>

            {/* List Templates */}
            <section id="list-templates" className="scroll-mt-20">
              <SectionTitle id="list-templates-h">5. List Templates</SectionTitle>
              <Endpoint method="GET" path="/api/templates" />
              <p className="text-slate-700">
                Returns all 62 available resume templates. When neither{" "}
                <InlineCode>page</InlineCode> nor <InlineCode>limit</InlineCode>{" "}
                is provided, the full registry is returned in one shot.
              </p>

              <SubTitle>Query Parameters (optional)</SubTitle>
              <Table>
                <thead>
                  <tr><TH>Param</TH><TH>Values</TH><TH>Example</TH></tr>
                </thead>
                <tbody>
                  <tr><TD><InlineCode>category</InlineCode></TD><TD>modern, classic, creative</TD><TD><InlineCode>?category=creative</InlineCode></TD></tr>
                  <tr><TD><InlineCode>is_premium</InlineCode></TD><TD>true, false</TD><TD><InlineCode>?is_premium=false</InlineCode></TD></tr>
                  <tr><TD><InlineCode>search</InlineCode></TD><TD>any keyword (name, tag, description)</TD><TD><InlineCode>?search=developer</InlineCode></TD></tr>
                  <tr><TD><InlineCode>page</InlineCode></TD><TD>integer (default: 1)</TD><TD><InlineCode>?page=2</InlineCode></TD></tr>
                  <tr><TD><InlineCode>limit</InlineCode></TD><TD>integer (default: 10)</TD><TD><InlineCode>?limit=5</InlineCode></TD></tr>
                </tbody>
              </Table>

              <TabLabel>cURL</TabLabel>
              <CodeBlock>{`curl "http://localhost:3000/api/templates?category=modern&limit=5"`}</CodeBlock>

              <SubTitle>Response</SubTitle>
              <CodeBlock>{`{
  "status": 200,
  "statusText": "OK",
  "message": "Templates fetched successfully",
  "data": {
    "total": 62,
    "page": 1,
    "limit": 10,
    "pages": 7,
    "templates": [
      {
        "id": 1,
        "slug": "minimalist-clean",
        "name": "The Minimalist",
        "description": "Clean, structured layout with emphasis on typography.",
        "category": "modern",
        "thumbnail": "http://localhost:3000/static/templates/thumb/1.png",
        "color_scheme": {
          "primary": "#2c3e50",
          "secondary": "#f7f9fa",
          "text": "#333333",
          "accent": "#2c3e50"
        },
        "font_family": "Inter, sans-serif",
        "layout": "two_column",
        "is_premium": false,
        "template_file": "resume_1_minimalist.html",
        "sections": ["summary", "experience", "education", "skills"],
        "tags": ["minimal", "corporate", "ats-friendly"],
        "render_url": "http://localhost:3000/api/templates/1/render",
        "preview_url": "http://localhost:3000/api/templates/1/preview"
      }
    ]
  }
}`}</CodeBlock>

              <Callout title="Rendering a Template Gallery">
                Use the <InlineCode>thumbnail</InlineCode> URL for the gallery
                card image and the <InlineCode>preview_url</InlineCode> when the
                user taps a template.
              </Callout>
            </section>

            {/* Single Template */}
            <section id="single-template" className="scroll-mt-20">
              <SectionTitle id="single-template-h">6. Single Template</SectionTitle>
              <Endpoint method="GET" path="/api/templates/{id}" />
              <p className="text-slate-700">
                Fetch one template by numeric ID (1-62).
              </p>

              <TabLabel>cURL</TabLabel>
              <CodeBlock>{`curl http://localhost:3000/api/templates/3`}</CodeBlock>

              <SubTitle>Response (200)</SubTitle>
              <CodeBlock>{`{
  "status": 200,
  "data": {
    "id": 3,
    "slug": "dark-mode-dev",
    "name": "Dark Mode Dev",
    "category": "modern",
    "layout": "two_column",
    "is_premium": false,
    "tags": ["developer", "dark", "tech", "engineering"],
    "render_url":  "http://localhost:3000/api/templates/3/render",
    "preview_url": "http://localhost:3000/api/templates/3/preview"
  }
}`}</CodeBlock>
            </section>

            {/* Categories */}
            <section id="categories" className="scroll-mt-20">
              <SectionTitle id="categories-h">7. Template Categories</SectionTitle>
              <Endpoint method="GET" path="/api/templates/categories" />
              <p className="text-slate-700">
                Returns all unique categories with template counts.
              </p>

              <TabLabel>cURL</TabLabel>
              <CodeBlock>{`curl http://localhost:3000/api/templates/categories`}</CodeBlock>

              <SubTitle>Response</SubTitle>
              <CodeBlock>{`{
  "status": 200,
  "data": {
    "total": 3,
    "categories": [
      { "name": "modern",   "count": 28 },
      { "name": "classic",  "count": 19 },
      { "name": "creative", "count": 15 }
    ]
  }
}`}</CodeBlock>
            </section>

            {/* Live Preview (POST /html) */}
            <section id="live-preview" className="scroll-mt-20">
              <SectionTitle id="live-preview-h">
                8. Live Preview (Form → HTML)
              </SectionTitle>
              <Endpoint method="POST" path="/api/templates/{id}/html" />
              <p className="text-slate-700">
                <strong>The main builder endpoint.</strong> Send a JSON Resume
                payload → get raw rendered HTML back. Perfect for real-time
                preview in an iframe&apos;s <InlineCode>srcDoc</InlineCode> or a
                React Native <InlineCode>WebView</InlineCode> while the user
                types.
              </p>

              <Callout variant="success" title="Accepts JSON Resume OR upload_id">
                Send the full JSON Resume body, or just{" "}
                <InlineCode>{`{ "upload_id": 18 }`}</InlineCode> to render a
                previously parsed resume from the server.
              </Callout>

              <SubTitle>Request Body — Option A: Full JSON Resume</SubTitle>
              <CodeBlock>{`{
  "basics": {
    "name": "Poonam Batham",
    "email": "poonam@example.com",
    "phone": "+91-9399435171",
    "label": "Python Backend Developer",
    "summary": "Python Backend Developer with 3 years..."
  },
  "work": [
    {
      "name": "SummitCode",
      "position": "Agentic AI Engineer",
      "startDate": "2026-01-01",
      "endDate": "",
      "summary": "",
      "highlights": ["Built AI agents", "Integrated LLMs"]
    }
  ],
  "education": [
    {
      "institution": "ITM University",
      "studyType": "B.E.",
      "area": "Computer Science",
      "endDate": "2018-06-01"
    }
  ],
  "projects": [
    {
      "name": "Order Management System",
      "description": "Backend with Flask + RBAC",
      "highlights": ["Flask", "MySQL"]
    }
  ],
  "skills": [
    { "name": "Backend", "keywords": ["Python", "Django", "Flask"] }
  ],
  "certificates": [
    {
      "name": "AWS Certified",
      "issuer": "Amazon Web Services",
      "date": "2024-08-01"
    }
  ]
}`}</CodeBlock>

              <SubTitle>Request Body — Option B: From stored upload</SubTitle>
              <CodeBlock>{`{ "upload_id": 18 }`}</CodeBlock>

              <SubTitle>Response</SubTitle>
              <p className="text-slate-700 text-sm">
                <strong>Raw HTML string</strong> (Content-Type:{" "}
                <InlineCode>text/html</InlineCode>). Inject directly into an
                iframe&apos;s <InlineCode>srcDoc</InlineCode>.
              </p>

              <SubTitle>Live Preview in React</SubTitle>
              <CodeBlock>{`"use client";
import { useState, useEffect } from "react";

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ResumeBuilder() {
  const [templateId, setTemplateId] = useState(1);
  const [resume, setResume] = useState({
    basics: { name: "", email: "" },
    work: [],
    education: [],
    projects: [],
    skills: [],
    certificates: [],
  });

  const debounced = useDebounce(resume, 400);
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch(\`/api/templates/\${templateId}/html\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(debounced),
    })
      .then((r) => r.text())
      .then(setHtml);
  }, [debounced, templateId]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <Form data={resume} onChange={setResume} />
      <iframe srcDoc={html} style={{ width: "100%", height: "100vh", border: 0 }} />
    </div>
  );
}`}</CodeBlock>

              <SubTitle>Live Preview in React Native</SubTitle>
              <CodeBlock>{`import { WebView } from "react-native-webview";

const [html, setHtml] = useState("");

useEffect(() => {
  const timer = setTimeout(async () => {
    const res = await fetch(\`\${API}/api/templates/\${id}/html\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resume),
    });
    setHtml(await res.text());
  }, 400);
  return () => clearTimeout(timer);
}, [resume, id]);

<WebView source={{ html }} style={{ flex: 1 }} />`}</CodeBlock>
            </section>

            {/* Render JSON */}
            <section id="render-json" className="scroll-mt-20">
              <SectionTitle id="render-json-h">9. Render Template (JSON wrapped)</SectionTitle>
              <Endpoint method="POST" path="/api/templates/{id}/render" />
              <p className="text-slate-700">
                Same as <InlineCode>/html</InlineCode> but returns HTML inside a
                JSON envelope. Useful when you need the HTML for post-processing
                (PDF conversion, storage, etc.).
              </p>

              <SubTitle>Request Body</SubTitle>
              <p className="text-slate-700 text-sm">
                JSON Resume payload, or <InlineCode>{`{ "upload_id": N }`}</InlineCode>.
              </p>

              <SubTitle>Response</SubTitle>
              <CodeBlock>{`{
  "status": 200,
  "statusText": "OK",
  "message": "Template rendered successfully",
  "data": {
    "template_id": 3,
    "template_name": "Dark Mode Dev",
    "html": "<!DOCTYPE html><html>...</html>"
  }
}`}</CodeBlock>

              <TabLabel>cURL</TabLabel>
              <CodeBlock>{`curl -X POST http://localhost:3000/api/templates/3/render \\
  -H "Content-Type: application/json" \\
  -d '{"upload_id": 18}'`}</CodeBlock>

              <TabLabel>JavaScript</TabLabel>
              <CodeBlock>{`const res = await fetch(\`/api/templates/\${id}/render\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(resume),
});
const { data } = await res.json();
document.getElementById("preview").srcdoc = data.html;`}</CodeBlock>
            </section>

            {/* Preview GET */}
            <section id="preview" className="scroll-mt-20">
              <SectionTitle id="preview-h">10. Preview Template (GET)</SectionTitle>
              <Endpoint method="GET" path="/api/templates/{id}/preview" />
              <p className="text-slate-700">
                Returns rendered HTML directly (Content-Type:{" "}
                <InlineCode>text/html</InlineCode>). Ideal when you have a
                stored <InlineCode>upload_id</InlineCode> and want a simple URL
                for iframe/WebView. Omit <InlineCode>upload_id</InlineCode> for
                built-in sample data — useful for generating template
                thumbnails.
              </p>

              <SubTitle>Query Parameters</SubTitle>
              <Table>
                <thead>
                  <tr><TH>Param</TH><TH>Type</TH><TH>Description</TH></tr>
                </thead>
                <tbody>
                  <tr><TD><InlineCode>upload_id</InlineCode></TD><TD>integer</TD><TD>Omit for built-in sample data</TD></tr>
                </tbody>
              </Table>

              <SubTitle>Examples</SubTitle>
              <CodeBlock>{`# Sample data (for template thumbnails)
http://localhost:3000/api/templates/1/preview

# Real user data
http://localhost:3000/api/templates/3/preview?upload_id=18`}</CodeBlock>

              <TabLabel>React iframe</TabLabel>
              <CodeBlock>{`<iframe
  src={\`/api/templates/\${id}/preview?upload_id=\${uploadId}\`}
  style={{ width: "100%", height: "100vh", border: 0 }}
/>`}</CodeBlock>

              <TabLabel>React Native WebView</TabLabel>
              <CodeBlock>{`<WebView
  source={{ uri: \`\${API}/api/templates/\${templateId}/preview?upload_id=\${uploadId}\` }}
  style={{ flex: 1 }}
/>`}</CodeBlock>

              <Callout title="When to use which?">
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>
                    <strong>POST /html</strong> — live preview while user types
                    (JSON Resume → raw HTML).
                  </li>
                  <li>
                    <strong>POST /render</strong> — get HTML as a string (for
                    PDF conversion, storage).
                  </li>
                  <li>
                    <strong>GET /preview</strong> — display a saved resume
                    (upload_id already exists).
                  </li>
                </ul>
              </Callout>
            </section>

            {/* Available Templates */}
            <section id="available-templates" className="scroll-mt-20">
              <SectionTitle id="available-templates-h">
                11. Available Templates
              </SectionTitle>
              <p className="text-slate-700">
                All 62 templates available out of the box. Templates with{" "}
                <strong>Photo</strong> support a profile photo via{" "}
                <InlineCode>basics.image</InlineCode>.
              </p>

              <Table>
                <thead>
                  <tr>
                    <TH>ID</TH>
                    <TH>Name</TH>
                    <TH>Category</TH>
                    <TH>Layout</TH>
                    <TH>Photo</TH>
                    <TH>Premium</TH>
                  </tr>
                </thead>
                <tbody>
                  {TEMPLATES.map((t) => (
                    <tr key={t.id}>
                      <TD>{t.id}</TD>
                      <TD>
                        <span className="font-medium text-slate-900">{t.name}</span>
                      </TD>
                      <TD>
                        <span className="inline-flex items-center text-[12px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {t.category}
                        </span>
                      </TD>
                      <TD>
                        <code className="font-mono text-[12px] text-slate-600">
                          {t.layout}
                        </code>
                      </TD>
                      <TD>
                        {t.supports_image ? (
                          <span className="text-green-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TD>
                      <TD>
                        {t.is_premium ? (
                          <span className="text-amber-700 font-semibold">Premium</span>
                        ) : (
                          <span className="text-slate-500">Free</span>
                        )}
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </section>

            {/* ATS Analyze */}
            <section id="ats-analyze" className="scroll-mt-20">
              <SectionTitle id="ats-analyze-h">12. ATS Analyze</SectionTitle>
              <Endpoint method="POST" path="/api/ats-analyze" />
              <p className="text-slate-700">
                Score a resume with both rule-based + AI feedback. Submit a JSON
                Resume payload directly, or reference a previously uploaded
                resume by <InlineCode>upload_id</InlineCode>.
              </p>

              <SubTitle>Request Body (one of the two)</SubTitle>
              <Table>
                <thead>
                  <tr><TH>Name</TH><TH>Type</TH><TH>Required</TH><TH>Description</TH></tr>
                </thead>
                <tbody>
                  <tr>
                    <TD><InlineCode>resume</InlineCode></TD>
                    <TD>object</TD>
                    <TD>*</TD>
                    <TD>JSON Resume object to analyze.</TD>
                  </tr>
                  <tr>
                    <TD><InlineCode>upload_id</InlineCode></TD>
                    <TD>integer</TD>
                    <TD>*</TD>
                    <TD>Reference a stored upload instead of inlining.</TD>
                  </tr>
                </tbody>
              </Table>

              <TabLabel>cURL — inline resume</TabLabel>
              <CodeBlock>{`curl -X POST http://localhost:3000/api/ats-analyze \\
  -H "Content-Type: application/json" \\
  -d '{"resume": {"basics": {"name": "Jane Doe", "email": "jane@example.com"}, "work": [], "education": []}}'`}</CodeBlock>

              <TabLabel>cURL — by upload_id</TabLabel>
              <CodeBlock>{`curl -X POST http://localhost:3000/api/ats-analyze \\
  -H "Content-Type: application/json" \\
  -d '{"upload_id": 18}'`}</CodeBlock>

              <TabLabel>JavaScript</TabLabel>
              <CodeBlock>{`const res = await fetch("/api/ats-analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ resume }),
});
const { rule_based, ai_analysis } = await res.json();`}</CodeBlock>

              <SubTitle>Response (200)</SubTitle>
              <CodeBlock>{`{
  "status": 200,
  "statusText": "OK",
  "rule_based": {
    "overall_score": 82,
    "breakdown": {
      "contact_info": 100,
      "work_experience": 80,
      "education": 90,
      "skills": 70
    },
    "feedback": [
      "Strong contact section.",
      "Add metrics to work bullets."
    ],
    "stats": {
      "word_count": 412,
      "bullet_count": 18,
      "quantified_bullets": 7,
      "action_verb_bullets": 14
    }
  },
  "ai_analysis": {
    "missing_sections": ["projects"],
    "weak_areas": [
      "Summary is too long",
      "Skills section lacks proficiency levels"
    ],
    "keyword_suggestions": ["TypeScript", "CI/CD", "Kubernetes"],
    "action_verb_upgrades": [
      { "from": "Worked on", "to": "Engineered" },
      { "from": "Helped with", "to": "Led" }
    ],
    "quantification_tips": [
      "Quantify the impact of your design system rebuild (e.g., reduced bundle size by X%)"
    ],
    "summary_rewrite": "Senior frontend engineer with 8+ years building production React apps...",
    "strengths": [
      "Quantified impact in last role",
      "Clear progression"
    ],
    "ats_risk_flags": [
      "References line still present",
      "Two-column layout may confuse some ATS parsers"
    ],
    "overall_recommendation": "Cut the summary, add metrics to 3 more bullets, and remove the references line.",
    "inferred_target_role": "Senior Frontend Engineer",
    "ai_powered": true
  }
}`}</CodeBlock>
            </section>

            {/* AI Feedback subsection */}
            <section id="ai-feedback" className="scroll-mt-20">
              <SectionTitle id="ai-feedback-h">13. AI Feedback Structure</SectionTitle>
              <p className="text-slate-700">
                The <InlineCode>ai_analysis</InlineCode> object surfaces
                structured fields you can render directly into UI cards:
              </p>

              <Table>
                <thead>
                  <tr><TH>Field</TH><TH>Type</TH><TH>Description</TH></tr>
                </thead>
                <tbody>
                  <tr><TD><InlineCode>missing_sections</InlineCode></TD><TD>string[]</TD><TD>Sections the resume is missing</TD></tr>
                  <tr><TD><InlineCode>weak_areas</InlineCode></TD><TD>string[]</TD><TD>Specific weaknesses with explanations</TD></tr>
                  <tr><TD><InlineCode>keyword_suggestions</InlineCode></TD><TD>string[]</TD><TD>Keywords to add for the target role</TD></tr>
                  <tr><TD><InlineCode>action_verb_upgrades</InlineCode></TD><TD>{`{from, to}[]`}</TD><TD>Suggested replacements for weak verbs</TD></tr>
                  <tr><TD><InlineCode>quantification_tips</InlineCode></TD><TD>string[]</TD><TD>Hints for adding numbers/metrics</TD></tr>
                  <tr><TD><InlineCode>summary_rewrite</InlineCode></TD><TD>string</TD><TD>Suggested rewritten professional summary</TD></tr>
                  <tr><TD><InlineCode>strengths</InlineCode></TD><TD>string[]</TD><TD>What the resume does well</TD></tr>
                  <tr><TD><InlineCode>ats_risk_flags</InlineCode></TD><TD>string[]</TD><TD>Layout / formatting risks for ATS parsers</TD></tr>
                  <tr><TD><InlineCode>overall_recommendation</InlineCode></TD><TD>string</TD><TD>One-paragraph plan of action</TD></tr>
                  <tr><TD><InlineCode>inferred_target_role</InlineCode></TD><TD>string</TD><TD>Role the AI inferred from the content</TD></tr>
                  <tr><TD><InlineCode>ai_powered</InlineCode></TD><TD>boolean</TD><TD><InlineCode>false</InlineCode> if the AI provider was unavailable and fallback rules were used</TD></tr>
                </tbody>
              </Table>

              <Callout variant="warn" title="Fallback behavior">
                If the AI provider is unreachable,{" "}
                <InlineCode>ai_powered</InlineCode> is{" "}
                <InlineCode>false</InlineCode> and only{" "}
                <InlineCode>rule_based</InlineCode> scores will be populated
                with meaningful data. Always check <InlineCode>ai_powered</InlineCode>{" "}
                before rendering AI cards.
              </Callout>
            </section>

            {/* Errors */}
            <section id="errors" className="scroll-mt-20">
              <SectionTitle id="errors-h">14. Error Codes</SectionTitle>
              <p className="text-slate-700">
                All errors follow the same envelope shape so clients can handle
                them uniformly.
              </p>

              <CodeBlock>{`{
  "status": 400,
  "statusText": "Bad Request",
  "message": "Human-readable message",
  "error_code": "ERROR_CODE",
  "data": null
}`}</CodeBlock>

              <Table>
                <thead>
                  <tr><TH>HTTP</TH><TH>Code</TH><TH>Meaning</TH></tr>
                </thead>
                <tbody>
                  <tr><TD>400</TD><TD><InlineCode>NO_FILE_FIELD</InlineCode></TD><TD>Missing <InlineCode>file</InlineCode> field on upload</TD></tr>
                  <tr><TD>400</TD><TD><InlineCode>EMPTY_FILENAME</InlineCode></TD><TD>Uploaded file has empty filename</TD></tr>
                  <tr><TD>404</TD><TD><InlineCode>NOT_FOUND</InlineCode></TD><TD>Upload or template not found</TD></tr>
                  <tr><TD>413</TD><TD><InlineCode>FILE_TOO_LARGE</InlineCode></TD><TD>File exceeds 16 MB</TD></tr>
                  <tr><TD>415</TD><TD><InlineCode>INVALID_FILE_TYPE</InlineCode></TD><TD>Unsupported file type (only PDF accepted)</TD></tr>
                  <tr><TD>422</TD><TD><InlineCode>EMPTY_TEXT</InlineCode></TD><TD>Couldn&apos;t extract text (scanned or corrupt PDF)</TD></tr>
                  <tr><TD>422</TD><TD><InlineCode>AI_PARSE_FAILED</InlineCode></TD><TD>AI returned non-JSON response</TD></tr>
                  <tr><TD>500</TD><TD><InlineCode>SAVE_FAILED</InlineCode></TD><TD>Server couldn&apos;t save the file</TD></tr>
                </tbody>
              </Table>

              <SubTitle>Defensive client handling</SubTitle>
              <CodeBlock>{`async function safeFetch(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    let body;
    try { body = await res.json(); } catch { body = {}; }
    const code = body.error_code || res.status;
    const message = body.message || res.statusText;
    throw new Error(\`[\${code}] \${message}\`);
  }
  return res.json();
}`}</CodeBlock>
            </section>

            {/* Client Examples */}
            <section id="client-examples" className="scroll-mt-20">
              <SectionTitle id="client-examples-h">
                15. Client Examples — Complete Flow
              </SectionTitle>
              <p className="text-slate-700">
                Full pipeline: upload PDF → get parsed data → render with
                template → fetch ATS feedback.
              </p>

              <SubTitle>React (Web) — Full Builder + ATS</SubTitle>
              <CodeBlock>{`"use client";
import { useState, useEffect } from "react";

const API = "";  // same-origin

export default function ResumeApp() {
  const [templates, setTemplates] = useState([]);
  const [uploadId, setUploadId] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [selected, setSelected] = useState(1);
  const [html, setHtml] = useState("");
  const [ats, setAts] = useState(null);

  // 1) Load templates on mount
  useEffect(() => {
    fetch(\`\${API}/api/templates\`)
      .then((r) => r.json())
      .then((j) => setTemplates(j.data.templates));
  }, []);

  // 2) Handle PDF upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(\`\${API}/api/upload-resume\`, {
      method: "POST",
      body: form,
    });
    const j = await res.json();

    if (j.status !== 200) {
      alert(j.message);
      return;
    }
    setUploadId(j.upload_id);
    setParsed(j.data);
    setAts(j.ats_scores);  // initial rule-based scores
  };

  // 3) Re-render whenever template or data changes
  useEffect(() => {
    if (!parsed) return;
    fetch(\`\${API}/api/templates/\${selected}/html\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    })
      .then((r) => r.text())
      .then(setHtml);
  }, [selected, parsed]);

  // 4) Get full AI feedback on demand
  const runAtsAnalysis = async () => {
    const res = await fetch(\`\${API}/api/ats-analyze\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upload_id: uploadId }),
    });
    setAts(await res.json());
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
      <aside>
        <input type="file" accept=".pdf" onChange={handleUpload} />
        <button onClick={runAtsAnalysis} disabled={!uploadId}>
          Run ATS Analysis
        </button>

        <h3>Pick a template</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {templates.map((t) => (
            <button key={t.id} onClick={() => setSelected(t.id)}>
              <img src={t.thumbnail} alt={t.name} style={{ width: "100%" }} />
              <div>{t.name}</div>
            </button>
          ))}
        </div>

        {ats?.rule_based && (
          <div>
            <h4>ATS score: {ats.rule_based.overall_score}/100</h4>
            <ul>
              {ats.rule_based.feedback.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}
      </aside>

      <iframe srcDoc={html} style={{ width: "100%", height: "100vh", border: 0 }} />
    </div>
  );
}`}</CodeBlock>

              <SubTitle>React Native — Full Flow</SubTitle>
              <CodeBlock>{`import React, { useState, useEffect } from "react";
import { View, FlatList, Image, TouchableOpacity, Text, ScrollView } from "react-native";
import { WebView } from "react-native-webview";
import * as DocumentPicker from "expo-document-picker";

const API = "http://192.168.1.10:3000";

export default function ResumeScreen() {
  const [templates, setTemplates] = useState([]);
  const [uploadId, setUploadId] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [selected, setSelected] = useState(null);
  const [ats, setAts] = useState(null);

  // 1) Load templates
  useEffect(() => {
    fetch(\`\${API}/api/templates\`)
      .then((r) => r.json())
      .then((j) => setTemplates(j.data.templates));
  }, []);

  // 2) Pick + upload PDF
  const pickAndUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (res.canceled) return;
    const file = res.assets[0];

    const form = new FormData();
    form.append("file", { uri: file.uri, name: file.name, type: "application/pdf" });

    const r = await fetch(\`\${API}/api/upload-resume\`, {
      method: "POST",
      body: form,
      headers: { "Content-Type": "multipart/form-data" },
    });
    const j = await r.json();
    setUploadId(j.upload_id);
    setParsed(j.data);
    setAts(j.ats_scores);
  };

  // 3) Run full AI ATS analysis
  const runAts = async () => {
    const r = await fetch(\`\${API}/api/ats-analyze\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upload_id: uploadId }),
    });
    setAts(await r.json());
  };

  // 4) Render template in a WebView
  if (selected && uploadId) {
    return (
      <WebView
        source={{ uri: \`\${API}/api/templates/\${selected}/preview?upload_id=\${uploadId}\` }}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <TouchableOpacity onPress={pickAndUpload}>
        <Text>Upload Resume PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={runAts} disabled={!uploadId}>
        <Text>Run ATS Analysis</Text>
      </TouchableOpacity>

      {ats?.rule_based && (
        <View>
          <Text>Score: {ats.rule_based.overall_score}/100</Text>
        </View>
      )}

      <FlatList
        data={templates}
        numColumns={2}
        keyExtractor={(t) => String(t.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelected(item.id)}>
            <Image source={{ uri: item.thumbnail }} style={{ width: 150, height: 200 }} />
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}`}</CodeBlock>

              <SubTitle>One-shot pipeline (Node / browser)</SubTitle>
              <CodeBlock>{`// File in → parsed JSON + rendered HTML + ATS feedback out
async function runFullPipeline(file, templateId = 1) {
  // 1. Upload
  const form = new FormData();
  form.append("file", file);
  const upload = await fetch("/api/upload-resume", { method: "POST", body: form }).then(r => r.json());

  // 2. Render + ATS in parallel
  const [html, ats] = await Promise.all([
    fetch(\`/api/templates/\${templateId}/html\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upload.data),
    }).then((r) => r.text()),
    fetch("/api/ats-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upload_id: upload.upload_id }),
    }).then((r) => r.json()),
  ]);

  return { upload_id: upload.upload_id, data: upload.data, html, ats };
}`}</CodeBlock>
            </section>

            {/* Cheatsheet */}
            <section id="cheatsheet" className="scroll-mt-20">
              <SectionTitle id="cheatsheet-h">16. API Cheatsheet</SectionTitle>
              <Table>
                <thead>
                  <tr><TH>Method</TH><TH>Path</TH><TH>Description</TH></tr>
                </thead>
                <tbody>
                  <tr>
                    <TD><MethodBadge method="POST" /></TD>
                    <TD><InlineCode>/api/upload-resume</InlineCode></TD>
                    <TD>Upload PDF → parsed JSON Resume + ATS scores + upload_id</TD>
                  </tr>
                  <tr>
                    <TD><MethodBadge method="GET" /></TD>
                    <TD><InlineCode>/api/resume/{`{upload_id}`}</InlineCode></TD>
                    <TD>Retrieve stored parsed resume</TD>
                  </tr>
                  <tr>
                    <TD><MethodBadge method="GET" /></TD>
                    <TD><InlineCode>/api/jsonresume/{`{upload_id}`}</InlineCode></TD>
                    <TD>Same as above, with explicit JSON Resume envelope</TD>
                  </tr>
                  <tr>
                    <TD><MethodBadge method="GET" /></TD>
                    <TD><InlineCode>/api/schema</InlineCode></TD>
                    <TD>JSON Resume schema reference</TD>
                  </tr>
                  <tr>
                    <TD><MethodBadge method="GET" /></TD>
                    <TD><InlineCode>/api/templates</InlineCode></TD>
                    <TD>List all 62 templates (filter + paginate)</TD>
                  </tr>
                  <tr>
                    <TD><MethodBadge method="GET" /></TD>
                    <TD><InlineCode>/api/templates/{`{id}`}</InlineCode></TD>
                    <TD>Single template details</TD>
                  </tr>
                  <tr>
                    <TD><MethodBadge method="GET" /></TD>
                    <TD><InlineCode>/api/templates/categories</InlineCode></TD>
                    <TD>Category counts</TD>
                  </tr>
                  <tr>
                    <TD><MethodBadge method="POST" /></TD>
                    <TD><InlineCode>/api/templates/{`{id}`}/html</InlineCode></TD>
                    <TD><strong>Live preview</strong> (JSON Resume → raw HTML)</TD>
                  </tr>
                  <tr>
                    <TD><MethodBadge method="POST" /></TD>
                    <TD><InlineCode>/api/templates/{`{id}`}/render</InlineCode></TD>
                    <TD>Render template (HTML inside JSON envelope)</TD>
                  </tr>
                  <tr>
                    <TD><MethodBadge method="GET" /></TD>
                    <TD><InlineCode>/api/templates/{`{id}`}/preview</InlineCode></TD>
                    <TD>Preview saved resume (by upload_id)</TD>
                  </tr>
                  <tr>
                    <TD><MethodBadge method="POST" /></TD>
                    <TD><InlineCode>/api/ats-analyze</InlineCode></TD>
                    <TD>Rule-based + AI ATS feedback</TD>
                  </tr>
                </tbody>
              </Table>

              <Callout variant="success" title="You&apos;re ready to integrate.">
                A mobile or web dev can hook up the full pipeline in under 30
                minutes. Every endpoint speaks the same JSON Resume shape end
                to end — parse, render, analyze.
              </Callout>
            </section>

            <div className="h-24" />
          </main>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
