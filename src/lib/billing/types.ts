export type PlanSlug = "free" | "pro_monthly" | "pro_annual";
export type SubscriptionState = "FREE" | "ACTIVE" | "CANCELED_ACTIVE" | "EXPIRED";

export type EntitlementSummary = {
  plan: PlanSlug;
  status: SubscriptionState;
  isPro: boolean;
  monthlyLimit: number | null;
  usedThisMonth: number;
  remainingThisMonth: number | null;
  currentPeriodEnd: string | null;
  manageUrl: string | null;
  reason?: string;
};

export const FREE_MONTHLY_REPORT_LIMIT = 3;

export const plans = [
  {
    slug: "free",
    name: "Free",
    price: "$0",
    renewalCopy: "Includes 3 AI-generated reports per calendar month.",
    features: ["3 AI-generated reports per month", "Basic report generation", "Manual recipient confirmation required"]
  },
  {
    slug: "pro_monthly",
    name: "Monthly Pro",
    price: "$4.99/month",
    renewalCopy: "Renews monthly until canceled. Cancel anytime from Manage Subscription.",
    features: ["Unlimited AI-generated reports", "PDF export", "Report history", "Saved contacts", "Follow-up reminders"]
  },
  {
    slug: "pro_annual",
    name: "Annual Pro",
    price: "$29.99/year",
    renewalCopy: "Renews annually until canceled. Cancel anytime from Manage Subscription.",
    features: ["Everything in Monthly Pro", "Lower annual price", "Unlimited report workflow"]
  }
] as const;
