import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password, role } = await req.json();

        if (!email || !password || !role) {
            return NextResponse.json(
                { error: "Email, password, and role are required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        console.log("Signup attempt:", { email, role });

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role: role,
                },
            },
        });

        if (error) {
            console.error("Supabase signup error:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        // If signup was successful, log the result
        console.log("Signup successful:", {
            userId: data.user?.id,
            emailConfirmed: data.user?.email_confirmed_at,
            session: !!data.session
        });

        return NextResponse.json({
            user: data.user,
            session: data.session,
            message: "Account created successfully! You can now sign in.",
            requiresConfirmation: false
        });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 