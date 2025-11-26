"use client";

import { useEffect, useState } from "react";

export function useUserPlan() {
  const [plan, setPlan] = useState<"free" | "premium" | null>(null);

  useEffect(() => {
    fetch("/api/user/plan")
      .then(res => res.json())
      .then(data => {
        setPlan(data.plan);
      });
  }, []);

  return plan; // null = loading, else "free" | "premium"
}
