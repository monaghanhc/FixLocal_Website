import { NextResponse } from "next/server";
import { ReportStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toReportDTO } from "@/lib/report-dto";
import { updateReportSchema } from "@/lib/validators/report";

type Context = {
  params: Promise<{ id: string }>;
};

async function loadReport(id: string, userId: string) {
  return prisma.report.findFirst({
    where: { id, userId },
    include: {
      contacts: true,
      statusHistory: { orderBy: { createdAt: "asc" } }
    }
  });
}

export async function GET(_request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await context.params;
  const report = await loadReport(id, user.id);
  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  return NextResponse.json({ report: toReportDTO(report) });
}

export async function PATCH(request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const existing = await loadReport(id, user.id);
    if (!existing) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateReportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid update.", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const statusChanged = parsed.data.status && parsed.data.status !== existing.status;
    const report = await prisma.report.update({
      where: { id },
      data: {
        status: parsed.data.status as ReportStatus | undefined,
        optionalNotes:
          parsed.data.optionalNotes === undefined ? undefined : parsed.data.optionalNotes || null,
        statusHistory: statusChanged
          ? {
              create: {
                status: parsed.data.status as ReportStatus,
                note: parsed.data.note || "Status updated."
              }
            }
          : undefined
      },
      include: {
        contacts: true,
        statusHistory: { orderBy: { createdAt: "asc" } }
      }
    });

    return NextResponse.json({ report: toReportDTO(report) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not update report." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const existing = await loadReport(id, user.id);
    if (!existing) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    await prisma.report.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not delete report." }, { status: 500 });
  }
}
