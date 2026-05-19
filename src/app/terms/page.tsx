import { legalDisclaimers } from "@/lib/legal/disclaimers";

export default function TermsPage() {
  return (
    <section className="section-shell py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Terms</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-civic-ink">Terms of Service</h1>
        <div className="mt-6 space-y-4 text-base leading-7 text-slate-700">
          <p>
            ReportRight AI helps draft reports and recipient suggestions for user review. Users are
            responsible for checking all report details, verifying recipient contact information,
            and deciding whether to send a message.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {legalDisclaimers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            Subscription pricing must be shown before purchase. Cancellation must remain available
            through the relevant billing provider: Stripe customer portal for web subscriptions,
            Apple account subscriptions for iOS, and Google Play subscriptions for Android.
          </p>
        </div>
      </div>
    </section>
  );
}
