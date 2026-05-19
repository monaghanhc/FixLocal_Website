"use client";

import { useState } from "react";
import { CreditCard, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { plans, type EntitlementSummary } from "@/lib/billing/types";

export function BillingPanel({ initialEntitlement }: { initialEntitlement: EntitlementSummary }) {
  const [entitlement, setEntitlement] = useState(initialEntitlement);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function demoUpgrade(plan: "pro_monthly" | "pro_annual") {
    setLoadingPlan(plan);
    try {
      const response = await fetch("/api/billing/demo-upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update plan.");
      setEntitlement(data.entitlement);
      toast.success("Demo Pro entitlement activated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update plan.");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function cancelAtPeriodEnd() {
    setLoadingPlan("cancel");
    try {
      const response = await fetch("/api/billing/demo-cancel", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not cancel subscription.");
      setEntitlement(data.entitlement);
      toast.success("Subscription marked to cancel at period end.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel subscription.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Plan</p>
        <h2 className="mt-1 text-2xl font-bold text-civic-ink">
          {entitlement.isPro ? "Pro active" : "Free plan"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {entitlement.isPro
            ? `Unlimited report generation. Current period ends ${
                entitlement.currentPeriodEnd
                  ? new Date(entitlement.currentPeriodEnd).toLocaleDateString()
                  : "when your subscription provider says it ends"
              }.`
            : `${entitlement.usedThisMonth} of ${entitlement.monthlyLimit} free AI-generated reports used this month.`}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={entitlement.manageUrl || "/settings"}
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <CreditCard className="h-4 w-4" />
            Manage Subscription
          </a>
          {entitlement.isPro ? (
            <button
              type="button"
              onClick={cancelAtPeriodEnd}
              disabled={loadingPlan === "cancel"}
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
            >
              {loadingPlan === "cancel" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Cancel at period end
            </button>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.slug} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <h3 className="text-lg font-bold text-civic-ink">{plan.name}</h3>
            <p className="mt-2 text-3xl font-bold text-civic-ink">{plan.price}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{plan.renewalCopy}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            {plan.slug !== "free" ? (
              <button
                type="button"
                onClick={() => demoUpgrade(plan.slug)}
                disabled={loadingPlan === plan.slug}
                className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-civic-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
              >
                {loadingPlan === plan.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Start {plan.name} Demo
              </button>
            ) : null}
          </div>
        ))}
      </section>
    </div>
  );
}
