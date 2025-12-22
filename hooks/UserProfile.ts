import { useCallback, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

interface Subscription {
  id: string;
  status: string;
  plan: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  profile?: number;
  image?: string | null;
  subscription?: Subscription;
}

export function useUserProfile() {
  const { user } = useUser(); // ⬅️ ensure correct casing
  const userId = user?.id;

  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users/${userId}`);

      let json;
      try {
        json = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(json?.message || "Failed to fetch user");
      }

      setData(json.user);
    } catch (err: any) {
      console.error("useUserProfile error:", err);
      setError(err.message || "Unknown error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchUser();
  }, [userId, fetchUser]);

  return {
    user: data,
    loading,
    error,
    refetch: fetchUser,
    isReady: Boolean(userId),
  };
}
