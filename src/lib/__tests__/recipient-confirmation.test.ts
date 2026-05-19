import { describe, expect, it } from "vitest";
import { legalDisclaimers } from "@/lib/legal/disclaimers";
import { recipientConfirmationComplete } from "@/lib/recipient-confirmation";
import type { ContactRoutingResult } from "@/lib/contact-routing/types";

const baseRouting: ContactRoutingResult = {
  suggestedContacts: [],
  confidenceScore: 0.4,
  explanation: "Manual review required.",
  fallbackWarnings: [],
  manualReviewRequired: true,
  emergencyWarningRequired: false
};

describe("recipient confirmation and disclaimers", () => {
  it("requires recipient confirmation before sending", () => {
    expect(
      recipientConfirmationComplete({
        selectedContactIndex: 0,
        manualMode: false,
        verified: false,
        emergencyAcknowledged: false
      }, baseRouting)
    ).toBe(false);

    expect(
      recipientConfirmationComplete({
        selectedContactIndex: 0,
        manualMode: false,
        verified: true,
        emergencyAcknowledged: false
      }, baseRouting)
    ).toBe(true);
  });

  it("supports manual recipient override", () => {
    expect(
      recipientConfirmationComplete({
        selectedContactIndex: null,
        manualMode: true,
        verified: true,
        emergencyAcknowledged: false
      }, baseRouting)
    ).toBe(true);
  });

  it("requires emergency acknowledgement when warning is present", () => {
    expect(
      recipientConfirmationComplete(
        {
          selectedContactIndex: 0,
          manualMode: false,
          verified: true,
          emergencyAcknowledged: false
        },
        { ...baseRouting, emergencyWarningRequired: true }
      )
    ).toBe(false);
  });

  it("includes required pre-send disclaimers", () => {
    expect(legalDisclaimers.join(" ")).toContain("does not provide legal advice");
    expect(legalDisclaimers.join(" ")).toContain("must be reviewed before sending");
    expect(legalDisclaimers.join(" ")).toContain("verifying recipients");
    expect(legalDisclaimers.join(" ")).toContain("call emergency services");
  });
});
