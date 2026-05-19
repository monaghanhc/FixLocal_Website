import type { issueCategories, responsibleParties, severities } from "@/lib/constants";

export type IssueCategory = (typeof issueCategories)[number];
export type Severity = (typeof severities)[number];
export type ResponsibleParty = (typeof responsibleParties)[number];

export type AIReportInput = {
  title: string;
  description: string;
  category: IssueCategory;
  address: string;
  city: string;
  county?: string | null;
  state: string;
  zip: string;
  latitude?: number | null;
  longitude?: number | null;
  dateObserved: string;
  urgent: boolean;
  optionalNotes?: string | null;
  imagePath: string;
};

export type AIAnalysis = {
  detectedIssueType: string;
  severity: Severity;
  confidenceScore: number;
  missingDetails: string[];
  suggestedResponsibleParty: ResponsibleParty | string;
};

export type GeneratedMessages = {
  subjectLine: string;
  formalEmail: string;
  smsMessage: string;
  printableReport: string;
  followUpMessage: string;
};

export type AIReportResult = {
  analysis: AIAnalysis;
  messages: GeneratedMessages;
};

export type AIProvider = {
  name: string;
  analyzeAndGenerate(input: AIReportInput): Promise<AIReportResult>;
};
