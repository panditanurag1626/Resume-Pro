/**
 * Response envelope helpers — mirrors the Flask helpers in main.py
 * (`_error_envelope`) so the Next.js port returns the same shape for every
 * route.
 */

import { NextResponse } from "next/server";
import { withCors } from "@/lib/cors";

export type ErrorEnvelope = {
  status: number;
  statusText: string;
  message: string;
  data: {
    data: {
      resume_file: string | null;
      resume_analysed: boolean;
      parsed_data: {
        status: "error";
        message: string;
        code: string;
        data: null;
      };
    };
  };
};

export function errorEnvelope(
  status: number,
  statusText: string,
  message: string,
  code: string
): NextResponse {
  const body: ErrorEnvelope = {
    status,
    statusText,
    message,
    data: {
      data: {
        resume_file: null,
        resume_analysed: false,
        parsed_data: {
          status: "error",
          message,
          code,
          data: null,
        },
      },
    },
  };
  return withCors(NextResponse.json(body, { status }));
}

/**
 * Simpler `{status, message, data}` envelope used by some routes (templates,
 * render, etc.) — matches the Flask 404/422 inline replies.
 */
export function plainErrorEnvelope(
  status: number,
  statusText: string,
  message: string
): NextResponse {
  return withCors(
    NextResponse.json({ status, statusText, message, data: null }, { status })
  );
}
