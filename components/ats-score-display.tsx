"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Lightbulb,
  Target,
  ShieldAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface AtsAnalysis {
  missing?: string[];
  weakAreas?: { area: string; reason?: string; suggestion?: string }[];
  keywordSuggestions?: string[];
  actionVerbUpgrades?: { from: string; to: string }[];
  summaryRewrite?: string;
  strengths?: string[];
  riskFlags?: string[];
  recommendation?: string;
}

export interface AtsScoreDisplayProps {
  score: number;
  breakdown: Record<string, number>;
  feedback?: string[];
  aiAnalysis?: AtsAnalysis | null;
  className?: string;
}

const SIZE = 200;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

function prettyLabel(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function ScoreGauge({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const offset = CIRC - (clamped / 100) * CIRC;
  const color =
    clamped >= 80 ? "#16a34a" : clamped >= 60 ? "#7c3aed" : "#f59e0b";

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#e2e8f0"
          strokeWidth={STROKE}
          fill="none"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-slate-900">{clamped}</span>
        <span className="text-sm text-slate-500">/100</span>
      </div>
    </div>
  );
}

function BreakdownBars({ breakdown }: { breakdown: Record<string, number> }) {
  const entries = Object.entries(breakdown);
  if (entries.length === 0) return null;
  return (
    <div className="space-y-3">
      {entries.map(([key, value]) => {
        const v = Math.max(0, Math.min(100, value));
        return (
          <div key={key} className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-4 sm:col-span-3 text-sm text-slate-700">
              {prettyLabel(key)}
            </div>
            <div className="col-span-6 sm:col-span-7">
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-600 transition-[width] duration-500"
                  style={{ width: `${v}%` }}
                />
              </div>
            </div>
            <div className="col-span-2 text-right text-sm font-medium text-slate-900 tabular-nums">
              {Math.round(value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* ignore */
        }
      }}
    >
      {copied ? (
        <>
          <Check className="mr-1.5 h-3.5 w-3.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          Copy
        </>
      )}
    </Button>
  );
}

export function AtsScoreDisplay({
  score,
  breakdown,
  feedback,
  aiAnalysis,
  className,
}: AtsScoreDisplayProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-8 md:flex-row md:items-start md:justify-around">
          <ScoreGauge score={score} />
          <div className="flex-1 w-full md:max-w-md">
            <h2 className="text-lg font-semibold text-slate-900">
              Breakdown
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              How your resume scores across the major ATS factors.
            </p>
            <div className="mt-4">
              <BreakdownBars breakdown={breakdown} />
            </div>
          </div>
        </CardContent>
      </Card>

      {feedback && feedback.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-brand-600" />
              Quick Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.map((line, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {aiAnalysis ? (
        <div className="space-y-6">
          {aiAnalysis.missing && aiAnalysis.missing.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-brand-600" />
                  Missing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.missing.map((m) => (
                    <Badge key={m} variant="brand">
                      {m}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {aiAnalysis.weakAreas && aiAnalysis.weakAreas.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Weak Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {aiAnalysis.weakAreas.map((w, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <p className="text-sm font-medium text-slate-900">
                        {w.area}
                      </p>
                      {w.reason ? (
                        <p className="mt-1 text-xs text-slate-600">{w.reason}</p>
                      ) : null}
                      {w.suggestion ? (
                        <p className="mt-2 text-xs text-brand-700">
                          {w.suggestion}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {aiAnalysis.keywordSuggestions &&
          aiAnalysis.keywordSuggestions.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-600" />
                  Keyword Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.keywordSuggestions.map((k) => (
                    <Badge key={k} variant="default">
                      {k}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {aiAnalysis.actionVerbUpgrades &&
          aiAnalysis.actionVerbUpgrades.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Action Verb Upgrades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {aiAnalysis.actionVerbUpgrades.map((u, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2"
                    >
                      <span className="text-sm text-slate-500 line-through">
                        {u.from}
                      </span>
                      <span className="text-slate-400">&rarr;</span>
                      <span className="text-sm font-medium text-brand-700">
                        {u.to}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {aiAnalysis.summaryRewrite ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Summary Rewrite</span>
                  <CopyButton text={aiAnalysis.summaryRewrite} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 whitespace-pre-line">
                  {aiAnalysis.summaryRewrite}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {aiAnalysis.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="flex gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {aiAnalysis.riskFlags && aiAnalysis.riskFlags.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-600" />
                  ATS Risk Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {aiAnalysis.riskFlags.map((f, i) => (
                    <li
                      key={i}
                      className="flex gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800"
                    >
                      <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {aiAnalysis.recommendation ? (
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-900">
                    Overall Recommendation
                  </p>
                  <p className="mt-1 text-sm text-brand-800 whitespace-pre-line">
                    {aiAnalysis.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default AtsScoreDisplay;
