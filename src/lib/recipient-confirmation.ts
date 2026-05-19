import type { ContactRoutingResult } from "@/lib/contact-routing/types";

export type RecipientConfirmationInput = {
  selectedContactIndex: number | null;
  manualMode: boolean;
  manualContact?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
  } | null;
  verified: boolean;
  emergencyAcknowledged: boolean;
};

export function recipientConfirmationComplete(
  value: RecipientConfirmationInput,
  routingDecision?: ContactRoutingResult | null
) {
  const manualHasUsableRecipient =
    value.manualMode &&
    Boolean(value.manualContact?.name?.trim()) &&
    Boolean(
      value.manualContact?.email?.trim() ||
        value.manualContact?.phone?.trim() ||
        value.manualContact?.website?.trim()
    );
  const hasRecipient =
    manualHasUsableRecipient ||
    (!value.manualMode && typeof value.selectedContactIndex === "number" && value.selectedContactIndex >= 0);
  const emergencyOk = !routingDecision?.emergencyWarningRequired || value.emergencyAcknowledged;
  return hasRecipient && value.verified && emergencyOk;
}
