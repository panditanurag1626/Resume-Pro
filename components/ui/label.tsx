"use client";

import { cn } from "@/lib/utils";
import { LabelHTMLAttributes, forwardRef } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("text-sm font-medium text-slate-700", className)}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

export default Label;
