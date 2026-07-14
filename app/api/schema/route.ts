import { NextResponse } from "next/server";
import { SAMPLE_RESUME } from "@/lib/sample-resume";
import { corsPreflight, withCors } from "@/lib/cors";

/**
 * GET /api/schema — returns JSON Resume schema metadata + a minimal example.
 * Mirrors `api_schema_info` in main.py.
 */
export async function GET() {
  return withCors(
    NextResponse.json(
      {
        status: 200,
        statusText: "OK",
        schema: "jsonresume v1.0.0",
        spec_url: "https://jsonresume.org/schema/",
        example: SAMPLE_RESUME,
      },
      { status: 200 }
    )
  );
}

export async function OPTIONS() {
  return corsPreflight();
}
