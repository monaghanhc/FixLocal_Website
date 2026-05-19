import { plans, type PlanSlug } from "./types";

export function createCheckoutIntent(plan: PlanSlug) {
  const selected = plans.find((item) => item.slug === plan);
  if (!selected || selected.slug === "free") {
    return {
      configured: false,
      url: null,
      message: "Select a paid Pro plan to start checkout."
    };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      configured: false,
      url: null,
      message:
        "Stripe is not configured in this local MVP. Use the demo Pro action locally or add Stripe keys in production."
    };
  }

  return {
    configured: false,
    url: null,
    message: "Stripe Checkout is intentionally stubbed behind BillingService until production keys are configured."
  };
}

export function manageSubscriptionUrl(existingUrl?: string | null) {
  return existingUrl || "/settings";
}

export const billingService = {
  createCheckoutIntent,
  manageSubscriptionUrl
};
