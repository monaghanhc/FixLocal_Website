"use client";

import { jsPDF } from "jspdf";
import { Download } from "lucide-react";
import { toast } from "sonner";
import type { AIAnalysis, GeneratedMessages } from "@/lib/ai/types";
import type { SuggestedContactDTO } from "@/lib/contacts/directory";

export type PDFReportData = {
  title: string;
  category: string;
  location: string;
  dateObserved: string;
  description: string;
  optionalNotes?: string | null;
  analysis: AIAnalysis;
  contacts: SuggestedContactDTO[];
  messages: GeneratedMessages;
};

function addWrapped(doc: jsPDF, text: string, x: number, y: number, width: number) {
  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y);
  return y + lines.length * 6;
}

export function PDFDownloadButton({ data }: { data: PDFReportData }) {
  function download() {
    try {
      const doc = new jsPDF({ unit: "mm", format: "letter" });
      const margin = 18;
      const width = 180;
      let y = 18;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      y = addWrapped(doc, data.title, margin, y, width) + 3;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y = addWrapped(doc, `Category: ${data.category}`, margin, y, width);
      y = addWrapped(doc, `Location: ${data.location}`, margin, y, width);
      y = addWrapped(doc, `Date observed: ${data.dateObserved}`, margin, y, width);
      y = addWrapped(doc, `Severity: ${data.analysis.severity}`, margin, y, width) + 4;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Description", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y = addWrapped(doc, data.description, margin, y, width) + 5;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("AI analysis", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y = addWrapped(
        doc,
        `${data.analysis.detectedIssueType}. Suggested responsible party: ${data.analysis.suggestedResponsibleParty}. Confidence: ${Math.round(
          data.analysis.confidenceScore * 100
        )}%. Missing details to consider: ${data.analysis.missingDetails.join(", ") || "None listed"}.`,
        margin,
        y,
        width
      ) + 5;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Suggested contacts", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      data.contacts.forEach((contact) => {
        y = addWrapped(
          doc,
          `${contact.name} (${contact.type}) - Email: ${contact.email || "verify from official source"}, Phone: ${contact.phone || "verify from official source"}. ${contact.reason}`,
          margin,
          y,
          width
        ) + 2;
      });

      y += 4;
      if (y > 230) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Formal report text", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      addWrapped(doc, data.messages.formalEmail, margin, y, width);

      doc.save(`${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "fixlocal-report"}.pdf`);
      toast.success("PDF generated.");
    } catch {
      toast.error("PDF generation failed.");
    }
  }

  return (
    <button
      type="button"
      onClick={download}
      className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-civic-ink px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </button>
  );
}
