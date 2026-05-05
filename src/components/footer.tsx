import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section-shell grid gap-6 py-8 text-sm text-slate-600 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-semibold text-civic-ink">FixLocal AI</p>
          <p className="mt-2 max-w-xl">
            A free local-first demo for turning photos and notes into clear reports for public
            works, landlords, HOAs, utilities, and code enforcement.
          </p>
        </div>
        <div>
          <p className="font-semibold text-civic-ink">Product</p>
          <div className="mt-2 flex flex-col gap-1">
            <Link href="/create">Create report</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-civic-ink">Safety</p>
          <p className="mt-2">
            This tool is not legal advice. Review every message before sending. For emergencies,
            call emergency services.
          </p>
        </div>
      </div>
    </footer>
  );
}
