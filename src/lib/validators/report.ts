import { z } from "zod";
import { issueCategories, reportStatuses, severities } from "@/lib/constants";

export const reportInputSchema = z.object({
  title: z.string().trim().min(3, "Add a short title."),
  description: z.string().trim().min(12, "Describe the issue in a sentence or two."),
  category: z.enum(issueCategories),
  address: z.string().trim().min(3, "Add a street address or nearby location."),
  city: z.string().trim().min(2, "Add the city."),
  county: z.string().trim().optional().nullable(),
  state: z.string().trim().min(2, "Add the state."),
  zip: z.string().trim().min(3, "Add the ZIP code."),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  dateObserved: z.string().trim().min(4, "Add the date observed."),
  urgent: z.boolean().default(false),
  optionalNotes: z.string().trim().optional().nullable(),
  imagePath: z.string().trim().min(1, "Upload a photo before generating the report.")
});

export const contactSchema = z.object({
  name: z.string().min(1),
  organization: z.string().min(1),
  department: z.string().min(1),
  type: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(1).optional().nullable(),
  website: z.string().url(),
  lookupUrl: z.string().url().optional().nullable(),
  source: z.string().min(1),
  sourceLastVerifiedAt: z.string().optional().nullable(),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  reasonForRecommendation: z.string().min(1),
  verificationNote: z.string().optional().nullable(),
  reason: z.string().min(1)
});

export const routingDecisionSchema = z.object({
  suggestedContacts: z.array(contactSchema),
  confidenceScore: z.number().min(0).max(1),
  explanation: z.string().min(1),
  fallbackWarnings: z.array(z.string()),
  manualReviewRequired: z.boolean(),
  emergencyWarningRequired: z.boolean()
});

export const recipientConfirmationSchema = z.object({
  selectedContactIndex: z.number().int().min(0).optional().nullable(),
  manualContact: contactSchema.optional().nullable(),
  verified: z.boolean(),
  emergencyAcknowledged: z.boolean().optional().default(false)
});

export const aiResultSchema = z.object({
  analysis: z.object({
    detectedIssueType: z.string().min(1),
    severity: z.enum(severities),
    confidenceScore: z.number().min(0).max(1),
    missingDetails: z.array(z.string()),
    suggestedResponsibleParty: z.string().min(1)
  }),
  messages: z.object({
    subjectLine: z.string().min(1),
    formalEmail: z.string().min(1),
    smsMessage: z.string().min(1),
    printableReport: z.string().min(1),
    followUpMessage: z.string().min(1)
  })
});

export const saveReportSchema = z
  .object({
    input: reportInputSchema,
    ai: aiResultSchema,
    contacts: z.array(contactSchema).min(1),
    routingDecision: routingDecisionSchema,
    recipientConfirmation: recipientConfirmationSchema
  })
  .refine((value) => value.recipientConfirmation.verified, {
    path: ["recipientConfirmation", "verified"],
    message: "Verify or manually enter the recipient before saving."
  })
  .refine(
    (value) =>
      !value.routingDecision.emergencyWarningRequired ||
      value.recipientConfirmation.emergencyAcknowledged,
    {
      path: ["recipientConfirmation", "emergencyAcknowledged"],
      message: "Acknowledge the emergency warning before continuing."
    }
  );

export const updateReportSchema = z.object({
  status: z.enum(reportStatuses).optional(),
  optionalNotes: z.string().trim().optional().nullable(),
  note: z.string().trim().optional().nullable()
});

export type ReportInputValues = z.infer<typeof reportInputSchema>;
export type SaveReportPayload = z.infer<typeof saveReportSchema>;
