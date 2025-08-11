import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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
        { error: 'Unauthorized' },
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
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    if (profile.role !== 'supplier') {
      return NextResponse.json(
        { error: 'Only suppliers can submit RFP responses' },
        { status: 403 }
      );
    }

    // Get request body
    const { proposal, budget, timeline, experience } = await req.json();

    // Validate required fields
    if (!proposal || !proposal.trim()) {
      return NextResponse.json(
        { error: 'Proposal is required' },
        { status: 400 }
      );
    }

    // Check if RFP exists and is published
    const { data: rfp, error: rfpError } = await supabase
      .from('rfps')
      .select('id, status, deadline')
      .eq('id', rfpId)
      .single();

    if (rfpError || !rfp) {
      return NextResponse.json(
        { error: 'RFP not found' },
        { status: 404 }
      );
    }

    if (rfp.status !== 'published') {
      return NextResponse.json(
        { error: 'Can only respond to published RFPs' },
        { status: 400 }
      );
    }

    // Check if deadline has passed
    if (new Date(rfp.deadline) < new Date()) {
      return NextResponse.json(
        { error: 'RFP deadline has passed' },
        { status: 400 }
      );
    }

    // Check if supplier has already submitted a response
    const { data: existingResponse, error: checkError } = await supabase
      .from('rfp_responses')
      .select('id')
      .eq('rfp_id', rfpId)
      .eq('supplier_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing response:', checkError);
      return NextResponse.json(
        { error: 'Failed to check existing response' },
        { status: 500 }
      );
    }

    if (existingResponse) {
      return NextResponse.json(
        { error: 'You have already submitted a proposal for this RFP' },
        { status: 400 }
      );
    }

    // Insert the response
    const { data: response, error: insertError } = await supabase
      .from('rfp_responses')
      .insert({
        rfp_id: rfpId,
        supplier_id: user.id,
        proposal: proposal.trim(),
        budget: budget?.trim() || null,
        timeline: timeline?.trim() || null,
        experience: experience?.trim() || null,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting response:', insertError);
      return NextResponse.json(
        { error: 'Failed to submit response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Response submitted successfully',
      response: {
        id: response.id,
        status: response.status,
        submitted_at: response.submitted_at
      }
    });

  } catch (error) {
    console.error('RFP response submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}