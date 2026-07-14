import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeWithAi } from "@/lib/ai";
import { resolveResumeDataForRender } from "@/lib/resolve-render-data";
import { plainErrorEnvelope } from "@/lib/envelope";
import { corsPreflight, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/ats-analyze
 *
 * 1:1 port of `api_ats_analyze` in main.py. Accepts:
 *   { resume: { ...JSON Resume... } }     // historical alias
 *   { resume_data: {...} } / { data: {...} }
 *   { upload_id: "<mongo _id>" }
 *
 * Returns rule-based scoring + AI feedback under `data` (with
 * `rule_based` and `ai_analysis` keys, matching the Flask shape).
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const resolved = await resolveResumeDataForRender(body);
  if (!resolved.ok) {
    return plainErrorEnvelope(
      resolved.status === 400 ? 400 : resolved.status,
      resolved.statusText,
      'Missing or invalid resume data. Send {"resume": {...JSON Resume...}} or {"upload_id": "..."}.'
    );
  }

  try {
    const result = await analyzeResumeWithAi(resolved.data);
    return withCors(
      NextResponse.json(
        {
          status: 200,
          statusText: "OK",
          message: "ATS analysis complete",
          data: result,
        },
        { status: 200 }
      )
    );
  } catch (e: any) {
    return plainErrorEnvelope(
      500,
      "Internal Server Error",
      `ATS analysis failed: ${String(e?.message ?? e)}`
    );
  }
}

export async function OPTIONS() {
  return corsPreflight();
}
