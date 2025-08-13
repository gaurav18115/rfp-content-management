import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get user profile to include role
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role, company_name, first_name, last_name')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Profile fetch error:', profileError);
            // Return user without profile if profile doesn't exist
            return NextResponse.json({ 
                user: {
                    ...user,
                    role: null
                }
            });
        }

        return NextResponse.json({ 
            user: {
                ...user,
                role: profile?.role,
                company_name: profile?.company_name,
                first_name: profile?.first_name,
                last_name: profile?.last_name
            }
        });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 