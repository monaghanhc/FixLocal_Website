import { AlertTriangle, Construction, Droplets, LampDesk, Recycle } from "lucide-react";

const examples = [
  {
    title: "Pothole",
    contact: "City Public Works",
    severity: "High",
    color: "bg-blue-50 text-blue-700",
    icon: Construction
  },
  {
    title: "Mold",
    contact: "Property Manager",
    severity: "Urgent",
    color: "bg-emerald-50 text-emerald-700",
    icon: AlertTriangle
  },
  {
    title: "Broken streetlight",
    contact: "Utility Company",
    severity: "Medium",
    color: "bg-amber-50 text-amber-700",
    icon: LampDesk
  },
  {
    title: "Trash dumping",
    contact: "Sanitation",
    severity: "Medium",
    color: "bg-orange-50 text-orange-700",
    icon: Recycle
  },
  {
    title: "Drainage / flooding",
    contact: "Stormwater",
    severity: "High",
    color: "bg-cyan-50 text-cyan-700",
    icon: Droplets
  }
];

export function ExampleCards() {
  return (
    <section id="examples" className="py-16">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.5fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-civic-coral">Examples</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-civic-ink sm:text-4xl">
              Built for everyday problems that need a clear request
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The mock AI provider estimates severity and routes the issue using category,
              keywords, urgency, and location details. No paid service is required.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {examples.map((example) => {
              const Icon = example.icon;
              return (
                <div key={example.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                  <div className={`inline-grid h-11 w-11 place-items-center rounded-lg ${example.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-civic-ink">{example.title}</h3>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-800">Suggested:</span>{" "}
                      {example.contact}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">Severity:</span>{" "}
                      {example.severity}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
