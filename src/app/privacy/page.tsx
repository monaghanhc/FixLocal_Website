export default function PrivacyPage() {
  return (
    <section className="section-shell py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Privacy</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-civic-ink">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-base leading-7 text-slate-700">
          <p>
            In the default local setup, reports are stored in a SQLite database on your machine and
            uploaded images are stored in the local public uploads folder. No real emails are sent
            by the app.
          </p>
          <p>
            ReportRight AI may process photos/images you upload, GPS coordinates, location/address
            data, county/city/state/ZIP details, issue descriptions, user notes, generated reports,
            recipient/contact information, report status history, and confirmation choices.
          </p>
          <p>
            If analytics are added in a hosted deployment, the policy should identify the analytics
            provider and events collected. If payments are enabled, payment/subscription data is
            processed by the billing provider, such as Stripe on web or Apple/Google for mobile
            subscriptions.
          </p>
          <p>
            AI processing may use a local mock provider by default or an external AI provider when
            configured by the site operator. Users should avoid uploading unnecessary sensitive
            information.
          </p>
          <p>
            Contact suggestions are estimates from routing rules and any configured verified-source
            directory. Recipients should still be verified. AI-generated content may be inaccurate.
            Users should review and edit messages before sharing them.
          </p>
          <p>
            This MVP does not provide legal advice. For emergencies or immediate danger, call
            emergency services instead of relying on this tool.
          </p>
          <p>
            Delete data instructions: in local demo mode, delete reports from the dashboard and
            remove local uploaded files or the SQLite database. In a hosted deployment, users should
            contact the site operator to request account, image, location, report, recipient, and
            subscription-related data deletion, subject to legal or billing retention requirements.
          </p>
        </div>
      </div>
    </section>
  );
}
