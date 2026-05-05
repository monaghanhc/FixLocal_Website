"use client";

import Link from "next/link";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ReportCard } from "@/components/reports/report-card";
import type { ReportDTO } from "@/lib/report-dto";

export function DashboardClient({ initialReports }: { initialReports: ReportDTO[] }) {
  const reports = initialReports;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Dashboard</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-civic-ink">Saved reports</h1>
          <p className="mt-2 text-slate-600">
            Track status, reopen messages, copy drafts, and keep resolution notes in one place.
          </p>
        </div>
        <Link
          href="/create"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-civic-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" />
          New report
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="mt-8">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DashboardReports initialReports={reports} />
        </div>
      )}
    </div>
  );
}

function DashboardReports({ initialReports }: { initialReports: ReportDTO[] }) {
  const [reports, setReports] = useState(initialReports);

  return (
    <>
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          onUpdated={(updated) =>
            setReports(reports.map((current) => (current.id === updated.id ? updated : current)))
          }
          onDeleted={(id) => setReports(reports.filter((current) => current.id !== id))}
        />
      ))}
    </>
  );
}
