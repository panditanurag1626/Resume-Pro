/**
 * CORS helpers — the public API is anonymous and intended to be hit from
 * any origin (matches the Flask app's wide-open CORS behavior).
 */

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
};

export function withCors<R extends Response>(res: R): R {
  Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: corsHeaders });
}
