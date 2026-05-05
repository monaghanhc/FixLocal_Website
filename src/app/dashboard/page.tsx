import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/reports/dashboard-client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toReportDTO } from "@/lib/report-dto";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const reports = await prisma.report.findMany({
    where: { userId: user.id },
    include: {
      contacts: true,
      statusHistory: { orderBy: { createdAt: "asc" } }
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <section className="section-shell py-10">
      <DashboardClient initialReports={reports.map(toReportDTO)} />
    </section>
  );
}
