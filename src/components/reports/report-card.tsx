"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CopyButton } from "@/components/ui/copy-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { reportStatuses } from "@/lib/constants";
import type { ReportDTO } from "@/lib/report-dto";
import { formatDate, statusLabel } from "@/lib/utils";

type ReportCardProps = {
  report: ReportDTO;
  onUpdated: (report: ReportDTO) => void;
  onDeleted: (id: string) => void;
};

export function ReportCard({ report, onUpdated, onDeleted }: ReportCardProps) {
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: `Dashboard status changed to ${statusLabel(status)}.` })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update status.");
      onUpdated(data.report);
      toast.success("Status updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update status.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteReport() {
    if (!window.confirm("Delete this report? This cannot be undone.")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/${report.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete report.");
      onDeleted(report.id);
      toast.success("Report deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      <Link href={`/reports/${report.id}`} className="block">
        <div className="h-40 bg-slate-100">
          {report.imagePath ? (
            <img src={report.imagePath} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-sm font-semibold text-slate-400">
              No image
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <StatusBadge value={report.status} />
          <StatusBadge value={report.severity} type="severity" />
        </div>
        <Link href={`/reports/${report.id}`}>
          <h3 className="mt-4 line-clamp-2 text-lg font-bold text-civic-ink hover:text-civic-blue">
            {report.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-slate-600">
          {report.category} at {report.address}, {report.city}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">Created</span>
            <p>{formatDate(report.createdAt)}</p>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Updated</span>
            <p>{formatDate(report.updatedAt)}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          <select
            className="form-input"
            value={report.status}
            onChange={(event) => updateStatus(event.target.value)}
            disabled={loading}
          >
            {reportStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <CopyButton value={report.formalEmail || ""} label="Copy email" className="flex-1" />
            <button
              type="button"
              onClick={deleteReport}
              disabled={loading}
              className="focus-ring inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-50 disabled:opacity-60"
              aria-label="Delete report"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
