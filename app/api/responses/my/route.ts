import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user profile to check role
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        console.log('User ID:', user.id);
        console.log('Profile data:', profile);
        console.log('Profile error:', profileError);

        if (profileError || profile?.role !== 'supplier') {
            console.log('Access denied - role:', profile?.role);
            return NextResponse.json(
                { error: 'Only suppliers can view their responses' },
                { status: 403 }
            );
        }

        // Get all responses by this supplier with RFP details
        const { data: responses, error: responsesError } = await supabase
            .from('rfp_responses')
            .select(`
                *,
                rfps (
                    id,
                    title,
                    company,
                    category,
                    deadline,
                    status,
                    budget_range
                )
            `)
            .eq('supplier_id', user.id)
            .order('submitted_at', { ascending: false });

        console.log('Responses query result:', { responses, responsesError });
        console.log('Number of responses found:', responses?.length || 0);

        if (responsesError) {
            console.error('Error fetching responses:', responsesError);
            return NextResponse.json(
                { error: 'Failed to fetch responses' },
                { status: 500 }
            );
        }

        // Transform the data to match the expected format
        const transformedResponses = responses?.map(response => ({
            id: response.id,
            rfpId: response.rfp_id,
            rfpTitle: response.rfps?.title || 'Unknown RFP',
            company: response.rfps?.company || 'Unknown Company',
            category: response.rfps?.category || 'Unknown',
            status: response.status,
            submittedAt: response.submitted_at,
            proposal: response.proposal,
            budget: response.budget,
            timeline: response.timeline,
            experience: response.experience,
            rfpStatus: response.rfps?.status,
            rfpDeadline: response.rfps?.deadline,
            budgetRange: response.rfps?.budget_range
        })) || [];

        return NextResponse.json({
            success: true,
            responses: transformedResponses
        });

    } catch (error) {
        console.error('Error in responses fetch:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}