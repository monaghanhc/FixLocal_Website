import Link from "next/link";
import { MapPin, PlusCircle } from "lucide-react";
import { DemoAuthButton } from "@/components/auth/demo-auth-button";

type HeaderProps = {
  user: { name: string | null; email: string } | null;
};

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="section-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-md">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-civic-ink text-white">
            <MapPin className="h-5 w-5" />
          </span>
          <span className="text-base font-bold tracking-tight text-civic-ink">ReportRight AI</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link className="transition hover:text-civic-ink" href="/about">
            About
          </Link>
          <Link className="transition hover:text-civic-ink" href="/privacy">
            Privacy
          </Link>
          <Link className="transition hover:text-civic-ink" href="/pricing">
            Pricing
          </Link>
          {user ? (
            <Link className="transition hover:text-civic-ink" href="/dashboard">
              Dashboard
            </Link>
          ) : null}
          {user ? (
            <Link className="transition hover:text-civic-ink" href="/settings">
              Settings
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/create"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-civic-blue px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Create report</span>
            </Link>
          ) : (
            <DemoAuthButton redirectTo="/create" className="px-3 py-2">
              Create report
            </DemoAuthButton>
          )}
        </div>
      </div>
    </header>
  );
}
