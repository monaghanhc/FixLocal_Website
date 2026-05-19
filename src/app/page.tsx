import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ExampleCards } from "@/components/landing/example-cards";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <>
      <Hero isAuthed={Boolean(user)} />
      <HowItWorks />
      <ExampleCards />
      <section className="bg-civic-ink py-16 text-white">
        <div className="section-shell grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-civic-amber">
              Safety first
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
              AI drafts the report. You stay in control.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/78">
              ReportRight AI never sends messages automatically. It generates copyable email, SMS,
              printable, and follow-up versions so users can review, edit, verify contact details,
              and decide what to send.
            </p>
          </div>
          <div className="rounded-xl border border-white/12 bg-white/8 p-6">
            <div className="space-y-4 text-sm text-white/86">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-civic-mint" />
                <p>Works locally with SQLite, local uploads, mock AI, recipient review, and PDFs.</p>
              </div>
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-none text-civic-amber" />
                <p>
                  Not legal advice. AI content may be inaccurate. For emergencies, call emergency
                  services.
                </p>
              </div>
            </div>
            <Link
              href={user ? "/create" : "/dashboard"}
              className="focus-ring mt-6 inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-civic-ink transition hover:bg-slate-100"
            >
              Start using ReportRight AI
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="section-shell grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-6 shadow-card">
            <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Who it helps</p>
            <h2 className="mt-2 text-2xl font-bold text-civic-ink">Residents, tenants, owners, and boards</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Route city, rental, HOA, safety, and property reports with clearer evidence and better
              recipient review.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-6 shadow-card">
            <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Pricing</p>
            <h2 className="mt-2 text-2xl font-bold text-civic-ink">Free, Monthly Pro, Annual Pro</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Free includes 3 AI-generated reports per month. Pro is $4.99/month or $29.99/year
              for unlimited reports and export/history features.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-6 shadow-card">
            <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">Privacy-first</p>
            <h2 className="mt-2 text-2xl font-bold text-civic-ink">You verify before sending</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Reports are not sent automatically. Users verify recipients, details, and emergency
              warnings before saving or sending.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="section-shell grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-civic-teal">FAQ</p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal text-civic-ink">
              Review-first reporting
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              [
                "Does ReportRight AI send reports automatically?",
                "No. It drafts messages and recipient suggestions, but users must verify and decide what to send."
              ],
              [
                "How are recipients selected?",
                "The routing service uses the confirmed category, location/jurisdiction, verified-source fixtures when available, and fallback department rules."
              ],
              [
                "What if the app is not confident?",
                "Low-confidence routing requires manual review and recipient confirmation before saving or sending."
              ]
            ].map(([question, answer]) => (
              <div key={question} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                <h3 className="font-bold text-civic-ink">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
