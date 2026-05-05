import { NextResponse } from "next/server";
import { analyzeIssue } from "@/lib/ai";
import { suggestContacts } from "@/lib/contacts/directory";
import { getCurrentUser } from "@/lib/auth";
import { reportInputSchema } from "@/lib/validators/report";

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

    const ai = await analyzeIssue(parsed.data);
    const contacts = suggestContacts(parsed.data);

    return NextResponse.json({ ai, contacts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "AI analysis failed. The mock provider should recover on retry." },
      { status: 500 }
    );
  }
}
