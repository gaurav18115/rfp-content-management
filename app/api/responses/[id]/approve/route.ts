import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const responseId = params.id;

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

        // Only buyers can approve responses
        if (profile.role !== 'buyer') {
            return NextResponse.json({ error: 'Access denied. Only buyers can approve responses.' }, { status: 403 });
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
        if (response.rfps.created_by !== user.id) {
            return NextResponse.json({ error: 'Access denied. You can only approve responses to your own RFPs.' }, { status: 403 });
        }

        // Update the response status to approved
        const { error: updateError } = await supabase
            .from('rfp_responses')
            .update({
                status: 'approved',
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.id
            })
            .eq('id', responseId);

        if (updateError) {
            console.error('Error updating response:', updateError);
            return NextResponse.json({ error: 'Failed to approve response' }, { status: 500 });
        }

        return NextResponse.json({ 
            message: 'Response approved successfully',
            response_id: responseId
        });

    } catch (error) {
        console.error('Unexpected error in PUT /api/responses/[id]/approve:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}