import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PUT(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const supabase = await createClient();
        const { id: responseId } = await params;

        // Get the request body
        const { rejection_reason } = await request.json();

        // Validate rejection reason
        if (!rejection_reason || rejection_reason.trim().length === 0) {
            return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
        }

        // Get the authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user profile to check role
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        // Only buyers can reject responses
        if (profile.role !== 'buyer') {
            return NextResponse.json({ error: 'Access denied. Only buyers can reject responses.' }, { status: 403 });
        }

        // Get the response to verify ownership
        const { data: response, error: responseError } = await supabase
            .from('rfp_responses')
            .select(`
                id,
                rfp_id,
                rfps!inner(
                    id,
                    created_by
                )
            `)
            .eq('id', responseId)
            .single();

        if (responseError || !response) {
            return NextResponse.json({ error: 'Response not found' }, { status: 404 });
        }

        // Verify that the buyer owns the RFP
        if (response.rfps && typeof response.rfps === 'object' && 'created_by' in response.rfps) {
            if (response.rfps.created_by !== user.id) {
                return NextResponse.json({ error: 'Access denied. You can only reject responses to your own RFPs.' }, { status: 403 });
            }
        } else {
            return NextResponse.json({ error: 'Invalid RFP data' }, { status: 500 });
        }

        // Update the response status to rejected
        const { error: updateError } = await supabase
            .from('rfp_responses')
            .update({
                status: 'rejected',
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.id,
                rejection_reason: rejection_reason.trim()
            })
            .eq('id', responseId);

        if (updateError) {
            console.error('Error updating response:', updateError);
            return NextResponse.json({ error: 'Failed to reject response' }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Response rejected successfully',
            response_id: responseId,
            rejection_reason: rejection_reason.trim()
        });

    } catch (error) {
        console.error('Unexpected error in PUT /api/responses/[id]/reject:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}