import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { entitlementService } from "@/lib/billing/entitlementService";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  await entitlementService.cancelDemoEntitlementAtPeriodEnd(user.id);
  return NextResponse.json({ entitlement: await entitlementService.getEntitlementSummary(user.id) });
}
