import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Test basic connection - use getUser() for security
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        // Test if we can access the auth settings
        const { data: settings, error: settingsError } = await supabase.auth.getUser();

        return NextResponse.json({
            success: true,
            message: "Supabase connection test",
            user: user ? {
                userId: user.id,
                email: user.email,
                emailConfirmed: user.email_confirmed_at
            } : null,
            settings: settings?.user ? {
                id: settings.user.id,
                email: settings.user.email,
                emailConfirmed: settings.user.email_confirmed_at
            } : null,
            userError: userError?.message,
            settingsError: settingsError?.message,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Test endpoint error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
} 