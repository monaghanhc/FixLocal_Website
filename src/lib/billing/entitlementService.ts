import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { FREE_MONTHLY_REPORT_LIMIT, type EntitlementSummary } from "./types";

export { FREE_MONTHLY_REPORT_LIMIT };

function periodKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function isActiveStatus(status?: SubscriptionStatus | string | null, currentPeriodEnd?: Date | null) {
  if (status === "ACTIVE") return true;
  if (status === "CANCELED_ACTIVE" && currentPeriodEnd && currentPeriodEnd > new Date()) return true;
  return false;
}

export function evaluateEntitlementState({
  status,
  currentPeriodEnd,
  usedThisMonth
}: {
  status?: SubscriptionStatus | string | null;
  currentPeriodEnd?: Date | null;
  usedThisMonth: number;
}) {
  const isPro = isActiveStatus(status, currentPeriodEnd);
  return {
    isPro,
    allowed: isPro || usedThisMonth < FREE_MONTHLY_REPORT_LIMIT,
    remainingThisMonth: isPro ? null : Math.max(0, FREE_MONTHLY_REPORT_LIMIT - usedThisMonth)
  };
}

export async function getEntitlementSummary(userId: string): Promise<EntitlementSummary> {
  const entitlement = await prisma.userEntitlement.findFirst({
    where: { userId },
    include: { plan: true },
    orderBy: { updatedAt: "desc" }
  });
  const usage = await prisma.usageCounter.findUnique({
    where: {
      userId_periodKey_action: {
        userId,
        periodKey: periodKey(),
        action: "ai_report_generation"
      }
    }
  });
  const usedThisMonth = usage?.count ?? 0;
  const evaluated = evaluateEntitlementState({
    status: entitlement?.status,
    currentPeriodEnd: entitlement?.currentPeriodEnd,
    usedThisMonth
  });

  return {
    plan: evaluated.isPro ? ((entitlement?.plan?.slug as "pro_monthly" | "pro_annual") ?? "pro_monthly") : "free",
    status: entitlement?.status ?? "FREE",
    isPro: evaluated.isPro,
    monthlyLimit: evaluated.isPro ? null : FREE_MONTHLY_REPORT_LIMIT,
    usedThisMonth,
    remainingThisMonth: evaluated.remainingThisMonth,
    currentPeriodEnd: entitlement?.currentPeriodEnd?.toISOString() ?? null,
    manageUrl: entitlement?.manageUrl ?? null
  };
}

export async function canGenerateReport(userId: string) {
  const summary = await getEntitlementSummary(userId);
  if (summary.isPro) return { ...summary, allowed: true };
  const allowed = summary.usedThisMonth < FREE_MONTHLY_REPORT_LIMIT;
  return {
    ...summary,
    allowed,
    reason: allowed
      ? undefined
      : "Free plan limit reached. Upgrade to Pro for unlimited AI-generated reports."
  };
}

export async function recordReportGeneration(userId: string) {
  const summary = await getEntitlementSummary(userId);
  if (summary.isPro) return summary;

  await prisma.usageCounter.upsert({
    where: {
      userId_periodKey_action: {
        userId,
        periodKey: periodKey(),
        action: "ai_report_generation"
      }
    },
    update: { count: { increment: 1 } },
    create: {
      userId,
      periodKey: periodKey(),
      action: "ai_report_generation",
      count: 1
    }
  });

  return getEntitlementSummary(userId);
}

export async function setDemoProEntitlement(userId: string, planSlug: "pro_monthly" | "pro_annual") {
  const plan = await prisma.subscriptionPlan.upsert({
    where: { slug: planSlug },
    update: {},
    create: {
      slug: planSlug,
      name: planSlug === "pro_monthly" ? "Monthly Pro" : "Annual Pro",
      priceCents: planSlug === "pro_monthly" ? 499 : 2999,
      interval: planSlug === "pro_monthly" ? "month" : "year",
      reportLimit: null,
      features: ["Unlimited reports", "PDF export", "Report history", "Saved contacts"]
    }
  });

  return prisma.userEntitlement.create({
    data: {
      userId,
      planId: plan.id,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + (planSlug === "pro_monthly" ? 31 : 366) * 24 * 60 * 60 * 1000),
      provider: "demo",
      manageUrl: "/settings"
    }
  });
}

export async function cancelDemoEntitlementAtPeriodEnd(userId: string) {
  const entitlement = await prisma.userEntitlement.findFirst({
    where: { userId, status: SubscriptionStatus.ACTIVE },
    orderBy: { updatedAt: "desc" }
  });
  if (!entitlement) return null;

  return prisma.userEntitlement.update({
    where: { id: entitlement.id },
    data: {
      status: SubscriptionStatus.CANCELED_ACTIVE,
      cancelAtPeriodEnd: true
    }
  });
}

export const entitlementService = {
  getEntitlementSummary,
  canGenerateReport,
  recordReportGeneration,
  setDemoProEntitlement,
  cancelDemoEntitlementAtPeriodEnd
};
