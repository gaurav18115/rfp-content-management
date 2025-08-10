"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function EmailConfirmationHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            const code = searchParams.get("code");

            if (!code) return;

            console.log("Processing email confirmation with code:", code);

            try {
                const supabase = createClient();

                // Exchange the code for a session
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);

                if (error) {
                    console.error("Error exchanging code for session:", error);
                    // Redirect to error page
                    router.push(`/auth/error?error=${encodeURIComponent(error.message)}`);
                    return;
                }

                if (data.session) {
                    console.log("Email confirmation successful, user is now authenticated");

                    // Redirect to dashboard (you can add role-based logic here later)
                    router.push("/dashboard");
                } else {
                    console.log("No session created, redirecting to login");
                    router.push("/auth/login");
                }
            } catch (error) {
                console.error("Exception during email confirmation:", error);
                router.push(`/auth/error?error=${encodeURIComponent('Email confirmation failed')}`);
            }
        };

        handleEmailConfirmation();
    }, [searchParams, router]);

    // This component doesn't render anything visible
    return null;
} 