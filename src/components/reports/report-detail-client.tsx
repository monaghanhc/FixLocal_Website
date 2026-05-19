"use client";

import { useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AIAnalysisCard } from "@/components/reports/ai-analysis-card";
import { ContactSuggestions } from "@/components/reports/contact-suggestions";
import { GeneratedMessagesTabs } from "@/components/reports/generated-messages-tabs";
import { PDFDownloadButton } from "@/components/reports/pdf-download-button";
import { ReportTimeline } from "@/components/reports/report-timeline";
import { CopyButton } from "@/components/ui/copy-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { reportStatuses } from "@/lib/constants";
import type { ReportDTO } from "@/lib/report-dto";
import { formatDate, statusLabel } from "@/lib/utils";

export function ReportDetailClient({ initialReport }: { initialReport: ReportDTO }) {
  const [report, setReport] = useState(initialReport);
  const [status, setStatus] = useState(initialReport.status);
  const [note, setNote] = useState("");
  const [optionalNotes, setOptionalNotes] = useState(initialReport.optionalNotes ?? "");
  const [saving, setSaving] = useState(false);

  const messages = useMemo(
    () => ({
      subjectLine: `Request for action: ${report.title}`,
      formalEmail: report.formalEmail ?? "",
      smsMessage: report.smsMessage ?? "",
      printableReport: report.printableReport ?? "",
      followUpMessage: report.followUpMessage ?? ""
    }),
    [
      report.followUpMessage,
      report.formalEmail,
      report.printableReport,
      report.smsMessage,
      report.title
    ]
  );

  const analysis = useMemo(
    () => ({
      detectedIssueType: report.detectedIssueType ?? report.category,
      severity: report.severity as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      confidenceScore: report.confidenceScore ?? 0,
      missingDetails: report.missingDetails,
      suggestedResponsibleParty: report.suggestedResponsibleParty ?? "Other"
    }),
    [
      report.category,
      report.confidenceScore,
      report.detectedIssueType,
      report.missingDetails,
      report.severity,
      report.suggestedResponsibleParty
    ]
  );

  const pdfData = useMemo(
    () => ({
      title: report.title,
      category: report.category,
      location: `${report.address}, ${report.city}, ${report.state} ${report.zip}`,
      dateObserved: formatDate(report.dateObserved),
      description: report.description,
      optionalNotes: report.optionalNotes,
      analysis,
      contacts: report.contacts,
      messages
    }),
    [analysis, messages, report]
  );

  const routingDecision = report.routingDecision
    ? {
        ...report.routingDecision,
        suggestedContacts: report.contacts
      }
    : null;

  async function saveUpdates() {
    setSaving(true);
    try {
      const response = await fetch(`/api/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          optionalNotes,
          note: note || "Report updated."
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update report.");
      setReport(data.report);
      setStatus(data.report.status);
      setOptionalNotes(data.report.optionalNotes ?? "");
      setNote("");
      toast.success("Report updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update report.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="min-w-0 space-y-6">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
          {report.imagePath ? (
            <img src={report.imagePath} alt={report.title} className="h-80 w-full object-cover" />
          ) : null}
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={report.status} />
              <StatusBadge value={report.severity} type="severity" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-normal text-civic-ink">{report.title}</h1>
            <p className="mt-2 text-slate-600">{report.description}</p>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <dt className="text-sm font-semibold text-slate-500">Category</dt>
                <dd className="mt-1 font-semibold text-civic-ink">{report.category}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <dt className="text-sm font-semibold text-slate-500">Date observed</dt>
                <dd className="mt-1 font-semibold text-civic-ink">{formatDate(report.dateObserved)}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 sm:col-span-2">
                <dt className="text-sm font-semibold text-slate-500">Location</dt>
                <dd className="mt-1 font-semibold text-civic-ink">
                  {report.address}, {report.city}, {report.state} {report.zip}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <AIAnalysisCard analysis={analysis} />
        <ContactSuggestions contacts={report.contacts} routingDecision={routingDecision} />
        <GeneratedMessagesTabs
          messages={messages}
          subjectLine={messages.subjectLine}
          mailtoEmail={report.contacts[0]?.email}
        />
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-lg font-bold text-civic-ink">Actions</h2>
          <div className="mt-4 grid gap-2">
            <CopyButton value={report.formalEmail ?? ""} label="Copy email" />
            <CopyButton value={report.smsMessage ?? ""} label="Copy SMS" />
            <PDFDownloadButton data={pdfData} />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-lg font-bold text-civic-ink">Status and notes</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select id="status" className="form-input" value={status} onChange={(event) => setStatus(event.target.value)}>
                {reportStatuses.map((statusValue) => (
                  <option key={statusValue} value={statusValue}>
                    {statusLabel(statusValue)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="form-label" htmlFor="statusNote">
                Status note
              </label>
              <input
                id="statusNote"
                className="form-input"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Called office, received ticket number, etc."
              />
            </div>
            <div className="grid gap-2">
              <label className="form-label" htmlFor="optionalNotes">
                Notes
              </label>
              <textarea
                id="optionalNotes"
                className="form-textarea"
                value={optionalNotes}
                onChange={(event) => setOptionalNotes(event.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={saveUpdates}
              disabled={saving}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-civic-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save updates
            </button>
          </div>
        </section>

        <ReportTimeline history={report.statusHistory} />
      </aside>
    </div>
  );
}
