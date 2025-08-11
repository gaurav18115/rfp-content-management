"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, AlertCircle, Send } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/toast/use-toast";
import { useUser } from "@/lib/contexts/UserContext";
import { IRFP } from "@/types/rfp";

export default function RespondToRfpPage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const rfpId = params.id as string;
    const { profile, loading: userLoading } = useUser();

    const [rfp, setRfp] = useState<IRFP | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        proposal: '',
        budget: '',
        timeline: '',
        experience: ''
    });

    useEffect(() => {
        if (!userLoading) {
            fetchRfpData();
        }
    }, [userLoading]);

    const fetchRfpData = async () => {
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
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profile || profile.role !== 'supplier') {
            toast({
                title: "Access Denied",
                description: "Only suppliers can submit proposals.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch(`/api/rfps/${rfpId}/responses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    proposal: formData.proposal,
                    budget: parseFloat(formData.budget),
                    timeline: formData.timeline,
                    experience: formData.experience
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit proposal');
            }

            toast({
                title: "Proposal Submitted Successfully!",
                description: "Your proposal has been submitted and is under review.",
            });

            // Redirect to RFPs page after a short delay
            setTimeout(() => {
                router.push('/rfps');
            }, 1500);

        } catch (error) {
            console.error('Proposal submission error:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to submit proposal. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Check if user is a supplier
    if (userLoading) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (profile && profile.role !== 'supplier') {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                    <p className="text-muted-foreground mb-4">
                        Only suppliers can submit proposals to RFPs.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading RFP details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
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
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
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
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">RFP Not Available</h3>
                    <p className="text-muted-foreground mb-4">
                        This RFP is not currently published and cannot accept proposals.
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

    // Check if RFP has expired
    const isExpired = new Date(rfp.deadline) < new Date();
    if (isExpired) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">RFP Expired</h3>
                    <p className="text-muted-foreground mb-4">
                        This RFP has expired and is no longer accepting proposals.
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
            {/* Back Navigation */}
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm">
                    <Link href={`/rfps/${rfpId}`}>
                        <ArrowLeft size="16" className="mr-2" />
                        Back to RFP
                    </Link>
                </Button>
            </div>

            {/* RFP Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{rfp.title}</CardTitle>
                    <p className="text-muted-foreground">{rfp.description}</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Company:</span> {rfp.company}
                        </div>
                        <div>
                            <span className="font-medium">Category:</span> {rfp.category}
                        </div>
                        <div>
                            <span className="font-medium">Budget Range:</span> {rfp.budget_range}
                        </div>
                        <div>
                            <span className="font-medium">Deadline:</span> {new Date(rfp.deadline).toLocaleDateString()}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Proposal Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Submit Your Proposal</CardTitle>
                    <p className="text-muted-foreground">
                        Please provide detailed information about your proposal for this RFP.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="proposal">Proposal Details *</Label>
                            <Textarea
                                id="proposal"
                                placeholder="Describe your approach, methodology, and how you plan to deliver this project..."
                                value={formData.proposal}
                                onChange={(e) => handleInputChange('proposal', e.target.value)}
                                required
                                rows={6}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="budget">Proposed Budget ($) *</Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    placeholder="50000"
                                    value={formData.budget}
                                    onChange={(e) => handleInputChange('budget', e.target.value)}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="timeline">Proposed Timeline *</Label>
                                <Input
                                    id="timeline"
                                    placeholder="3 months"
                                    value={formData.timeline}
                                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                                    required
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="experience">Relevant Experience *</Label>
                            <Textarea
                                id="experience"
                                placeholder="Describe your relevant experience, past projects, and team qualifications..."
                                value={formData.experience}
                                onChange={(e) => handleInputChange('experience', e.target.value)}
                                required
                                rows={4}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size="16" className="mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size="16" className="mr-2" />
                                        Submit Proposal
                                    </>
                                )}
                            </Button>

                            <Button asChild variant="outline" type="button">
                                <Link href={`/rfps/${rfpId}`}>
                                    Cancel
                                </Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 