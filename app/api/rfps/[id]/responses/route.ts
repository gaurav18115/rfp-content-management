import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();
        
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

        if (profileError || profile?.role !== 'supplier') {
            return NextResponse.json(
                { error: 'Only suppliers can submit responses' },
                { status: 403 }
            );
        }

        // Get RFP details and check if it's published
        const { data: rfp, error: rfpError } = await supabase
            .from('rfps')
            .select('id, status, deadline')
            .eq('id', params.id)
            .eq('status', 'published')
            .single();

        if (rfpError || !rfp) {
            return NextResponse.json(
                { error: 'RFP not found or not published' },
                { status: 404 }
            );
        }

        // Check if RFP deadline has passed
        if (new Date(rfp.deadline) < new Date()) {
            return NextResponse.json(
                { error: 'RFP deadline has passed' },
                { status: 400 }
            );
        }

        // Check if user has already responded
        const { data: existingResponse } = await supabase
            .from('rfp_responses')
            .select('id')
            .eq('rfp_id', params.id)
            .eq('supplier_id', user.id)
            .single();

        if (existingResponse) {
            return NextResponse.json(
                { error: 'You have already submitted a response to this RFP' },
                { status: 409 }
            );
        }

        // Get request body
        const body = await request.json();
        const { proposal, budget, timeline, experience } = body;

        // Validate required fields
        if (!proposal || !budget || !timeline || !experience) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate budget is a positive number
        if (isNaN(budget) || budget <= 0) {
            return NextResponse.json(
                { error: 'Budget must be a positive number' },
                { status: 400 }
            );
        }

        // Insert response
        const { data: response, error: insertError } = await supabase
            .from('rfp_responses')
            .insert({
                rfp_id: params.id,
                supplier_id: user.id,
                proposal: proposal.trim(),
                budget: parseFloat(budget),
                timeline: timeline.trim(),
                experience: experience.trim(),
                status: 'submitted'
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
                rfp_id: response.rfp_id,
                status: response.status,
                submitted_at: response.submitted_at
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error in response submission:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();
        
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

        if (profileError) {
            return NextResponse.json(
                { error: 'User profile not found' },
                { status: 404 }
            );
        }

        let responses;
        
        if (profile?.role === 'buyer') {
            // Buyers can see all responses to their RFPs
            const { data: rfp, error: rfpError } = await supabase
                .from('rfps')
                .select('id')
                .eq('id', params.id)
                .eq('created_by', user.id)
                .single();

            if (rfpError || !rfp) {
                return NextResponse.json(
                    { error: 'RFP not found or access denied' },
                    { status: 404 }
            );
            }

            const { data, error } = await supabase
                .from('rfp_responses')
                .select(`
                    *,
                    user_profiles (
                        company_name,
                        first_name,
                        last_name,
                        email
                    )
                `)
                .eq('rfp_id', params.id)
                .order('submitted_at', { ascending: false });

            if (error) {
                throw error;
            }

            responses = data;
        } else if (profile?.role === 'supplier') {
            // Suppliers can only see their own responses
            const { data, error } = await supabase
                .from('rfp_responses')
                .select('*')
                .eq('rfp_id', params.id)
                .eq('supplier_id', user.id)
                .order('submitted_at', { ascending: false });

            if (error) {
                throw error;
            }

            responses = data;
        } else {
            return NextResponse.json(
                { error: 'Invalid user role' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            responses
        });

    } catch (error) {
        console.error('Error fetching responses:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}