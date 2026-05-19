import { describe, expect, it } from "vitest";
import { evaluateEntitlementState, FREE_MONTHLY_REPORT_LIMIT } from "../entitlementService";

describe("Entitlement rules", () => {
  it("enforces the free monthly usage limit", () => {
    expect(evaluateEntitlementState({ status: "FREE", usedThisMonth: 0 }).allowed).toBe(true);
    expect(
      evaluateEntitlementState({ status: "FREE", usedThisMonth: FREE_MONTHLY_REPORT_LIMIT }).allowed
    ).toBe(false);
  });

  it("allows pro unlimited usage", () => {
    expect(evaluateEntitlementState({ status: "ACTIVE", usedThisMonth: 999 }).allowed).toBe(true);
  });

  it("treats canceled subscriptions as active until period end", () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
    expect(
      evaluateEntitlementState({
        status: "CANCELED_ACTIVE",
        currentPeriodEnd: future,
        usedThisMonth: 999
      }).allowed
    ).toBe(true);
  });

  it("expires canceled subscriptions after period end", () => {
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(
      evaluateEntitlementState({
        status: "CANCELED_ACTIVE",
        currentPeriodEnd: past,
        usedThisMonth: FREE_MONTHLY_REPORT_LIMIT
      }).allowed
    ).toBe(false);
  });

  it("treats expired subscriptions as free", () => {
    expect(
      evaluateEntitlementState({
        status: "EXPIRED",
        usedThisMonth: FREE_MONTHLY_REPORT_LIMIT
      }).allowed
    ).toBe(false);
  });
});
