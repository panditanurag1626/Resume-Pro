"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface TemplateMeta {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  thumbnail?: string;
  category?: string;
}

export interface TemplateCardProps {
  template: TemplateMeta;
  onSelect?: () => void;
  className?: string;
}

export function TemplateCard({ template, onSelect, className }: TemplateCardProps) {
  const [iframeError, setIframeError] = useState(false);
  const previewSrc = `/api/templates/${template.id}/preview`;

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all hover:ring-2 hover:ring-brand-200",
        className
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100">
        {!iframeError ? (
          <iframe
            src={previewSrc}
            title={template.name}
            className="pointer-events-none h-full w-full origin-top-left scale-[0.6] border-0"
            style={{ width: "166.67%", height: "166.67%" }}
            onError={() => setIframeError(true)}
            sandbox="allow-same-origin allow-scripts"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300">
            <span className="text-2xl font-semibold text-brand-700">
              {template.name}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {template.name}
          </h3>
          {template.description ? (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
              {template.description}
            </p>
          ) : null}
        </div>

        {template.tags && template.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Link href={previewSrc} target="_blank" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Preview
            </Button>
          </Link>
          <Button
            size="sm"
            className="flex-1"
            onClick={onSelect}
          >
            Use
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TemplateCard;
