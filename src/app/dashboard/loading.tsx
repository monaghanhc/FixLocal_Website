import { LoadingState } from "@/components/ui/loading-state";

export default function DashboardLoading() {
  return (
    <section className="section-shell py-10">
      <div className="mb-8 h-24 max-w-2xl animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <LoadingState label="Loading reports" />
        <LoadingState label="Loading reports" />
        <LoadingState label="Loading reports" />
      </div>
    </section>
  );
}
