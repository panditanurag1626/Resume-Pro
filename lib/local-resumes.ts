/**
 * Client-side localStorage manager for anonymous resumes.
 *
 * The user-facing pages (dashboard, builder, ATS) are public — no auth.
 * Resumes live in browser localStorage under a single JSON object keyed by id.
 *
 * All functions are SSR-safe: they short-circuit to a sensible default if
 * `window` is undefined (Next.js server render pass).
 */

export type LocalResume = {
  id: string; // UUID-like string
  title: string;
  templateId: number;
  data: any; // JSON Resume payload
  lastAtsScore?: number;
  updatedAt: string; // ISO timestamp
};

const STORAGE_KEY = "resumes_v1";

type Store = Record<string, LocalResume>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Store;
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Quota exceeded / disabled — swallow, the UI will surface inconsistency on next read.
  }
}

export function newResumeId(): string {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Fallback for SSR / older browsers
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2)
  );
}

export function listResumes(): LocalResume[] {
  if (typeof window === "undefined") return [];
  const store = readStore();
  return Object.values(store).sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0
  );
}

export function getResume(id: string): LocalResume | null {
  if (typeof window === "undefined") return null;
  if (!id) return null;
  const store = readStore();
  return store[id] || null;
}

export function saveResume(
  r: Partial<LocalResume> & { data: any }
): LocalResume {
  const now = new Date().toISOString();
  const id = r.id || newResumeId();

  const existing = typeof window !== "undefined" ? getResume(id) : null;

  const next: LocalResume = {
    id,
    title: r.title ?? existing?.title ?? "Untitled Resume",
    templateId: r.templateId ?? existing?.templateId ?? 1,
    data: r.data,
    lastAtsScore:
      r.lastAtsScore !== undefined ? r.lastAtsScore : existing?.lastAtsScore,
    updatedAt: now,
  };

  if (typeof window === "undefined") return next;

  const store = readStore();
  store[id] = next;
  writeStore(store);
  return next;
}

export function deleteResume(id: string): void {
  if (typeof window === "undefined") return;
  if (!id) return;
  const store = readStore();
  if (id in store) {
    delete store[id];
    writeStore(store);
  }
}
