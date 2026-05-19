import { Bot, Camera, ClipboardCheck, Mail, MapPinned } from "lucide-react";

const steps = [
  {
    title: "Upload photo",
    text: "Add a photo from the street, property, or affected area.",
    icon: Camera
  },
  {
    title: "Add location and description",
    text: "Confirm address, jurisdiction, category, urgency, and notes.",
    icon: MapPinned
  },
  {
    title: "AI generates report",
    text: "Get severity, missing details, and polished message drafts.",
    icon: Bot
  },
  {
    title: "Review the recipient",
    text: "See why a contact was suggested, verify the source, or manually enter a recipient.",
    icon: Mail
  },
  {
    title: "Track resolution",
    text: "Save the report, update status, and keep a follow-up timeline.",
    icon: ClipboardCheck
  }
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal text-civic-ink sm:text-4xl">
            A practical workflow for civic, rental, HOA, and property reports
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-civic-blue shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-400">{index + 1}</span>
                </div>
                <h3 className="mt-5 text-base font-bold text-civic-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
