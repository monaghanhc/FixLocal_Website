import type { Report, RoutingDecision, StatusHistory, SuggestedContact } from "@prisma/client";
import type { RoutingConfidence } from "@/lib/contact-routing/types";

export type ContactDTO = {
  id: string;
  name: string;
  organization: string;
  department: string;
  type: string;
  email: string | null;
  phone: string | null;
  website: string;
  lookupUrl: string | null;
  source: string;
  sourceLastVerifiedAt: string | null;
  confidence: RoutingConfidence;
  reasonForRecommendation: string;
  verificationNote: string | null;
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
  county: string | null;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
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
  recipientConfirmed: boolean;
  selectedContactSnapshot: unknown;
  emergencyAcknowledged: boolean;
  createdAt: string;
  updatedAt: string;
  contacts: ContactDTO[];
  statusHistory: StatusHistoryDTO[];
  routingDecision: RoutingDecisionDTO | null;
};

export type RoutingDecisionDTO = {
  confidenceScore: number;
  confidenceLabel: RoutingConfidence;
  issueCategory: string;
  likelyJurisdiction: string;
  explanation: string;
  fallbackWarnings: string[];
  manualReviewRequired: boolean;
  emergencyWarningRequired: boolean;
  userVerifiedContact: boolean;
  selectedContactSnapshot: unknown;
  createdAt: string;
};

type ReportWithRelations = Report & {
  contacts?: SuggestedContact[];
  statusHistory?: StatusHistory[];
  routingDecision?: RoutingDecision | null;
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
    county: report.county,
    state: report.state,
    zip: report.zip,
    latitude: report.latitude,
    longitude: report.longitude,
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
    recipientConfirmed: report.recipientConfirmed,
    selectedContactSnapshot: report.selectedContactSnapshot,
    emergencyAcknowledged: report.emergencyAcknowledged,
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
    contacts:
      report.contacts?.map((contact) => ({
        id: contact.id,
        name: contact.name,
        organization: contact.organization,
        department: contact.department,
        type: contact.type,
        email: contact.email,
        phone: contact.phone,
        website: contact.website,
        lookupUrl: contact.lookupUrl,
        source: contact.source,
        sourceLastVerifiedAt: contact.sourceLastVerifiedAt,
        confidence: contact.confidence as RoutingConfidence,
        reasonForRecommendation: contact.reasonForRecommendation,
        verificationNote: contact.verificationNote,
        reason: contact.reason,
        createdAt: contact.createdAt.toISOString()
      })) ?? [],
    statusHistory:
      report.statusHistory?.map((entry) => ({
        id: entry.id,
        status: entry.status,
        note: entry.note,
        createdAt: entry.createdAt.toISOString()
      })) ?? [],
    routingDecision: report.routingDecision
      ? {
          confidenceScore: report.routingDecision.confidenceScore,
          confidenceLabel: report.routingDecision.confidenceLabel as RoutingConfidence,
          issueCategory: report.routingDecision.issueCategory,
          likelyJurisdiction: report.routingDecision.likelyJurisdiction,
          explanation: report.routingDecision.explanation,
          fallbackWarnings: missingDetails(report.routingDecision.fallbackWarnings),
          manualReviewRequired: report.routingDecision.manualReviewRequired,
          emergencyWarningRequired: report.routingDecision.emergencyWarningRequired,
          userVerifiedContact: report.routingDecision.userVerifiedContact,
          selectedContactSnapshot: report.routingDecision.selectedContactSnapshot,
          createdAt: report.routingDecision.createdAt.toISOString()
        }
      : null
  };
}
