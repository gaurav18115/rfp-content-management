"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function EmailConfirmationHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            const code = searchParams.get("code");
            const email = searchParams.get("email");

            // If we have email confirmation parameters, process them directly
            if (code && email) {
                console.log("Processing email confirmation with code:", code, "and email:", email);

                try {
                    const response = await fetch('/api/auth/confirm-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, code }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        console.log("Email confirmed successfully:", result);
                        // Redirect to success page or dashboard
                        router.push('/auth/sign-up-success');
                    } else {
                        console.error("Error during email confirmation:", result.error);
                        router.push(`/auth/error?error=${encodeURIComponent(result.error || 'Email confirmation failed')}`);
                    }
                } catch (error) {
                    console.error("Exception during email confirmation:", error);
                    router.push(`/auth/error?error=${encodeURIComponent('Email confirmation failed')}`);
                }
            }
        };

        handleEmailConfirmation();
    }, [searchParams, router]);

    // This component doesn't render anything visible
    return null;
}