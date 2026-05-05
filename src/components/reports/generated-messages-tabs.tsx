"use client";

import { useMemo, useState } from "react";
import { Mail, MessageSquare, Printer, RotateCcw } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import type { GeneratedMessages } from "@/lib/ai/types";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "formalEmail", label: "Email", icon: Mail },
  { key: "smsMessage", label: "SMS", icon: MessageSquare },
  { key: "printableReport", label: "Printable", icon: Printer },
  { key: "followUpMessage", label: "Follow-up", icon: RotateCcw }
] as const;

type GeneratedMessagesTabsProps = {
  messages: GeneratedMessages;
  subjectLine?: string;
  mailtoEmail?: string | null;
};

export function GeneratedMessagesTabs({
  messages,
  subjectLine,
  mailtoEmail
}: GeneratedMessagesTabsProps) {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("formalEmail");
  const activeText = messages[active] ?? "";
  const mailto = useMemo(() => {
    const email = mailtoEmail || "";
    const subject = encodeURIComponent(subjectLine || "Local issue report");
    const body = encodeURIComponent(messages.formalEmail);
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }, [mailtoEmail, messages.formalEmail, subjectLine]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Generated report</p>
          <h3 className="mt-1 text-xl font-bold text-civic-ink">Review-ready message drafts</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={activeText} />
          <a
            href={mailto}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-civic-blue px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Mail className="h-4 w-4" />
            Mailto
          </a>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                "focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
                active === tab.key
                  ? "bg-civic-ink text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <pre className="mt-5 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        {activeText}
      </pre>
    </div>
  );
}
