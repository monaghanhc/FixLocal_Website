import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { entitlementService } from "@/lib/billing/entitlementService";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const entitlement = await entitlementService.getEntitlementSummary(user.id);
  return NextResponse.json({ entitlement });
}
