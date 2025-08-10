import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
        );

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { error: "No user found" },
                { status: 401 }
            );
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
            return NextResponse.json(
                { error: profileError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                created_at: user.created_at,
            },
            profile,
        });
    } catch (error) {
        console.error("Error getting profile:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 