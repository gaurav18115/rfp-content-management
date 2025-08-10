"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmEmail } from "@/app/actions/auth";

export function EmailConfirmationHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            const code = searchParams.get("code");

            if (!code) return;

            console.log("Processing email confirmation with code:", code);

            try {
                const result = await confirmEmail(code);

                if (result?.error) {
                    console.error("Error during email confirmation:", result.error);
                    router.push(`/auth/error?error=${encodeURIComponent(result.error)}`);
                }
                // If successful, the server action will handle the redirect
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