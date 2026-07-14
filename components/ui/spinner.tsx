"use client";

import { cn } from "@/lib/utils";
import { SVGAttributes } from "react";

export type SpinnerProps = SVGAttributes<SVGSVGElement>;

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <svg
      className={cn("animate-spin h-5 w-5 text-brand-600", className)}
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeDasharray="60"
        strokeDashoffset="0"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Spinner;
