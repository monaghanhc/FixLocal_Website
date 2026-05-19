import Link from "next/link";
import { plans } from "@/lib/billing/types";

export default function PricingPage() {
  return (
    <section className="section-shell py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Pricing</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-civic-ink">
          Clear pricing before purchase
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-700">
          Free users can generate 3 AI-assisted reports per calendar month. Pro is for users who
          need unlimited report generation, PDF export, report history, saved contacts, and
          follow-up workflows.
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.slug} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-bold text-civic-ink">{plan.name}</h2>
            <p className="mt-3 text-3xl font-bold text-civic-ink">{plan.price}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{plan.renewalCopy}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-card">
        <h2 className="text-lg font-bold text-civic-ink">Cancellation guidance</h2>
        <p className="mt-2">
          Web Stripe users manage billing through the Stripe customer portal. iOS users manage
          subscriptions through Apple account subscriptions. Android users manage subscriptions
          through Google Play subscriptions.
        </p>
        <Link
          href="/settings"
          className="focus-ring mt-4 inline-flex rounded-lg bg-civic-blue px-4 py-2.5 text-sm font-semibold text-white"
        >
          Manage Subscription
        </Link>
      </div>
    </section>
  );
}
