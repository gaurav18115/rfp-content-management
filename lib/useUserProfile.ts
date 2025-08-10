import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { authApi, profileApi } from "@/lib/api";

export type UserProfile = {
  id: string;
  email: string;
  role: "buyer" | "supplier";
  first_name?: string;
  last_name?: string;
  company_name?: string;
  contact_phone?: string;
  created_at?: string;
  updated_at?: string;
};

export type UseUserProfileResult = {
  loading: boolean;
  error: string | null;
  profile: UserProfile | null;
  authUser: User | null;
};

export function useUserProfile(): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const { user } = await authApi.getUser();
        setAuthUser(user);
        if (!user) {
          setProfile(null);
          setLoading(false);
          return;
        }
        const { profile: profileData } = await profileApi.getMe();
        if (mounted) setProfile(profileData);
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to fetch user profile");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  return { loading, error, profile, authUser };
}
