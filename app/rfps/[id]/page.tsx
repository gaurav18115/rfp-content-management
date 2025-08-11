"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RFPDetail } from "@/components/rfp/rfp-detail";
import { IRFP } from "@/types/rfp";
import Link from "next/link";

interface RFPDetailResponse {
    rfp: IRFP & {
        user_profiles?: {
            company_name?: string;
            first_name?: string;
            last_name?: string;
        };
    };
}

export default function RFPDetailPage() {
    const params = useParams();
    const rfpId = params.id as string;

    const [rfp, setRfp] = useState<RFPDetailResponse['rfp'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRFP = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/rfps/${rfpId}/view`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('RFP not found');
                    }
                    throw new Error('Failed to fetch RFP');
                }

                const data: RFPDetailResponse = await response.json();
                setRfp(data.rfp);
            } catch (err) {
                console.error('Error fetching RFP:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (rfpId) {
            fetchRFP();
        }
    }, [rfpId]);

    if (loading) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading RFP details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error Loading RFP</h3>
                    <p className="text-muted-foreground mb-4">
                        {error === 'RFP not found'
                            ? 'The RFP you&apos;re looking for doesn&apos;t exist or is not published.'
                            : error
                        }
                    </p>
                    <Button asChild>
                        <Link href="/rfps">
                            <ArrowLeft size="16" className="mr-2" />
                            Back to RFPs
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (!rfp) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">RFP Not Found</h3>
                    <p className="text-muted-foreground mb-4">
                        The RFP you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Button asChild>
                        <Link href="/rfps">
                            <ArrowLeft size="16" className="mr-2" />
                            Back to RFPs
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
            <RFPDetail rfp={rfp} />
        </div>
    );
} 