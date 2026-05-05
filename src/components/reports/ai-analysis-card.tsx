import { Bot, CheckCircle2, HelpCircle, ShieldAlert } from "lucide-react";
import type { AIAnalysis } from "@/lib/ai/types";
import { StatusBadge } from "@/components/ui/status-badge";

type AIAnalysisCardProps = {
  analysis: AIAnalysis;
};

export function AIAnalysisCard({ analysis }: AIAnalysisCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-civic-teal">
            <Bot className="h-4 w-4" />
            AI analysis
          </div>
          <h3 className="mt-2 text-xl font-bold text-civic-ink">{analysis.detectedIssueType}</h3>
          <p className="mt-1 text-sm text-slate-600">
            Suggested responsible party:{" "}
            <span className="font-semibold text-slate-800">{analysis.suggestedResponsibleParty}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge value={analysis.severity} type="severity" />
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {Math.round(analysis.confidenceScore * 100)}% confidence
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-civic-ink">
            <ShieldAlert className="h-4 w-4 text-civic-coral" />
            Severity estimate
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Based on category, urgency, keywords, and the available report details. This is a
            routing aid, not an official determination.
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-civic-ink">
            <HelpCircle className="h-4 w-4 text-civic-blue" />
            Details to consider adding
          </div>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {analysis.missingDetails.map((detail) => (
              <li key={detail} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-civic-teal" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
