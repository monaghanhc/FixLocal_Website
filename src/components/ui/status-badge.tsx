import { cn, statusLabel } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-200",
  SUBMITTED: "bg-blue-50 text-blue-700 ring-blue-200",
  WAITING_RESPONSE: "bg-amber-50 text-amber-800 ring-amber-200",
  NEEDS_FOLLOW_UP: "bg-orange-50 text-orange-800 ring-orange-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CLOSED: "bg-zinc-100 text-zinc-700 ring-zinc-200"
};

const severityClasses: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700 ring-slate-200",
  MEDIUM: "bg-sky-50 text-sky-700 ring-sky-200",
  HIGH: "bg-orange-50 text-orange-800 ring-orange-200",
  URGENT: "bg-red-50 text-red-700 ring-red-200"
};

export function StatusBadge({ value, type = "status" }: { value: string; type?: "status" | "severity" }) {
  const classes = type === "severity" ? severityClasses[value] : statusClasses[value];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        classes ?? "bg-slate-100 text-slate-700 ring-slate-200"
      )}
    >
      {statusLabel(value)}
    </span>
  );
}
