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
              FixLocal AI never sends messages automatically. It generates copyable email, SMS,
              printable, and follow-up versions so users can review, edit, verify contact details,
              and decide what to send.
            </p>
          </div>
          <div className="rounded-xl border border-white/12 bg-white/8 p-6">
            <div className="space-y-4 text-sm text-white/86">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-civic-mint" />
                <p>Works locally with SQLite, local uploads, mock AI, mock contacts, and PDFs.</p>
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
              Start using FixLocal AI
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
