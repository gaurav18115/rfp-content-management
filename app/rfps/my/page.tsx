"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Building, Plus, Eye, Edit, Globe, MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { IRFP } from "@/types/rfp";
import { useToast } from "@/components/toast/use-toast";
import { useUser } from "@/lib/contexts/UserContext";

interface RFPWithResponses extends IRFP {
    responseCount: number;
    responses: Array<{
        id: string;
        status: string;
        supplier_name: string;
        submitted_at: string;
    }>;
}

interface ResponseData {
    id: string;
    rfp_id: string;
    status: string;
    supplier_name: string;
    submitted_at: string;
}

export default function MyRfpsPage() {
    const { toast } = useToast();
    const { profile } = useUser();
    const [myRfps, setMyRfps] = useState<RFPWithResponses[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [publishingRfpId, setPublishingRfpId] = useState<string | null>(null);

    useEffect(() => {
        fetchMyRfps();
    }, []);

    const fetchMyRfps = async () => {
        try {
            setIsLoading(true);
            const [rfpsResponse, responsesResponse] = await Promise.all([
                fetch('/api/rfps'),
                profile?.role === 'buyer' ? fetch('/api/responses') : Promise.resolve(null)
            ]);

            if (!rfpsResponse.ok) {
                throw new Error('Failed to fetch RFPs');
            }

            const rfpsData = await rfpsResponse.json();
            const rfps = rfpsData.rfps || [];

            // If buyer, fetch responses and merge with RFPs
            if (profile?.role === 'buyer' && responsesResponse) {
                if (responsesResponse.ok) {
                    const responsesData = await responsesResponse.json();
                    const responses = responsesData.responses || [];

                    // Group responses by RFP ID
                    const responsesByRfp = responses.reduce((acc: Record<string, ResponseData[]>, response: ResponseData) => {
                        if (!acc[response.rfp_id]) {
                            acc[response.rfp_id] = [];
                        }
                        acc[response.rfp_id].push(response);
                        return acc;
                    }, {});

                    // Merge responses with RFPs
                    const rfpsWithResponses = rfps.map((rfp: IRFP) => ({
                        ...rfp,
                        responseCount: responsesByRfp[rfp.id]?.length || 0,
                        responses: responsesByRfp[rfp.id] || []
                    }));

                    setMyRfps(rfpsWithResponses);
                } else {
                    // If responses fetch fails, still show RFPs without response data
                    const rfpsWithResponses = rfps.map((rfp: IRFP) => ({
                        ...rfp,
                        responseCount: 0,
                        responses: []
                    }));
                    setMyRfps(rfpsWithResponses);
                }
            } else {
                // For non-buyers, just show RFPs without response data
                const rfpsWithResponses = rfps.map((rfp: IRFP) => ({
                    ...rfp,
                    responseCount: 0,
                    responses: []
                }));
                setMyRfps(rfpsWithResponses);
            }
        } catch (err) {
            console.error('Error fetching RFPs:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch RFPs');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublishRfp = async (rfpId: string) => {
        try {
            setPublishingRfpId(rfpId);

            const response = await fetch(`/api/rfps/${rfpId}/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to publish RFP');
            }

            toast({
                title: "RFP Published Successfully!",
                description: "Your RFP is now visible to suppliers.",
            });

            // Refresh the RFPs list to show updated status
            await fetchMyRfps();

        } catch (error) {
            console.error('RFP publish error:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to publish RFP. Please try again.",
                variant: "destructive",
            });
        } finally {
            setPublishingRfpId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'submitted':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Submitted</Badge>;
            case 'under_review':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
            case 'approved':
                return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
            case 'rejected':
                return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const totalResponses = myRfps.reduce((sum, rfp) => sum + rfp.responseCount, 0);
    const pendingResponses = myRfps.reduce((sum, rfp) =>
        sum + rfp.responses.filter(r => r.status === 'submitted' || r.status === 'under_review').length, 0
    );

    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-2">My RFPs & Responses</h1>
                <p className="text-muted-foreground">
                    Manage your created RFPs and track supplier responses
                </p>
            </div>

            {/* Response Summary Stats */}
            {profile?.role === 'buyer' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalResponses}</div>
                            <p className="text-xs text-muted-foreground">
                                Across all your RFPs
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingResponses}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting your action
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active RFPs</CardTitle>
                            <FileText className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{myRfps.filter(rfp => rfp.status === 'published').length}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently published
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* My Created RFPs */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">My RFPs</h2>
                    <div className="flex gap-2">
                        {profile?.role === 'buyer' && totalResponses > 0 && (
                            <Button asChild variant="outline">
                                <Link href="/dashboard/responses">
                                    <MessageSquare size="16" className="mr-2" />
                                    Review All Responses ({totalResponses})
                                </Link>
                            </Button>
                        )}
                        {profile?.role === 'buyer' && (
                            <Button asChild>
                                <Link href="/rfps/create">
                                    <Plus size="16" className="mr-2" />
                                    Create New RFP
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {isLoading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your RFPs...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-4">Error: {error}</p>
                        <Button onClick={fetchMyRfps} variant="outline">
                            Try Again
                        </Button>
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {myRfps.map((rfp) => (
                                <Card key={rfp.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-2">{rfp.title}</CardTitle>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                    <Building size="16" />
                                                    {rfp.company}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                    <Calendar size="16" />
                                                    Due: {new Date(rfp.deadline).toLocaleDateString()}
                                                </div>
                                                {rfp.responseCount > 0 && (
                                                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                                                        <MessageSquare size="16" />
                                                        {rfp.responseCount} response{rfp.responseCount !== 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </div>
                                            <FileText size="20" className="text-blue-600" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${rfp.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {rfp.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                {rfp.category}
                                            </span>
                                        </div>

                                        {/* Show recent responses if any */}
                                        {rfp.responses.length > 0 && (
                                            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                                <h4 className="font-medium mb-2 text-sm">Recent Responses</h4>
                                                <div className="space-y-2">
                                                    {rfp.responses.slice(0, 2).map((response) => (
                                                        <div key={response.id} className="flex items-center justify-between text-xs">
                                                            <span className="text-muted-foreground">
                                                                {response.supplier_name}
                                                            </span>
                                                            {getStatusBadge(response.status)}
                                                        </div>
                                                    ))}
                                                    {rfp.responses.length > 2 && (
                                                        <div className="text-xs text-muted-foreground text-center">
                                                            +{rfp.responses.length - 2} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 flex-wrap">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/rfps/${rfp.id}`}>
                                                    <Eye size="16" className="mr-2" />
                                                    View RFP
                                                </Link>
                                            </Button>

                                            {rfp.responseCount > 0 && profile?.role === 'buyer' && (
                                                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                                    <Link href={`/dashboard/responses?rfp=${rfp.id}`}>
                                                        <MessageSquare size="16" className="mr-2" />
                                                        Review Responses
                                                    </Link>
                                                </Button>
                                            )}

                                            {rfp.status === 'draft' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handlePublishRfp(rfp.id)}
                                                    disabled={publishingRfpId === rfp.id}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    <Globe size="16" className="mr-2" />
                                                    {publishingRfpId === rfp.id ? 'Publishing...' : 'Publish'}
                                                </Button>
                                            )}

                                            <Button asChild size="sm">
                                                <Link href={`/rfps/${rfp.id}/edit`}>
                                                    <Edit size="16" className="mr-2" />
                                                    Edit
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {myRfps.length === 0 && (
                            <div className="text-center py-12">
                                <FileText size="48" className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No RFPs Created Yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Start by creating your first RFP to find suppliers and vendors.
                                </p>
                                {profile?.role === 'buyer' && (
                                    <Button asChild>
                                        <Link href="/rfps/create">
                                            <Plus size="16" className="mr-2" />
                                            Create Your First RFP
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Quick Actions for Buyers */}
            {profile?.role === 'buyer' && totalResponses > 0 && (
                <section>
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-900 flex items-center gap-2">
                                <MessageSquare size="20" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Link href="/dashboard/responses">
                                        <MessageSquare size="16" className="mr-2" />
                                        Review All Responses ({totalResponses})
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/dashboard/responses?status=submitted">
                                        <Clock size="16" className="mr-2" />
                                        Review Pending ({pendingResponses})
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/dashboard/responses?status=approved">
                                        <CheckCircle size="16" className="mr-2" />
                                        View Approved
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}
        </div>
    );
} 