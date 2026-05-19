export default function AboutPage() {
  return (
    <section className="section-shell py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">About</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-civic-ink">
          A local-first MVP for better issue reporting
        </h1>
        <div className="mt-6 space-y-4 text-base leading-7 text-slate-700">
          <p>
            ReportRight AI helps residents, tenants, and property stakeholders turn a photo and a few
            details into a clear report. The app is designed to run for free on a local machine
            with SQLite, local uploads, mock contact lookup, and a mock AI provider.
          </p>
          <p>
            The optional OpenAI provider is only used when an API key is configured. If it fails,
            the app falls back to mock AI so the workflow remains usable.
          </p>
        </div>
      </div>
    </section>
  );
}
