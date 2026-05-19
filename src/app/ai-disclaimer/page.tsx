export default function AiDisclaimerPage() {
  return (
    <section className="section-shell py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">AI Disclaimer</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-civic-ink">
          AI-generated reports require review
        </h1>
        <div className="mt-6 space-y-4 text-base leading-7 text-slate-700">
          <p>
            AI-generated categories, severity estimates, report text, and recipient suggestions may
            be incomplete or inaccurate. ReportRight AI should be treated as drafting and routing
            assistance, not as an official determination.
          </p>
          <p>
            Users must review the generated report, confirm the category and location, verify the
            recipient source, and edit inaccurate content before sending.
          </p>
        </div>
      </div>
    </section>
  );
}
