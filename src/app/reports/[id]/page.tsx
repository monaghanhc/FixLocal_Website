import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ReportDetailClient } from "@/components/reports/report-detail-client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toReportDTO } from "@/lib/report-dto";

type ReportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const { id } = await params;
  const report = await prisma.report.findFirst({
    where: { id, userId: user.id },
    include: {
      contacts: true,
      statusHistory: { orderBy: { createdAt: "asc" } }
    }
  });

  if (!report) {
    notFound();
  }

  return (
    <section className="section-shell py-8 sm:py-10">
      <Link
        href="/dashboard"
        className="focus-ring mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-civic-blue"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <ReportDetailClient initialReport={toReportDTO(report)} />
    </section>
  );
}
