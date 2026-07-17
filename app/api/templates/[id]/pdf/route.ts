import { NextRequest, NextResponse } from "next/server";
import { getTemplate, getTemplateFile } from "@/lib/templates-registry";
import { renderTemplate } from "@/lib/render";
import { resolveResumeDataForRender } from "@/lib/resolve-render-data";
import { plainErrorEnvelope } from "@/lib/envelope";
import { corsPreflight, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/templates/[id]/pdf
 *
 * Renders the template with the provided resume data and returns a PDF file.
 * Accepts the same body shapes as /render:
 *   { resume: { ...JSON Resume... } }
 *   { resume_data: { ...JSON Resume... } }
 *   { data: { ...JSON Resume... } }
 *   { upload_id: "<mongo _id>" }
 *   { basics: {...}, ... }  (top-level JSON Resume)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (!Number.isFinite(id)) {
    return plainErrorEnvelope(404, "Not Found", "Template not found");
  }

  const tpl = getTemplate(id);
  const tplFile = getTemplateFile(id);
  if (!tpl || !tplFile) {
    return plainErrorEnvelope(404, "Not Found", "Template not found");
  }

  const body = await request.json().catch(() => ({}));
  const resolved = await resolveResumeDataForRender(body);
  if (!resolved.ok) {
    return plainErrorEnvelope(resolved.status, resolved.statusText, resolved.message);
  }

  let html: string;
  try {
    html = renderTemplate(tplFile, resolved.data);
  } catch (e: any) {
    return plainErrorEnvelope(
      500,
      "Internal Server Error",
      `Render error: ${String(e?.message ?? e)}`
    );
  }

  try {
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${tpl.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return plainErrorEnvelope(
      500,
      "Internal Server Error",
      `PDF generation failed: ${String(e?.message ?? e)}`
    );
  }
}

export async function OPTIONS() {
  return corsPreflight();
}
