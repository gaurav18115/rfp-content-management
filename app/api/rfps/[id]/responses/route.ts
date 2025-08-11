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

        // Get RFP data to verify it's published and not expired
        const { data: rfp, error: rfpError } = await supabase
            .from('rfps')
            .select('*')
            .eq('id', rfpId)
            .eq('status', 'published')
            .single();

        if (rfpError || !rfp) {
            return NextResponse.json(
                { error: "RFP not found or not published" },
                { status: 404 }
            );
        }

        // Check if RFP has expired
        if (new Date(rfp.deadline) < new Date()) {
            return NextResponse.json(
                { error: "RFP has expired and is no longer accepting proposals" },
                { status: 400 }
            );
        }

        // Check if supplier has already submitted a proposal for this RFP
        const { data: existingResponse } = await supabase
            .from('rfp_responses')
            .select('id')
            .eq('rfp_id', rfpId)
            .eq('supplier_id', user.id)
            .single();

        if (existingResponse) {
            return NextResponse.json(
                { error: "You have already submitted a proposal for this RFP" },
                { status: 400 }
            );
        }

        // Parse the request body
        const body = await req.json();
        const { proposal, budget, timeline, experience } = body;

        // Validate required fields
        if (!proposal || !budget || !timeline || !experience) {
            return NextResponse.json(
                { error: "All fields are required: proposal, budget, timeline, experience" },
                { status: 400 }
            );
        }

        // Validate budget is a positive number
        if (typeof budget !== 'number' || budget <= 0) {
            return NextResponse.json(
                { error: "Budget must be a positive number" },
                { status: 400 }
            );
        }

        // Create the response in the database
        const { data: response, error: insertError } = await supabase
            .from('rfp_responses')
            .insert({
                rfp_id: rfpId,
                supplier_id: user.id,
                proposal: proposal.trim(),
                budget: budget,
                timeline: timeline.trim(),
                experience: experience.trim(),
                status: 'submitted'
            })
            .select()
            .single();

        if (insertError) {
            console.error("Response creation error:", insertError);
            return NextResponse.json(
                { error: "Failed to submit proposal" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Proposal submitted successfully",
            response: {
                id: response.id,
                rfp_id: response.rfp_id,
                status: response.status,
                submitted_at: response.submitted_at
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Response submission error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 