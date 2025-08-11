import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { id: rfpId } = await params;

        // Get RFP data (only published RFPs are publicly viewable)
        const { data: rfp, error: fetchError } = await supabase
            .from('rfps')
            .select(`
                *,
                user_profiles!rfps_created_by_fkey(
                    company_name,
                    first_name,
                    last_name
                )
            `)
            .eq('id', rfpId)
            .eq('status', 'published')
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return NextResponse.json(
                    { error: "RFP not found" },
                    { status: 404 }
                );
            }
            console.error("RFP fetch error:", fetchError);
            return NextResponse.json(
                { error: "Failed to fetch RFP" },
                { status: 500 }
            );
        }

        return NextResponse.json({ rfp });

    } catch (error) {
        console.error("RFP fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 