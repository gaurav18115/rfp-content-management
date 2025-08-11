"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RFPDetail } from "@/components/rfp/rfp-detail";
import { IRFP } from "@/types/rfp";

export default function RfpDetailPage() {
    const params = useParams();
    const rfpId = params.id as string;

    const [rfp, setRfp] = useState<IRFP | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRfpData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/rfps/${rfpId}/view`);

            if (!response.ok) {
                if (response.status === 404) {
                    setError('RFP not found');
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to fetch RFP');
                }
                return;
            }

            const data = await response.json();
            setRfp(data.rfp);
        } catch (error) {
            console.error('Error fetching RFP:', error);
            setError('Failed to load RFP data');
        } finally {
            setIsLoading(false);
        }
    }, [rfpId]);

    useEffect(() => {
        fetchRfpData();
    }, [fetchRfpData]);

    if (isLoading) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
                <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading RFP details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error Loading RFP</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <div className="flex gap-2 justify-center">
                        <Button onClick={fetchRfpData} variant="outline">
                            Try Again
                        </Button>
                        <Button asChild>
                            <Link href="/rfps">
                                <ArrowLeft size="16" className="mr-2" />
                                Back to RFPs
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!rfp) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">RFP Not Found</h3>
                    <p className="text-muted-foreground mb-4">
                        The RFP you&apos;re looking for doesn&apos;t exist or may have been removed.
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

    // Check if RFP is published and accessible
    if (rfp.status !== 'published') {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">RFP Not Available</h3>
                    <p className="text-muted-foreground mb-4">
                        This RFP is not currently published and cannot be viewed.
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
        <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
            {/* Back Navigation */}
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm">
                    <Link href="/rfps">
                        <ArrowLeft size="16" className="mr-2" />
                        Back to RFPs
                    </Link>
                </Button>
            </div>

            {/* RFP Detail Component */}
            <RFPDetail rfp={rfp} />
        </div>
    );
} 