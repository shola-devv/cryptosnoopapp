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

  useEffect(() => {
    if (plan === "free") {
      router.replace("/home/upgrade?restricted=true");
    }
  }, [plan, router]);

  // 🔥 UI flash: Always show the UI immediately
  // while plan is null or even after plan === "free"
  return <>{children}</>;
}
