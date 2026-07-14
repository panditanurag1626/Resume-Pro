import { NextRequest, NextResponse } from "next/server";
import { getTemplateFile } from "@/lib/templates-registry";
import { renderTemplate } from "@/lib/render";
import { resolveResumeDataForRender } from "@/lib/resolve-render-data";
import { corsPreflight, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/templates/[id]/html
 *
 * LIVE PREVIEW — returns raw rendered HTML (not JSON). Use this for
 * iframe `srcDoc` previews while the user is editing the form.
 *
 * Accepts the same body shapes as /render: resume_data, data, upload_id,
 * or a JSON Resume payload at the top level. Mirrors
 * `api_get_template_html` in main.py.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (!Number.isFinite(id)) {
    return withCors(new NextResponse("Template not found", { status: 404 }));
  }

  const tplFile = getTemplateFile(id);
  if (!tplFile) {
    return withCors(new NextResponse("Template not found", { status: 404 }));
  }

  const body = await request.json().catch(() => ({}));
  const resolved = await resolveResumeDataForRender(body);
  if (!resolved.ok) {
    return withCors(
      new NextResponse(resolved.message, { status: resolved.status })
    );
  }

  try {
    const html = renderTemplate(tplFile, resolved.data);
    return withCors(
      new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      })
    );
  } catch (e: any) {
    return withCors(
      new NextResponse(
        `Render error: ${String(e?.message ?? e)}`,
        { status: 500 }
      )
    );
  }
}

export async function OPTIONS() {
  return corsPreflight();
}
