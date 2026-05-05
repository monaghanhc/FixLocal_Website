import type { Report, StatusHistory, SuggestedContact } from "@prisma/client";

export type ContactDTO = {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  website: string;
  reason: string;
  createdAt: string;
};

export type StatusHistoryDTO = {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
};

export type ReportDTO = {
  id: string;
  title: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dateObserved: string;
  urgent: boolean;
  optionalNotes: string | null;
  imagePath: string | null;
  status: string;
  severity: string;
  detectedIssueType: string | null;
  confidenceScore: number | null;
  suggestedResponsibleParty: string | null;
  missingDetails: string[];
  formalEmail: string | null;
  smsMessage: string | null;
  printableReport: string | null;
  followUpMessage: string | null;
  createdAt: string;
  updatedAt: string;
  contacts: ContactDTO[];
  statusHistory: StatusHistoryDTO[];
};

type ReportWithRelations = Report & {
  contacts?: SuggestedContact[];
  statusHistory?: StatusHistory[];
};

function missingDetails(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export function toReportDTO(report: ReportWithRelations): ReportDTO {
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    category: report.category,
    address: report.address,
    city: report.city,
    state: report.state,
    zip: report.zip,
    dateObserved: report.dateObserved.toISOString(),
    urgent: report.urgent,
    optionalNotes: report.optionalNotes,
    imagePath: report.imagePath,
    status: report.status,
    severity: report.severity,
    detectedIssueType: report.detectedIssueType,
    confidenceScore: report.confidenceScore,
    suggestedResponsibleParty: report.suggestedResponsibleParty,
    missingDetails: missingDetails(report.missingDetails),
    formalEmail: report.formalEmail,
    smsMessage: report.smsMessage,
    printableReport: report.printableReport,
    followUpMessage: report.followUpMessage,
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
    contacts:
      report.contacts?.map((contact) => ({
        id: contact.id,
        name: contact.name,
        type: contact.type,
        email: contact.email,
        phone: contact.phone,
        website: contact.website,
        reason: contact.reason,
        createdAt: contact.createdAt.toISOString()
      })) ?? [],
    statusHistory:
      report.statusHistory?.map((entry) => ({
        id: entry.id,
        status: entry.status,
        note: entry.note,
        createdAt: entry.createdAt.toISOString()
      })) ?? []
  };
}
