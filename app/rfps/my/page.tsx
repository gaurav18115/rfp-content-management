"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Building, Plus, Eye, Edit, Globe, DollarSign } from "lucide-react";
import Link from "next/link";
import { IRFP } from "@/types/rfp";
import { useToast } from "@/components/toast/use-toast";

// Extended interface for response data from our API
interface ISupplierResponse {
    id: string;
    rfpId: string;
    rfpTitle: string;
    company: string;
    category: string;
    status: string;
    submittedAt: string;
    proposal: string;
    budget: number;
    timeline: string;
    experience: string;
    rfpStatus: string;
    rfpDeadline: string;
    budgetRange: string;
}

export default function MyRfpsPage() {
    const { toast } = useToast();
    const [myRfps, setMyRfps] = useState<IRFP[]>([]);
    const [myResponses, setMyResponses] = useState<ISupplierResponse[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [responsesLoading, setResponsesLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [publishingRfpId, setPublishingRfpId] = useState<string | null>(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            // Fetch user role first
            const userResponse = await fetch('/api/auth/user');
            if (userResponse.ok) {
                const userData = await userResponse.json();
                console.log('User data:', userData); // Debug log
                setUserRole(userData.user?.role);
                
                // Fetch appropriate data based on role
                if (userData.user?.role === 'buyer') {
                    await fetchMyRfps();
                } else if (userData.user?.role === 'supplier') {
                    await fetchMyResponses();
                }
            } else {
                console.error('Failed to fetch user data:', userResponse.status);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchMyRfps = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/rfps');

            if (!response.ok) {
                throw new Error('Failed to fetch RFPs');
            }

            const data = await response.json();
            setMyRfps(data.rfps || []);
        } catch (err) {
            console.error('Error fetching RFPs:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch RFPs');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMyResponses = async () => {
        try {
            setResponsesLoading(true);
            console.log('Fetching supplier responses...'); // Debug log
            const response = await fetch('/api/responses/my');

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', response.status, errorText);
                throw new Error(`Failed to fetch responses: ${response.status}`);
            }

            const data = await response.json();
            console.log('Responses data:', data); // Debug log
            setMyResponses(data.responses || []);
        } catch (err) {
            console.error('Error fetching responses:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch responses');
        } finally {
            setResponsesLoading(false);
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

    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-2">
                    {userRole === 'buyer' ? 'My RFPs & Responses' : 'My RFP Responses'}
                </h1>
                <p className="text-muted-foreground">
                    {userRole === 'buyer' 
                        ? 'Manage your created RFPs and track responses from suppliers'
                        : 'View and manage your responses to RFPs'
                    }
                </p>
            </div>

            {/* My Created RFPs - Only for buyers */}
            {userRole === 'buyer' && (
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">My RFPs</h2>
                    <Button asChild>
                        <Link href="/rfps/create">
                            <Plus size="16" className="mr-2" />
                            Create New RFP
                        </Link>
                    </Button>
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

                                        <div className="text-sm text-muted-foreground mb-4">
                                            {rfp.status === 'published' ? 'Published' : 'Draft'}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/rfps/${rfp.id}`}>
                                                    <Eye size="16" className="mr-2" />
                                                    View
                                                </Link>
                                            </Button>

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
                                <Button asChild>
                                    <Link href="/rfps/create">
                                        <Plus size="16" className="mr-2" />
                                        Create Your First RFP
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </section>
            )}

            {/* My Responses - Only for suppliers */}
            {userRole === 'supplier' && (
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">My RFP Responses</h2>
                    <Button asChild>
                        <Link href="/rfps">
                            <Plus size="16" className="mr-2" />
                            Browse RFPs
                        </Link>
                    </Button>
                </div>

                {responsesLoading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your responses...</p>
                    </div>
                )}

                {!responsesLoading && (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {myResponses.map((response) => (
                                <Card key={response.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-2">{response.rfpTitle}</CardTitle>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                    <Building size="16" />
                                                    {response.company}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                    <Calendar size="16" />
                                                    Submitted: {new Date(response.submittedAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <DollarSign size="16" />
                                                    Your Bid: ${response.budget.toLocaleString()}
                                                </div>
                                            </div>
                                            <FileText size="20" className="text-blue-600" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                {response.category}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                response.status === 'submitted' 
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : response.status === 'accepted'
                                                    ? 'bg-green-100 text-green-800'
                                                    : response.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                                            </span>
                                        </div>

                                        <div className="text-sm text-muted-foreground mb-4">
                                            <p className="line-clamp-2">{response.proposal}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/rfps/${response.rfpId}`}>
                                                    <Eye size="16" className="mr-2" />
                                                    View RFP
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {myResponses.length === 0 && (
                            <div className="text-center py-12">
                                <FileText size="48" className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Responses Yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    You haven&apos;t responded to any RFPs yet. Browse available RFPs to get started.
                                </p>
                                <Button asChild>
                                    <Link href="/rfps">
                                        <Plus size="16" className="mr-2" />
                                        Browse Available RFPs
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </section>
            )}

            {/* Both sections for mixed view */}
            {userRole === 'buyer' && (
            <section>
                <h2 className="text-2xl font-semibold mb-6">My Responses</h2>
                <div className="text-center py-12">
                    <FileText size="48" className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Responses Yet</h3>
                    <p className="text-muted-foreground">
                        As a buyer, responses to your RFPs will appear here when suppliers submit them.
                    </p>
                </div>
            </section>
            )}
        </div>
    );
} 