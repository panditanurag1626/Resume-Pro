/**
 * Resolve a JSON Resume payload from a flexible request body.
 *
 * Supports the same shapes that the Flask `_get_resume_data_for_render`
 * accepted:
 *   { resume_data: {...} }   — direct JSON Resume or Python-grouped
 *   { data: {...} }          — same
 *   { upload_id: "..." }     — fetch a stored upload from MongoDB
 *   { basics: {...}, ... }   — already a JSON Resume payload
 *   { personal_information: {...}, ... } — Python-grouped (passed through)
 */

import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Resume from "@/models/Resume";

export type ResolveResult =
  | { ok: true; data: any }
  | { ok: false; status: number; statusText: string; message: string };

export async function resolveResumeDataForRender(
  body: any
): Promise<ResolveResult> {
  if (!body || typeof body !== "object") {
    return {
      ok: false,
      status: 400,
      statusText: "Bad Request",
      message:
        "Provide resume data in body (resume_data / data / upload_id / JSON Resume).",
    };
  }

  if (body.resume_data && typeof body.resume_data === "object") {
    return { ok: true, data: body.resume_data };
  }

  if (body.data && typeof body.data === "object") {
    return { ok: true, data: body.data };
  }

  if (body.resume && typeof body.resume === "object") {
    return { ok: true, data: body.resume };
  }

  if (body.upload_id !== undefined && body.upload_id !== null) {
    const id = String(body.upload_id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        ok: false,
        status: 404,
        statusText: "Not Found",
        message: "Upload not found",
      };
    }
    try {
      await dbConnect();
      const doc: any = await Resume.findById(id).lean();
      if (!doc) {
        return {
          ok: false,
          status: 404,
          statusText: "Not Found",
          message: "Upload not found",
        };
      }
      if (!doc.data || typeof doc.data !== "object") {
        return {
          ok: false,
          status: 422,
          statusText: "Unprocessable Entity",
          message: "Stored resume data could not be parsed",
        };
      }
      return { ok: true, data: doc.data };
    } catch (e: any) {
      return {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        message: `Database error: ${String(e?.message ?? e)}`,
      };
    }
  }

  // Treat the whole body as the resume payload (JSON Resume or Python-grouped).
  if (body.basics || body.work || body.personal_information || body.work_experience) {
    return { ok: true, data: body };
  }

  return {
    ok: false,
    status: 400,
    statusText: "Bad Request",
    message:
      "Provide resume data in body (resume_data / data / upload_id / JSON Resume).",
  };
}
