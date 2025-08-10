import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Create a service role client for admin operations
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get the user by email
        const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

        if (userError) {
            return NextResponse.json(
                { error: userError.message },
                { status: 400 }
            );
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Confirm the user's email
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
        );

        if (confirmError) {
            return NextResponse.json(
                { error: confirmError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: "Email confirmed successfully",
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        console.error("Confirm email error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 