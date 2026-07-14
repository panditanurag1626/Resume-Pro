import { NextRequest, NextResponse } from "next/server";
import { getTemplate, type TemplateMeta } from "@/lib/templates-registry";
import { plainErrorEnvelope } from "@/lib/envelope";
import { corsPreflight, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";

function withUrls(t: TemplateMeta, origin: string) {
  return {
    ...t,
    render_url: `${origin}/api/templates/${t.id}/render`,
    preview_url: `${origin}/api/templates/${t.id}/preview`,
  };
}

/**
 * GET /api/templates/[id]
 *
 * Port of `api_get_template` in main.py. Returns the template metadata with
 * absolute `render_url` and `preview_url` injected.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (!Number.isFinite(id)) {
    return plainErrorEnvelope(404, "Not Found", "Template not found");
  }

  const tpl = getTemplate(id);
  if (!tpl) {
    return plainErrorEnvelope(404, "Not Found", "Template not found");
  }

  return withCors(
    NextResponse.json(
      {
        status: 200,
        statusText: "OK",
        message: "Template fetched successfully",
        data: withUrls(tpl, request.nextUrl.origin),
      },
      { status: 200 }
    )
  );
}

export async function OPTIONS() {
  return corsPreflight();
}
