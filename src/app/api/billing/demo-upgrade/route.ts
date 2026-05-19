import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { entitlementService } from "@/lib/billing/entitlementService";

const schema = z.object({
  plan: z.enum(["pro_monthly", "pro_annual"])
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  await entitlementService.setDemoProEntitlement(user.id, parsed.data.plan);
  return NextResponse.json({ entitlement: await entitlementService.getEntitlementSummary(user.id) });
}
