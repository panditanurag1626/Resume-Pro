import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { getTemplateFile } from "@/lib/templates-registry";
import { renderTemplate } from "@/lib/render";
import { SAMPLE_RESUME } from "@/lib/sample-resume";
import { corsPreflight, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/templates/[id]/preview[?upload_id=...]
 *
 * Returns raw rendered HTML. When `upload_id` is supplied we fetch the
 * stored resume from MongoDB; otherwise we render with the canonical
 * SAMPLE_RESUME so cards and iframe previews always have something to show.
 *
 * Mirrors `api_preview_template` in main.py.
 */
export async function GET(
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

  const uploadId = request.nextUrl.searchParams.get("upload_id");

  let data: any = SAMPLE_RESUME;
  if (uploadId) {
    if (!mongoose.Types.ObjectId.isValid(uploadId)) {
      return withCors(new NextResponse("Upload not found", { status: 404 }));
    }
    try {
      await dbConnect();
      const doc: any = await Resume.findById(uploadId).lean();
      if (!doc) {
        return withCors(new NextResponse("Upload not found", { status: 404 }));
      }
      if (!doc.data || typeof doc.data !== "object") {
        return withCors(
          new NextResponse("Resume data could not be parsed", { status: 422 })
        );
      }
      data = doc.data;
    } catch (e: any) {
      return withCors(
        new NextResponse(
          `Database error: ${String(e?.message ?? e)}`,
          { status: 500 }
        )
      );
    }
  }

  try {
    const html = renderTemplate(tplFile, data);
    return withCors(
      new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": uploadId ? "no-store" : "public, max-age=3600",
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
