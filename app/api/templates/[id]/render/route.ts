import { NextRequest, NextResponse } from "next/server";
import { getTemplate, getTemplateFile } from "@/lib/templates-registry";
import { renderTemplate } from "@/lib/render";
import { resolveResumeDataForRender } from "@/lib/resolve-render-data";
import { plainErrorEnvelope } from "@/lib/envelope";
import { corsPreflight, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/templates/[id]/render
 *
 * Port of `api_render_template` in main.py. Accepts a JSON body with one of:
 *   { resume_data: { ...JSON Resume... } }
 *   { data:        { ...JSON Resume... } }
 *   { upload_id:   "<mongo _id>" }
 *   { ...JSON Resume payload at top level... }
 *
 * Returns `{ status, message, data: { template_id, template_name, html } }`.
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

  try {
    const html = renderTemplate(tplFile, resolved.data);
    return withCors(
      NextResponse.json(
        {
          status: 200,
          statusText: "OK",
          message: "Template rendered successfully",
          data: {
            template_id: id,
            template_name: tpl.name,
            html,
          },
        },
        { status: 200 }
      )
    );
  } catch (e: any) {
    return plainErrorEnvelope(
      500,
      "Internal Server Error",
      `Render error: ${String(e?.message ?? e)}`
    );
  }
}

export async function OPTIONS() {
  return corsPreflight();
}
