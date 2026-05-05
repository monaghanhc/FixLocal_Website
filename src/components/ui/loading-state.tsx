export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="mt-4 h-8 w-3/4 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-full rounded bg-slate-200" />
      <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
