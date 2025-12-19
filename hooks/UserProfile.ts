// hooks/useUserPortfolio.ts
import { useCallback, useEffect, useState } from "react";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  profile?: string;
  subscription?: string;
}

export function useUserProfile(userId?: string) {
  const [user, setUser] = useState<UserPortfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users?userId=${userId}`);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch user");
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
