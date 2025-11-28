"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

export function useUserProfile() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const userId = session?.user?.id;

  // --- Fetcher function (can be called on demand) ---
  const refresh = useCallback(async () => {
    if (!userId) return null;

    try {
      setLoading(true);
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setProfileData(data);
      return data;
    } catch (e) {
      console.error("Failed to fetch user profile", e);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // --- Run once automatically when userId becomes available ---
  useEffect(() => {
    if (userId) refresh();
  }, [userId, refresh]);

  return {
    profileData,  // full profile returned by API
    loading,  // loading state
    refresh,  // <-- call to refetch on demand
  };
}
