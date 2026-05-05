import { NextResponse } from "next/server";
import { DEMO_COOKIE, getOrCreateDemoUser } from "@/lib/auth";

export async function POST() {
  const user = await getOrCreateDemoUser();
  const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });

  response.cookies.set(DEMO_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
