import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { calculateAtsScores } from "@/lib/ats";
import { errorEnvelope } from "@/lib/envelope";
import { corsPreflight, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";

/**
 * GET /api/resume/[upload_id]
 *
 * Port of `api_get_resume` in main.py — fetches a previously parsed resume
 * by its Mongo `_id` and returns the same envelope as the upload endpoint.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { upload_id: string } }
) {
  const { upload_id } = params;

  if (!mongoose.Types.ObjectId.isValid(upload_id)) {
    return errorEnvelope(404, "Not Found", "Upload not found", "NOT_FOUND");
  }

  let doc: any = null;
  try {
    await dbConnect();
    doc = await Resume.findById(upload_id).lean();
  } catch (e: any) {
    return errorEnvelope(
      500,
      "Internal Server Error",
      `Database error: ${String(e?.message ?? e)}`,
      "DB_ERROR"
    );
  }

  if (!doc) {
    return errorEnvelope(404, "Not Found", "Upload not found", "NOT_FOUND");
  }

  const jrData = doc.data ?? null;
  const atsScores = jrData ? calculateAtsScores(jrData) : null;

  return withCors(
    NextResponse.json(
      {
        status: 200,
        statusText: "OK",
        message: "Resume fetched successfully",
        upload_id: String(doc._id),
        resume_file: doc.filename ?? doc.title ?? null,
        schema: "jsonresume",
        data: jrData,
        ats_scores: atsScores,
      },
      { status: 200 }
    )
  );
}

export async function OPTIONS() {
  return corsPreflight();
}
