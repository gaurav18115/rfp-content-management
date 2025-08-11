import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Type for the simplified response from Supabase
interface SimpleResponse {
    id: string;
    rfp_id: string;
    supplier_id: string;
    proposal: string;
    budget: number;
    timeline: string;
    experience: string;
    status: string;
    submitted_at: string;
    reviewed_at: string | null;
    reviewed_by: string | null;
    rejection_reason: string | null;
}

export async function GET() {
    try {
        const supabase = await createClient();

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

        // Only buyers can view responses
        if (profile.role !== 'buyer') {
            return NextResponse.json({ error: 'Access denied. Only buyers can view responses.' }, { status: 403 });
        }

        // Fetch responses for RFPs created by this buyer
        const { data: responses, error: responsesError } = await supabase
            .from('rfp_responses')
            .select(`
                id,
                rfp_id,
                supplier_id,
                proposal,
                budget,
                timeline,
                experience,
                status,
                submitted_at,
                reviewed_at,
                reviewed_by,
                rejection_reason
            `)
            .order('submitted_at', { ascending: false });

        if (responsesError) {
            console.error('Error fetching responses:', responsesError);
            return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
        }

        // Debug: Log what we got from the database
        console.log('Raw responses from database:', responses);
        console.log('Number of responses:', responses?.length || 0);

        // For now, return basic response data without complex joins
        const transformedResponses = responses?.map((response: SimpleResponse) => ({
            id: response.id,
            rfp_id: response.rfp_id,
            rfp_title: 'RFP Title (to be fetched separately)',
            supplier_id: response.supplier_id,
            supplier_name: 'Supplier Name (to be fetched separately)',
            supplier_company: 'Company Name (to be fetched separately)',
            proposal: response.proposal,
            budget: response.budget,
            timeline: response.timeline,
            experience: response.experience,
            status: response.status,
            submitted_at: response.submitted_at,
            reviewed_at: response.reviewed_at,
            reviewed_by: response.reviewed_by,
            rejection_reason: response.rejection_reason,
        })) || [];

        return NextResponse.json({
            responses: transformedResponses,
            count: transformedResponses.length
        });

    } catch (error) {
        console.error('Unexpected error in GET /api/responses:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}