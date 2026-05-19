import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { billingService } from "@/lib/billing/billingService";

const checkoutSchema = z.object({
  plan: z.enum(["pro_monthly", "pro_annual"])
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid billing plan." }, { status: 400 });
  }

  const checkout = billingService.createCheckoutIntent(parsed.data.plan);
  return NextResponse.json({ checkout });
}
