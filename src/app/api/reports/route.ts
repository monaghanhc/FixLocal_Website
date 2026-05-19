import { NextResponse } from "next/server";
import { ReportStatus, Severity } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toReportDTO } from "@/lib/report-dto";
import { saveReportSchema } from "@/lib/validators/report";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const reports = await prisma.report.findMany({
    where: { userId: user.id },
    include: {
      contacts: true,
      routingDecision: true,
      statusHistory: { orderBy: { createdAt: "asc" } }
    },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({ reports: reports.map(toReportDTO) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = saveReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid report payload.", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { input, ai, contacts, routingDecision, recipientConfirmation } = parsed.data;
    const selectedContact =
      recipientConfirmation.manualContact ??
      contacts[recipientConfirmation.selectedContactIndex ?? 0] ??
      contacts[0];
    const report = await prisma.report.create({
      data: {
        userId: user.id,
        title: input.title,
        description: input.description,
        category: input.category,
        address: input.address,
        city: input.city,
        county: input.county || null,
        state: input.state,
        zip: input.zip,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        dateObserved: new Date(input.dateObserved),
        urgent: input.urgent,
        optionalNotes: input.optionalNotes || null,
        imagePath: input.imagePath,
        status: ReportStatus.DRAFT,
        severity: ai.analysis.severity as Severity,
        detectedIssueType: ai.analysis.detectedIssueType,
        confidenceScore: ai.analysis.confidenceScore,
        suggestedResponsibleParty: ai.analysis.suggestedResponsibleParty,
        missingDetails: ai.analysis.missingDetails,
        formalEmail: ai.messages.formalEmail,
        smsMessage: ai.messages.smsMessage,
        printableReport: ai.messages.printableReport,
        followUpMessage: ai.messages.followUpMessage,
        recipientConfirmed: recipientConfirmation.verified,
        selectedContactSnapshot: selectedContact,
        emergencyAcknowledged: recipientConfirmation.emergencyAcknowledged,
        contacts: {
          create: contacts
        },
        routingDecision: {
          create: {
            confidenceScore: routingDecision.confidenceScore,
            explanation: routingDecision.explanation,
            fallbackWarnings: routingDecision.fallbackWarnings,
            manualReviewRequired: routingDecision.manualReviewRequired,
            emergencyWarningRequired: routingDecision.emergencyWarningRequired,
            selectedContactSnapshot: selectedContact,
            userVerifiedContact: recipientConfirmation.verified
          }
        },
        statusHistory: {
          create: {
            status: ReportStatus.DRAFT,
            note: "Report saved as a draft."
          }
        }
      },
      include: {
        contacts: true,
        routingDecision: true,
        statusHistory: { orderBy: { createdAt: "asc" } }
      }
    });

    return NextResponse.json({ report: toReportDTO(report) }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not save report." }, { status: 500 });
  }
}
