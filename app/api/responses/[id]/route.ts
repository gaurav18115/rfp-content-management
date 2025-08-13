import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const supabase = await createClient();
        const { id: responseId } = await params;

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

        // Only buyers can view response details
        if (profile.role !== 'buyer') {
            return NextResponse.json({ error: 'Access denied. Only buyers can view response details.' }, { status: 403 });
        }

        // Get the response with RFP details
        const { data: response, error: responseError } = await supabase
            .from('rfp_responses')
            .select(`
                *,
                rfps!inner(
                    id,
                    title,
                    created_by
                ),
                user_profiles!rfp_responses_supplier_id_fkey(
                    first_name,
                    last_name,
                    company_name
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
                return NextResponse.json({ error: 'Access denied. You can only view responses to your own RFPs.' }, { status: 403 });
            }
        } else {
            return NextResponse.json({ error: 'Invalid RFP data' }, { status: 500 });
        }

        // Format the response data
        const formattedResponse = {
            id: response.id,
            rfp_id: response.rfp_id,
            rfp_title: response.rfps?.title || 'Unknown RFP',
            supplier_id: response.supplier_id,
            supplier_name: response.user_profiles ?
                `${response.user_profiles.first_name || ''} ${response.user_profiles.last_name || ''}`.trim() || 'Unknown Supplier' :
                'Unknown Supplier',
            supplier_company: response.user_profiles?.company_name || 'Unknown Company',
            proposal: response.proposal,
            budget: response.budget,
            timeline: response.timeline,
            experience: response.experience,
            status: response.status,
            submitted_at: response.submitted_at,
            reviewed_at: response.reviewed_at,
            reviewed_by: response.reviewed_by,
            rejection_reason: response.rejection_reason
        };

        return NextResponse.json({
            response: formattedResponse
        });

    } catch (error) {
        console.error('Unexpected error in GET /api/responses/[id]:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 