import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { DemoAuthButton } from "@/components/auth/demo-auth-button";

type HeroProps = {
  isAuthed: boolean;
};

export function Hero({ isAuthed }: HeroProps) {
  return (
    <section className="hero-image min-h-[calc(100vh-4rem)]">
      <div className="section-shell flex min-h-[calc(100vh-4rem)] items-center py-16">
        <div className="max-w-3xl text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold ring-1 ring-white/25 backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            Review everything before sending
          </div>
          <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
            Report local problems in 60 seconds
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl">
            Upload a photo, add the location and a few details, and FixLocal AI drafts a
            professional report for the right authority, landlord, HOA, utility, or code office.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isAuthed ? (
              <Link
                href="/create"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-civic-amber px-5 py-3 text-sm font-bold text-civic-ink shadow-soft transition hover:bg-amber-300"
              >
                Create a report
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <DemoAuthButton redirectTo="/create" className="bg-civic-amber px-5 py-3 font-bold text-civic-ink hover:bg-amber-300">
                Create a report
              </DemoAuthButton>
            )}
            <Link
              href="#examples"
              className="focus-ring inline-flex items-center justify-center rounded-lg bg-white/12 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
            >
              See examples
            </Link>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 text-sm text-white/80">
            <div className="rounded-lg bg-black/20 p-3 ring-1 ring-white/12 backdrop-blur">
              <p className="text-2xl font-bold text-white">Free</p>
              <p>Mock AI by default</p>
            </div>
            <div className="rounded-lg bg-black/20 p-3 ring-1 ring-white/12 backdrop-blur">
              <p className="text-2xl font-bold text-white">Local</p>
              <p>SQLite and uploads</p>
            </div>
            <div className="rounded-lg bg-black/20 p-3 ring-1 ring-white/12 backdrop-blur">
              <p className="text-2xl font-bold text-white">Fast</p>
              <p>PDF, email, SMS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
