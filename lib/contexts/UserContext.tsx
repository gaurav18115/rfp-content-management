"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, profileApi } from "@/lib/api";
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

    const fetchProfile = async () => {
        try {
            setError(null);
            const { profile: profileData } = await profileApi.getMe();
            setProfile(profileData);
        } catch (err) {
            console.error("Profile fetch error:", err);
            // Don't set error state here, just log it
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile();
        }
    };

    const signOut = async () => {
        try {
            await authApi.logout();
            setUser(null);
            setProfile(null);
        } catch (err) {
            console.error("Sign out error:", err);
        }
    };

    useEffect(() => {
        let mounted = true;

        // Get initial user data
        const getInitialUser = async () => {
            try {
                const { user } = await authApi.getUser();

                if (mounted) {
                    setUser(user ?? null);
                    if (user) {
                        await fetchProfile();
                    }
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Failed to get user");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        getInitialUser();

        // Set up less frequent polling for user changes since we can't use real-time subscriptions
        const interval = setInterval(async () => {
            if (mounted) {
                try {
                    const { user } = await authApi.getUser();
                    if (user?.id !== user?.id) {
                        setUser(user ?? null);
                        if (user) {
                            await fetchProfile();
                        } else {
                            setProfile(null);
                        }
                    }
                } catch (err) {
                    console.error("User check error:", err);
                }
            }
        }, 30000); // Check every 30 seconds instead of 5 seconds

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [user?.id]);

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