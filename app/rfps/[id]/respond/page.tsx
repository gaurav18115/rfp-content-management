import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ResponseSubmissionForm } from '@/components/rfp/response-submission-form';
import { IRFP } from '@/types/rfp';

interface ResponseSubmissionPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getRFP(id: string): Promise<IRFP | null> {
    const supabase = await createClient();
    
    const { data: rfp, error } = await supabase
        .from('rfps')
        .select(`
            *,
            user_profiles (
                company_name,
                first_name,
                last_name
            )
        `)
        .eq('id', id)
        .eq('status', 'published')
        .single();

    if (error || !rfp) {
        return null;
    }

    return rfp;
}

async function checkExistingResponse(rfpId: string, userId: string): Promise<boolean> {
    const supabase = await createClient();
    
    const { data: existingResponse } = await supabase
        .from('rfp_responses')
        .select('id')
        .eq('rfp_id', rfpId)
        .eq('supplier_id', userId)
        .single();

    return !!existingResponse;
}

export default async function ResponseSubmissionPage({ params }: ResponseSubmissionPageProps) {
    const { id } = await params;
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
        redirect('/auth/login');
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profileError || profile?.role !== 'supplier') {
        redirect('/dashboard');
    }

    // Get RFP details
    const rfp = await getRFP(id);
    
    if (!rfp) {
        notFound();
    }

    // Check if user has already responded
    const hasResponded = await checkExistingResponse(id, user.id);
    
    if (hasResponded) {
        redirect(`/rfps/${id}?error=already-responded`);
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Submit Response to RFP</h1>
                    <p className="text-lg text-muted-foreground">
                        {rfp.title}
                    </p>
                </div>
                
                <ResponseSubmissionForm rfp={rfp} />
            </div>
        </div>
    );
}