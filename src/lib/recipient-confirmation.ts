import type { ContactRoutingResult } from "@/lib/contact-routing/types";

export type RecipientConfirmationInput = {
  selectedContactIndex: number | null;
  manualMode: boolean;
  verified: boolean;
  emergencyAcknowledged: boolean;
};

export function recipientConfirmationComplete(
  value: RecipientConfirmationInput,
  routingDecision?: ContactRoutingResult | null
) {
  const hasRecipient =
    value.manualMode ||
    (typeof value.selectedContactIndex === "number" && value.selectedContactIndex >= 0);
  const emergencyOk = !routingDecision?.emergencyWarningRequired || value.emergencyAcknowledged;
  return hasRecipient && value.verified && emergencyOk;
}
