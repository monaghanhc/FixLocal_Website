import { LoadingState } from "@/components/ui/loading-state";

export default function CreateLoading() {
  return (
    <section className="section-shell py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <LoadingState label="Loading report wizard" />
        <LoadingState label="Loading report wizard" />
      </div>
    </section>
  );
}
