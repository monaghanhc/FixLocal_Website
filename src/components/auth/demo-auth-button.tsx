"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type DemoAuthButtonProps = {
  redirectTo?: string;
  children?: React.ReactNode;
  className?: string;
};

export function DemoAuthButton({
  redirectTo = "/dashboard",
  children = "Continue as Demo User",
  className
}: DemoAuthButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function continueAsDemo() {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/demo", { method: "POST" });
      if (!response.ok) {
        throw new Error("Could not start demo session.");
      }
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start demo session.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={continueAsDemo}
      disabled={loading}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-civic-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
      {children}
    </button>
  );
}
