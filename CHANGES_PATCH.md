# Code Krafters Resume-API Changes Patch

This document contains the exact code changes made in this workspace so you can easily reference or apply them to your updated codebase.

---

## 1. Landing & Footer Copyright Updates

### [MODIFY] [components/site-footer.tsx](file:///Users/sonamjain/Downloads/Resume-api/components/site-footer.tsx)
Updated site-wide copyright text to include "Code Krafters".
```diff
-      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
-        © {year} ResumeUp.AI. All rights reserved.
-      </div>
+      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
+        © {year} Code Krafters & ResumeUp.AI. All rights reserved.
+      </div>
```

### [MODIFY] [app/page.tsx](file:///Users/sonamjain/Downloads/Resume-api/app/page.tsx)
Updated homepage landing footer copyright text.
```diff
-      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
-        © {year} ResumeUp.AI. All rights reserved.
-      </div>
+      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
+        © {year} Code Krafters & ResumeUp.AI. All rights reserved.
+      </div>
```

---

## 2. Multi-Format Upload Parsing Support

### [MODIFY] [app/api/upload-resume/route.ts](file:///Users/sonamjain/Downloads/Resume-api/app/api/upload-resume/route.ts)
Extended the file type checks to allow DOCX, TXT, PNG, JPG, and JPEG files, and routed them to the correct parser function.
```diff
-  if (file.type !== "application/pdf") {
-    return plainErrorEnvelope(400, "Bad Request", "Only PDF uploads are allowed");
-  }
+  const allowedTypes = [
+    "application/pdf",
+    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
+    "text/plain",
+    "image/png",
+    "image/jpeg",
+    "image/jpg"
+  ];
+  const extension = file.name.split(".").pop()?.toLowerCase();
+  const isAllowedExt = ["pdf", "docx", "txt", "png", "jpg", "jpeg"].includes(extension || "");
+
+  if (!allowedTypes.includes(file.type) && !isAllowedExt) {
+    return plainErrorEnvelope(400, "Bad Request", "Only PDF, DOCX, TXT, and Image (PNG/JPG) resume uploads are allowed");
+  }
```
And routed content extraction by type:
```typescript
  let extractedText = "";
  try {
    if (file.type === "application/pdf" || extension === "pdf") {
      extractedText = await extractPdfText(buffer);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || extension === "docx") {
      extractedText = await extractDocxText(buffer);
    } else if (file.type === "text/plain" || extension === "txt") {
      extractedText = buffer.toString("utf-8");
    } else if (file.type.startsWith("image/") || ["png", "jpg", "jpeg"].includes(extension || "")) {
      extractedText = await extractImageText(buffer);
    }
  } catch (err: any) { ... }
```

### [MODIFY] [lib/parser.ts](file:///Users/sonamjain/Downloads/Resume-api/lib/parser.ts)
Added Mammouth and Tesseract loaders for Docx and Image OCR text extraction:
```typescript
export async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function extractImageText(buffer: Buffer): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  const { data: { text } } = await worker.recognize(buffer);
  await worker.terminate();
  return text;
}
```

---

## 3. Template Loading Caching & Mount Fixes

### [MODIFY] [app/api/templates/route.ts](file:///Users/sonamjain/Downloads/Resume-api/app/api/templates/route.ts)
Added `Cache-Control` header to the list endpoint so the browser caches the templates list response.
```diff
-  return withCors(
-    NextResponse.json(
-      { ... },
-      { status: 200 }
-    )
-  );
+  const response = withCors(
+    NextResponse.json(
+      { ... },
+      { status: 200 }
+    )
+  );
+  response.headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
+  return response;
```

### [MODIFY] [app/builder/page.tsx](file:///Users/sonamjain/Downloads/Resume-api/app/builder/page.tsx)
- Added client-side in-memory caching to `TemplateModal` to fetch list only once:
```typescript
let templatesCache: any[] | null = null;
// inside TemplateModal component:
const [templates, setTemplates] = useState<any[]>(templatesCache || []);
// inside the useEffect:
if (templatesCache) {
  setTemplates(templatesCache);
  return;
}
// inside fetch callback:
templatesCache = d?.templates || [];
```
- Replaced the blank gray mockup cards in the modal with dynamic `iframe` templates preview:
```typescript
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                      <iframe
                        src={`/api/templates/${t.id}/preview`}
                        title={t.name || `Template ${t.id}`}
                        className="pointer-events-none absolute left-0 top-0 origin-top-left scale-[0.6] border-0"
                        style={{ width: "166.67%", height: "166.67%" }}
                        sandbox="allow-same-origin"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-transparent" />
                    </div>
```
- Fixed the mount race condition by adding `isLoaded` state and rendering the loaded preview on initial mount. Guarded `templateId` changes with `isLoaded`.

---

## 4. AI Career Roadmap and Speed Optimization

### [MODIFY] [lib/ai.ts](file:///Users/sonamjain/Downloads/Resume-api/lib/ai.ts)
Extended the system prompt and fallback to support `"career_upgrades"` array:
```typescript
  "career_upgrades": [
    { "target_role": string, "market_demand": "High" | "Very High", "estimated_salary_boost": string, "recommended_skills": [string, ...] }
  ]
```

### [MODIFY] [app/ats/analyzer.tsx](file:///Users/sonamjain/Downloads/Resume-api/app/ats/analyzer.tsx)
- Integrated the **AI Career Progression Hub** UI block, rendering upgrades and recommended skills.
- Implemented **Two-Stage Analysis (Speed optimization)**:
  1. Instantly triggers rule-based calculations on mount and disables main loading spinner.
  2. Spawns background LLM analysis and displays a pulsing **AI Insights Loading...** skeleton screen.
- Implemented a client-side hashing **"bubble memory"** cache for AI results:
```typescript
function getResumeHash(data: any): string {
  const str = JSON.stringify(data || {});
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return "ats_ai_cache_" + Math.abs(hash);
}
```
Checks this hash in `localStorage` before hitting the backend LLM API to get instant (under 500ms) loads for previously analyzed resumes.
