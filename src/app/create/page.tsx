import { redirect } from "next/navigation";
import { ReportWizard } from "@/components/reports/report-wizard";
import { getCurrentUser } from "@/lib/auth";

export default async function CreateReportPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  return (
    <section className="section-shell py-8 sm:py-10">
      <ReportWizard />
    </section>
  );
}
