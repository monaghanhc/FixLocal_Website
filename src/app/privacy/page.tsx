export default function PrivacyPage() {
  return (
    <section className="section-shell py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Privacy</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-civic-ink">
          Local demo privacy model
        </h1>
        <div className="mt-6 space-y-4 text-base leading-7 text-slate-700">
          <p>
            In the default local setup, reports are stored in a SQLite database on your machine and
            uploaded images are stored in the local public uploads folder. No real emails are sent
            by the app.
          </p>
          <p>
            Contact suggestions are estimates from a local mock directory and should be verified.
            AI-generated content may be inaccurate. Users should review and edit messages before
            sharing them.
          </p>
          <p>
            This MVP does not provide legal advice. For emergencies or immediate danger, call
            emergency services instead of relying on this tool.
          </p>
        </div>
      </div>
    </section>
  );
}
