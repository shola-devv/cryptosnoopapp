"use client";

import { useUserProfile } from "@/hooks/UserProfile";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

type PlanGuardProps = {
  children: ReactNode;
}

export default function PlanGuard({ children }: PlanGuardProps) {
  const { user } = useUserProfile();
  const plan = (user?.subscription?.plan as string) ?? "free";
  const router = useRouter();

  // Plan guard is disabled by default to allow all users access.
  // To restore the check, set the env var `NEXT_PUBLIC_PLAN_GUARD_ENABLED=true`.
  const planGuardEnabled = process.env.NEXT_PUBLIC_PLAN_GUARD_ENABLED === "true";

  useEffect(() => {
    if (!planGuardEnabled) return; // guard is disabled
    if (plan === "free") {
      router.replace("/home/upgrade?restricted=true");
    }
  }, [plan, router, planGuardEnabled]);

  // 🔥 UI flash: Always show the UI immediately
  // while plan is null or even after plan === "free"
  return <>{children}</>;
}
