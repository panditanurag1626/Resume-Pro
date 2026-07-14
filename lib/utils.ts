import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string ("YYYY-MM" or "YYYY-MM-DD") as "MMM YYYY".
 * Returns the original string if it doesn't match the expected shape,
 * and an empty string for null/undefined.
 */
export function formatDate(s?: string | null) {
  if (!s) return "";
  const m = /^(\d{4})-(\d{2})/.exec(s);
  if (!m) return s;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(m[2], 10) - 1]} ${m[1]}`;
}
