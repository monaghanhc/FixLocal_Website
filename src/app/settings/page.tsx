import { redirect } from "next/navigation";
import { BillingPanel } from "@/components/billing/billing-panel";
import { getCurrentUser } from "@/lib/auth";
import { entitlementService } from "@/lib/billing/entitlementService";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const entitlement = await entitlementService.getEntitlementSummary(user.id);

  return (
    <section className="section-shell py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Account</p>
        <h1 className="mt-2 text-4xl font-bold tracking-normal text-civic-ink">Settings and billing</h1>
        <p className="mt-3 text-slate-600">
          Manage your plan, review renewal and cancellation guidance, and find data deletion
          instructions. This local MVP uses a demo Pro toggle unless Stripe is configured.
        </p>
      </div>
      <BillingPanel initialEntitlement={entitlement} />
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-card">
        <h2 className="text-lg font-bold text-civic-ink">Cancellation and data deletion</h2>
        <p className="mt-2">
          Web Stripe users manage billing through the Stripe customer portal. iOS users manage
          subscriptions through Apple account subscriptions. Android users manage subscriptions
          through Google Play subscriptions. To delete local demo data, delete saved reports from
          the dashboard and remove the local SQLite database, or contact the site operator in a
          hosted deployment.
        </p>
      </section>
    </section>
  );
}
