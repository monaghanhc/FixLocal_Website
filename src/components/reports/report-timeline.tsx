import { Clock3 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { StatusHistoryDTO } from "@/lib/report-dto";
import { formatDateTime } from "@/lib/utils";

export function ReportTimeline({ history }: { history: StatusHistoryDTO[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-civic-teal" />
        <h3 className="text-lg font-bold text-civic-ink">Timeline</h3>
      </div>
      <div className="mt-5 space-y-4">
        {history.map((entry) => (
          <div key={entry.id} className="border-l-2 border-slate-200 pl-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge value={entry.status} />
              <span className="text-xs font-medium text-slate-500">{formatDateTime(entry.createdAt)}</span>
            </div>
            {entry.note ? <p className="mt-2 text-sm text-slate-600">{entry.note}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
