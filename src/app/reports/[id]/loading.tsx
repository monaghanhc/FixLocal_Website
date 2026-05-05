import { LoadingState } from "@/components/ui/loading-state";

export default function ReportLoading() {
  return (
    <section className="section-shell py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <LoadingState label="Loading report detail" />
        <LoadingState label="Loading report actions" />
      </div>
    </section>
  );
}
