'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { IResponse } from '@/types/rfp';
import Link from 'next/link';

interface RFPActionsProps {
    rfpId: string;
    isExpired: boolean;
}

export function RFPActions({ rfpId, isExpired }: RFPActionsProps) {
    const [userResponse, setUserResponse] = useState<IResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        async function checkUserStatus() {
            const supabase = createClient();
            
            try {
                // Get current user
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    setIsLoading(false);
                    return;
                }

                // Get user profile
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setUserRole(profile.role);
                }

                // If user is a supplier, check if they've already responded
                if (profile?.role === 'supplier') {
                    const { data: response } = await supabase
                        .from('rfp_responses')
                        .select('*')
                        .eq('rfp_id', rfpId)
                        .eq('supplier_id', user.id)
                        .single();

                    if (response) {
                        setUserResponse(response);
                    }
                }

            } catch (error) {
                console.error('Error checking user status:', error);
            } finally {
                setIsLoading(false);
            }
        }

        checkUserStatus();
    }, [rfpId]);

    if (isLoading) {
        return (
            <div className="space-y-3">
                <Button disabled className="w-full">
                    Loading...
                </Button>
                <Button variant="outline" asChild className="w-full">
                    <Link href="/rfps">← Back to RFPs</Link>
                </Button>
            </div>
        );
    }

    // If user is not logged in, show login prompt
    if (!userRole) {
        return (
            <div className="space-y-3">
                <Button asChild className="w-full">
                    <Link href="/auth/login">Sign in to Submit Proposal</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                    <Link href="/rfps">← Back to RFPs</Link>
                </Button>
            </div>
        );
    }

    // If user is a buyer, show different actions
    if (userRole === 'buyer') {
        return (
            <div className="space-y-3">
                <Button variant="outline" asChild className="w-full">
                    <Link href={`/dashboard/responses?rfp=${rfpId}`}>View Responses</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                    <Link href="/rfps">← Back to RFPs</Link>
                </Button>
            </div>
        );
    }

    // If user is a supplier
    if (userRole === 'supplier') {
        // If they've already responded
        if (userResponse) {
            return (
                <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Response Submitted</span>
                        </div>
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <span>Status:</span>
                                <Badge variant="outline" className="text-xs">
                                    {userResponse.status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span>Submitted:</span>
                                <span className="text-green-700">
                                    {new Date(userResponse.submitted_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/dashboard/my-responses">View My Responses</Link>
                    </Button>
                    
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/rfps">← Back to RFPs</Link>
                    </Button>
                </div>
            );
        }

        // If they haven't responded and RFP is not expired
        if (!isExpired) {
            return (
                <div className="space-y-3">
                    <Button asChild className="w-full">
                        <Link href={`/rfps/${rfpId}/respond`}>Submit Proposal</Link>
                    </Button>
                    
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/rfps">← Back to RFPs</Link>
                    </Button>
                </div>
            );
        }

        // If RFP is expired
        return (
            <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">RFP Expired</span>
                    </div>
                    <p className="text-xs text-red-700 mt-1">
                        This RFP is no longer accepting submissions.
                    </p>
                </div>
                
                <Button disabled className="w-full">
                    RFP Expired
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                    <Link href="/rfps">← Back to RFPs</Link>
                </Button>
            </div>
        );
    }

    // Fallback
    return (
        <div className="space-y-3">
            <Button variant="outline" asChild className="w-full">
                <Link href="/rfps">← Back to RFPs</Link>
            </Button>
        </div>
    );
}