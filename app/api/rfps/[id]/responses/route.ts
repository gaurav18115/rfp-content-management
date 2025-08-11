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

        // Check if user has supplier role
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

        if (profile.role !== 'supplier') {
            return NextResponse.json(
                { error: "Only suppliers can submit proposals" },
                { status: 403 }
            );
        }

        // Parse the request body
        const body = await req.json();
        const { proposal, budget, timeline, experience } = body;

        // Validate required fields
        if (!proposal || !budget || !timeline) {
            return NextResponse.json(
                { error: "Proposal, budget, and timeline are required" },
                { status: 400 }
            );
        }

        // Check if RFP exists and is published
        const { data: rfp, error: rfpError } = await supabase
            .from('rfps')
            .select('id, status, deadline')
            .eq('id', rfpId)
            .eq('status', 'published')
            .single();

        if (rfpError) {
            if (rfpError.code === 'PGRST116') {
                return NextResponse.json(
                    { error: "RFP not found" },
                    { status: 404 }
                );
            }
            console.error("RFP fetch error:", rfpError);
            return NextResponse.json(
                { error: "Failed to fetch RFP" },
                { status: 500 }
            );
        }

        // Check if RFP is expired
        if (new Date(rfp.deadline) < new Date()) {
            return NextResponse.json(
                { error: "RFP has expired and is no longer accepting proposals" },
                { status: 400 }
            );
        }

        // Check if user has already submitted a proposal for this RFP
        const { data: existingResponse, error: checkError } = await supabase
            .from('rfp_responses')
            .select('id')
            .eq('rfp_id', rfpId)
            .eq('supplier_id', user.id)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error("Response check error:", checkError);
            return NextResponse.json(
                { error: "Failed to check existing response" },
                { status: 500 }
            );
        }

        if (existingResponse) {
            return NextResponse.json(
                { error: "You have already submitted a proposal for this RFP" },
                { status: 400 }
            );
        }

        // Insert the response
        const { data: response, error: insertError } = await supabase
            .from('rfp_responses')
            .insert({
                rfp_id: rfpId,
                supplier_id: user.id,
                proposal,
                budget: parseFloat(budget.replace(/[^0-9.]/g, '')) || null,
                timeline,
                experience: experience || null,
                status: 'submitted',
                submitted_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (insertError) {
            console.error("Response insert error:", insertError);
            return NextResponse.json(
                { error: "Failed to submit proposal" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Proposal submitted successfully",
            response
        }, { status: 201 });

    } catch (error) {
        console.error("Response submission error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 