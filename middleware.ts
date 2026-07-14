/**
 * The user-facing pages (/dashboard, /builder, /ats) are now public and use
 * localStorage for state — no auth required. This middleware is intentionally
 * a no-op; left in place so the file's presence doesn't surprise anyone.
 */
export default function middleware() {
  // No auth gating — all UI pages are public.
}

export const config = {
  matcher: [],
};
