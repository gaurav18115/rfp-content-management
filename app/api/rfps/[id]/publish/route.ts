import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { id: rfpId } = await params;

        // Get the current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user has buyer role
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json(
                { error: "User profile not found" },
                { status: 404 }
            );
        }

        if (profile.role !== 'buyer') {
            return NextResponse.json(
                { error: "Only buyers can publish RFPs" },
                { status: 403 }
            );
        }

        // First, check if the RFP exists and user has access
        const { data: existingRfp, error: fetchError } = await supabase
            .from('rfps')
            .select('id, status, created_by')
            .eq('id', rfpId)
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

        // Check if user is the creator
        if (existingRfp.created_by !== user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        // Check if RFP is in draft status (only allow publishing drafts)
        if (existingRfp.status !== 'draft') {
            return NextResponse.json(
                { error: "Only draft RFPs can be published" },
                { status: 400 }
            );
        }

        // Use the database function to publish the RFP
        const { data: publishResult, error: publishError } = await supabase
            .rpc('publish_rfp', { rfp_uuid: rfpId });

        if (publishError) {
            console.error("RFP publish error:", publishError);
            return NextResponse.json(
                { error: "Failed to publish RFP" },
                { status: 500 }
            );
        }

        if (!publishResult) {
            return NextResponse.json(
                { error: "Failed to publish RFP. It may not exist or you may not have permission." },
                { status: 400 }
            );
        }

        // Get the updated RFP data
        const { data: updatedRfp, error: getError } = await supabase
            .from('rfps')
            .select('*')
            .eq('id', rfpId)
            .single();

        if (getError) {
            console.error("Error fetching updated RFP:", getError);
            // Still return success since the publish operation succeeded
            return NextResponse.json({
                success: true,
                message: "RFP published successfully",
                rfp: { id: rfpId, status: 'published' }
            });
        }

        return NextResponse.json({
            success: true,
            message: "RFP published successfully",
            rfp: updatedRfp
        });

    } catch (error) {
        console.error("RFP publish error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 