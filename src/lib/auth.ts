import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export const DEMO_COOKIE = "fixlocal_demo_user";
export const DEMO_EMAIL = "demo@fixlocal.ai";

export async function getOrCreateDemoUser() {
  return prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { isDemo: true, name: "Demo User" },
    create: {
      email: DEMO_EMAIL,
      name: "Demo User",
      isDemo: true
    }
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(DEMO_COOKIE)?.value;

  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId }
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
