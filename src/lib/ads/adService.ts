export type AdPlacement = "post_generation" | "dashboard_sidebar" | "non_critical_footer";

const blockedPlacements = new Set([
  "emergency",
  "safety",
  "legal_disclaimer",
  "recipient_verification"
]);

export function shouldShowAd({
  isPro,
  placement
}: {
  isPro: boolean;
  placement: AdPlacement | string;
}) {
  if (isPro) return false;
  if (blockedPlacements.has(placement)) return false;
  return false;
}

export const adService = {
  shouldShowAd
};
