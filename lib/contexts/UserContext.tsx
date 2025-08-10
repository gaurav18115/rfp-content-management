"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export type UserProfile = {
    id: string;
    email: string;
    role: "buyer" | "supplier";
    company_name?: string;
    contact_phone?: string;
    created_at?: string;
    updated_at?: string;
};

type UserContextType = {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    refreshProfile: () => Promise<void>;
    signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const fetchProfile = async (userId: string) => {
        try {
            setError(null);
            const { data, error: profileError } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (profileError) {
                console.error("Profile fetch error:", profileError);
                // Don't throw error here, just log it
                return;
            }

            setProfile(data);
        } catch (err) {
            console.error("Profile fetch error:", err);
            // Don't set error state here, just log it
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
        } catch (err) {
            console.error("Sign out error:", err);
        }
    };

    useEffect(() => {
        let mounted = true;

        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (mounted) {
                    setUser(session?.user ?? null);
                    if (session?.user) {
                        await fetchProfile(session.user.id);
                    }
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Failed to get session");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (mounted) {
                    setUser(session?.user ?? null);
                    if (session?.user) {
                        await fetchProfile(session.user.id);
                    } else {
                        setProfile(null);
                    }
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const value: UserContextType = {
        user,
        profile,
        loading,
        error,
        refreshProfile,
        signOut,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
} 