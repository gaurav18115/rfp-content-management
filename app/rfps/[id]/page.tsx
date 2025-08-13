import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { RFPDetail } from '@/components/rfp/rfp-detail';
import { SuccessMessage } from '@/components/ui/success-message';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IRFP } from '@/types/rfp';

interface RFPDetailPageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        success?: string;
        error?: string;
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
        .single();

    if (error || !rfp) {
        return null;
    }

    return rfp;
}

export default async function RFPDetailPage({ params, searchParams }: RFPDetailPageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const rfp = await getRFP(resolvedParams.id);

    if (!rfp) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {resolvedSearchParams.success === 'response-submitted' && (
                <div className="mb-6">
                    <SuccessMessage message="Your response has been submitted successfully! The buyer will review it and get back to you." />
                </div>
            )}
            {resolvedSearchParams.error === 'already-responded' && (
                <div className="mb-6">
                    <Alert variant="destructive">
                        <AlertDescription>You have already submitted a response to this RFP.</AlertDescription>
                    </Alert>
                </div>
            )}
            <RFPDetail rfp={rfp} />
        </div>
    );
}