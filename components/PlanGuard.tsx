"use client";

import { useUserPlan } from "@/hooks/UserPlan";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PlanGuard({ children }) {
  const plan = "free" //useUserPlan();
  const router = useRouter();

  useEffect(() => {
    if (plan === "free") {
      router.replace("upgrade?restricted=true");
    }
  }, [plan, router]);

  // 🔥 UI flash: Always show the UI immediately
  // while plan is null or even after plan === "free"
  return <>{children}</>;
}
