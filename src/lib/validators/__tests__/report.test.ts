import { describe, expect, it } from "vitest";
import { saveReportSchema } from "../report";

const contact = {
  name: "Charleston Stormwater Sample Contact",
  organization: "City of Charleston, SC",
  department: "Stormwater or Public Works",
  type: "Stormwater Department",
  email: null,
  phone: null,
  website: "https://example.test/source",
  lookupUrl: "https://example.test/source",
  source: "Sample data for local development - not verified official contact",
  sourceLastVerifiedAt: null,
  confidence: "LOW" as const,
  reasonForRecommendation: "Drainage issues commonly route to stormwater staff.",
  verificationNote: "Verify before sending.",
  reason: "Drainage issues commonly route to stormwater staff."
};

const payload = {
  input: {
    title: "Blocked storm drain",
    description: "Storm drain is blocked and water is backing up into the street.",
    category: "Drainage or flooding" as const,
    address: "100 Meeting Street",
    city: "Charleston",
    county: "Charleston",
    state: "SC",
    zip: "29401",
    latitude: 32.78,
    longitude: -79.93,
    dateObserved: "2026-05-19",
    urgent: false,
    optionalNotes: "Water reaches the curb after rain.",
    imagePath: "/uploads/test.jpg"
  },
  ai: {
    analysis: {
      detectedIssueType: "Drainage or stormwater concern",
      severity: "MEDIUM" as const,
      confidenceScore: 0.82,
      missingDetails: ["Depth of standing water"],
      suggestedResponsibleParty: "Stormwater Department"
    },
    messages: {
      subjectLine: "Request for action: Blocked storm drain",
      formalEmail: "Formal email body",
      smsMessage: "Short SMS",
      printableReport: "Printable report",
      followUpMessage: "Follow up"
    }
  },
  contacts: [contact],
  routingDecision: {
    suggestedContacts: [contact],
    confidenceScore: 0.38,
    confidenceLabel: "LOW" as const,
    issueCategory: "Drainage or flooding",
    likelyJurisdiction: "Charleston, SC",
    explanation: "Matched drainage to stormwater.",
    fallbackWarnings: ["Sample data must be verified."],
    manualReviewRequired: true,
    emergencyWarningRequired: false
  },
  recipientConfirmation: {
    selectedContactIndex: 0,
    manualContact: null,
    verified: true,
    emergencyAcknowledged: false
  }
};

describe("report save validation", () => {
  it("accepts a verified selected recipient", () => {
    expect(saveReportSchema.safeParse(payload).success).toBe(true);
  });

  it("requires recipient verification before saving or sending", () => {
    const result = saveReportSchema.safeParse({
      ...payload,
      recipientConfirmation: {
        ...payload.recipientConfirmation,
        verified: false
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Verify");
    }
  });

  it("blocks report generation save payloads until recipient review is complete", () => {
    const result = saveReportSchema.safeParse({
      ...payload,
      recipientConfirmation: {
        selectedContactIndex: null,
        manualContact: null,
        verified: true,
        emergencyAcknowledged: false
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Select a suggested contact");
    }
  });

  it("requires emergency acknowledgement when routing flags immediate danger", () => {
    const result = saveReportSchema.safeParse({
      ...payload,
      routingDecision: {
        ...payload.routingDecision,
        emergencyWarningRequired: true
      },
      recipientConfirmation: {
        ...payload.recipientConfirmation,
        emergencyAcknowledged: false
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("emergency warning");
    }
  });

  it("allows a complete manually entered recipient after verification", () => {
    const result = saveReportSchema.safeParse({
      ...payload,
      recipientConfirmation: {
        selectedContactIndex: null,
        manualContact: {
          ...contact,
          name: "Verified Property Manager",
          organization: "Example Management",
          department: "Maintenance",
          type: "Property Manager",
          email: "manager@example.test",
          website: "https://example.test"
        },
        verified: true,
        emergencyAcknowledged: false
      }
    });

    expect(result.success).toBe(true);
  });
});
