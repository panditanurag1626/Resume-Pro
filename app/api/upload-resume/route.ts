import { NextRequest, NextResponse } from "next/server";
import { extractPdfText, extractDocxText, extractImageText, parseResumeText } from "@/lib/parser";
import { calculateAtsScores } from "@/lib/ats";
import { errorEnvelope } from "@/lib/envelope";
import { corsPreflight, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 16 * 1024 * 1024; // 16 MB — matches Flask MAX_CONTENT_LENGTH

/**
 * POST /api/upload-resume
 *
 * Stateless API: Accepts a PDF, DOCX, TXT, or Image (PNG, JPG) as
 * multipart/form-data field "file", parses it into JSON Resume format,
 * and returns the parsed data + ATS scores directly. No data is stored.
 */
export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorEnvelope(
      400,
      "Bad Request",
      "No file field in request. Send a supported document as multipart/form-data field 'file'.",
      "NO_FILE_FIELD"
    );
  }

  const fileEntry = form.get("file");
  if (!fileEntry) {
    return errorEnvelope(
      400,
      "Bad Request",
      "No file field in request. Send a supported document as multipart/form-data field 'file'.",
      "NO_FILE_FIELD"
    );
  }

  if (typeof fileEntry === "string") {
    return errorEnvelope(
      400,
      "Bad Request",
      "Empty filename. Please attach a valid resume file.",
      "EMPTY_FILENAME"
    );
  }

  const file = fileEntry as File;
  const filename = (file.name || "").trim();
  if (!filename) {
    return errorEnvelope(
      400,
      "Bad Request",
      "Empty filename. Please attach a valid resume file.",
      "EMPTY_FILENAME"
    );
  }

  const lower = filename.toLowerCase();
  const isPdf = lower.endsWith(".pdf");
  const isDocx = lower.endsWith(".docx");
  const isTxt = lower.endsWith(".txt");
  const isPng = lower.endsWith(".png");
  const isJpg = lower.endsWith(".jpg") || lower.endsWith(".jpeg");

  if (!isPdf && !isDocx && !isTxt && !isPng && !isJpg) {
    return errorEnvelope(
      415,
      "Unsupported Media Type",
      "Invalid file type. Only PDF, DOCX, TXT, PNG, and JPG/JPEG files are accepted.",
      "INVALID_FILE_TYPE"
    );
  }

  if (file.size > MAX_BYTES) {
    return errorEnvelope(
      413,
      "Payload Too Large",
      "File too large. Maximum size is 16MB.",
      "FILE_TOO_LARGE"
    );
  }

  let buffer: Buffer;
  try {
    const arr = await file.arrayBuffer();
    buffer = Buffer.from(arr);
  } catch (e: any) {
    return errorEnvelope(
      500,
      "Internal Server Error",
      `Failed to read uploaded file: ${String(e?.message ?? e)}`,
      "SAVE_FAILED"
    );
  }

  let extractedText = "";
  try {
    if (isPdf) {
      extractedText = await extractPdfText(buffer);
    } else if (isDocx) {
      extractedText = await extractDocxText(buffer);
    } else if (isTxt) {
      extractedText = buffer.toString("utf-8");
    } else if (isPng || isJpg) {
      extractedText = await extractImageText(buffer);
    }
  } catch (e: any) {
    return errorEnvelope(
      422,
      "Unprocessable Entity",
      `Could not extract text from file: ${String(e?.message ?? e)}`,
      "EMPTY_TEXT"
    );
  }

  if (!extractedText || !extractedText.trim()) {
    return errorEnvelope(
      422,
      "Unprocessable Entity",
      "Could not extract any text from the file. It may be a scanned image or corrupted.",
      "EMPTY_TEXT"
    );
  }

  const jrData = await parseResumeText(extractedText);
  if (!jrData || typeof jrData !== "object") {
    return errorEnvelope(
      422,
      "Unprocessable Entity",
      "Resume uploaded but AI parsing failed",
      "AI_PARSE_FAILED"
    );
  }

  const atsScores = calculateAtsScores(jrData);

  return withCors(
    NextResponse.json(
      {
        status: 200,
        statusText: "OK",
        message: "Resume parsed successfully",
        resume_file: filename,
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
