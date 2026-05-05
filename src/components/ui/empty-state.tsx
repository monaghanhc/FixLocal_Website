import Link from "next/link";
import { ClipboardList } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-card">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-civic-mint text-civic-teal">
        <ClipboardList className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-civic-ink">No reports yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
        Start with a photo and a few details. FixLocal AI will prepare the messages and contact
        suggestions.
      </p>
      <Link
        href="/create"
        className="focus-ring mt-5 inline-flex items-center justify-center rounded-lg bg-civic-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
      >
        Create a report
      </Link>
    </div>
  );
}
