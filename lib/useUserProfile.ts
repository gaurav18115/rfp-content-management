import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type UserProfile = {
  id: string;
  email: string;
  role: "buyer" | "supplier";
  company_name?: string;
  contact_phone?: string;
  created_at?: string;
  updated_at?: string;
};

export type UseUserProfileResult = {
  loading: boolean;
  error: string | null;
  profile: UserProfile | null;
  authUser: any | null;
};

export function useUserProfile(): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authUser, setAuthUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        setAuthUser(user);
        if (!user) {
          setProfile(null);
          setLoading(false);
          return;
        }
        const { data, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profileError) throw profileError;
        if (mounted) setProfile(data);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to fetch user profile");
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
