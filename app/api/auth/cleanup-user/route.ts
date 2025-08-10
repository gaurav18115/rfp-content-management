import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Only allow cleanup of test users (for testing purposes)
        if (!email.includes('@test.com') && !email.includes('@gmail.com')) {
            return NextResponse.json(
                { error: "Only test users can be cleaned up" },
                { status: 403 }
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

        // Delete the user profile first (if it exists)
        try {
            await supabase
                .from("user_profiles")
                .delete()
                .eq("id", user.id);
        } catch (profileError) {
            // Profile might not exist, which is fine
            console.log(`Profile cleanup note: ${profileError instanceof Error ? profileError.message : 'Unknown error'}`);
        }

        // Delete the user account
        const { error: deleteError } = await supabase.auth.admin.deleteUser(
            user.id
        );

        if (deleteError) {
            return NextResponse.json(
                { error: deleteError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: "Test user cleaned up successfully",
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        console.error("Cleanup user error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 