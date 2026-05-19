import { NextResponse } from "next/server";
import { analyzeIssue } from "@/lib/ai";
import { contactRoutingService } from "@/lib/contact-routing/service";
import { getCurrentUser } from "@/lib/auth";
import { reportInputSchema } from "@/lib/validators/report";
import { entitlementService } from "@/lib/billing/entitlementService";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Continue as the demo user before generating a report." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = reportInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid report details.", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const entitlement = await entitlementService.canGenerateReport(user.id);
    if (!entitlement.allowed) {
      return NextResponse.json(
        {
          error: entitlement.reason,
          entitlement
        },
        { status: 402 }
      );
    }

    const ai = await analyzeIssue(parsed.data);
    const routingDecision = contactRoutingService.route({
      imageClassificationResult: {
        category: ai.analysis.detectedIssueType,
        confidenceScore: ai.analysis.confidenceScore
      },
      userSelectedCategory: parsed.data.category,
      userNotes: `${parsed.data.description} ${parsed.data.optionalNotes ?? ""}`,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      address: parsed.data.address,
      city: parsed.data.city,
      county: parsed.data.county,
      state: parsed.data.state,
      zipCode: parsed.data.zip,
      urgent: parsed.data.urgent
    });
    await entitlementService.recordReportGeneration(user.id);
    const contacts = routingDecision.suggestedContacts;

    return NextResponse.json({ ai, contacts, routingDecision, entitlement });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "AI analysis failed. The mock provider should recover on retry." },
      { status: 500 }
    );
  }
}
