export default function EmergencyDisclaimerPage() {
  return (
    <section className="section-shell py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-red-600">Emergency Disclaimer</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-civic-ink">
          For immediate danger, call emergency services
        </h1>
        <div className="mt-6 space-y-4 text-base leading-7 text-slate-700">
          <p>
            ReportRight AI is not an emergency reporting service. If there is fire, injury, an
            active utility hazard, a downed power line, immediate structural danger, or any urgent
            threat to life or safety, call emergency services first.
          </p>
          <p>
            Recipient suggestions and generated messages should only be used after immediate safety
            needs are handled.
          </p>
        </div>
      </div>
    </section>
  );
}
