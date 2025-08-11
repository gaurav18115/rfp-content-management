import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { rfpUpdateSchema } from "@/lib/validations/rfp";

export async function GET(
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

        // Get RFP data
        const { data: rfp, error: fetchError } = await supabase
            .from('rfps')
            .select('*')
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

        // Check if user has access to this RFP (creator only)
        if (rfp.created_by !== user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
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

export async function PUT(
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

        // Parse and validate the request body
        const body = await req.json();
        const validationResult = rfpUpdateSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.issues
                },
                { status: 400 }
            );
        }

        const updateData = validationResult.data;

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

        // Check if RFP is in draft status (only allow editing drafts)
        if (existingRfp.status !== 'draft') {
            return NextResponse.json(
                { error: "Only draft RFPs can be edited" },
                { status: 400 }
            );
        }

        // Update the RFP
        const { data: updatedRfp, error: updateError } = await supabase
            .from('rfps')
            .update({
                ...updateData,
                updated_at: new Date().toISOString(),
            })
            .eq('id', rfpId)
            .select()
            .single();

        if (updateError) {
            console.error("RFP update error:", updateError);
            return NextResponse.json(
                { error: "Failed to update RFP" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "RFP updated successfully",
            rfp: updatedRfp
        });

    } catch (error) {
        console.error("RFP update error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 