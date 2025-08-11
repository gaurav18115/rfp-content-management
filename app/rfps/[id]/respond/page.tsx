"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/toast/use-toast";
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

interface ProposalFormData {
    proposal: string;
    budget: string;
    timeline: string;
    experience: string;
}

export default function RespondToRFPPage() {
    const params = useParams();
    const rfpId = params.id as string;
    const { toast } = useToast();

    const [rfp, setRfp] = useState<RFPDetailResponse['rfp'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<ProposalFormData>({
        proposal: '',
        budget: '',
        timeline: '',
        experience: ''
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rfp) return;

        try {
            setSubmitting(true);

            const response = await fetch(`/api/rfps/${rfpId}/responses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit proposal');
            }

            toast({
                title: "Proposal Submitted",
                description: "Your proposal has been submitted successfully!",
            });

            // Redirect to the RFP detail page
            window.location.href = `/rfps/${rfpId}`;
        } catch (err) {
            console.error('Error submitting proposal:', err);
            toast({
                title: "Submission Failed",
                description: err instanceof Error ? err.message : 'An error occurred while submitting your proposal',
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof ProposalFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

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

    // Check if RFP is expired
    const isExpired = new Date(rfp.deadline) < new Date();

    if (isExpired) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">RFP Expired</h3>
                    <p className="text-muted-foreground mb-4">
                        This RFP has expired and is no longer accepting proposals.
                    </p>
                    <Button asChild>
                        <Link href={`/rfps/${rfpId}`}>
                            <ArrowLeft size="16" className="mr-2" />
                            Back to RFP Details
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="w-full">
                <div className="flex items-center gap-4 mb-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={`/rfps/${rfpId}`}>
                            <ArrowLeft size="16" className="mr-2" />
                            Back to RFP Details
                        </Link>
                    </Button>
                </div>
                <h1 className="text-3xl font-bold mb-2">Submit Proposal</h1>
                <p className="text-muted-foreground">
                    Submit your proposal for: {rfp.title}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* RFP Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            RFP Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">{rfp.title}</h3>
                            <p className="text-sm text-muted-foreground">{rfp.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Company:</span>
                                <p className="text-muted-foreground">
                                    {rfp.user_profiles?.company_name || rfp.company}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium">Budget:</span>
                                <p className="text-muted-foreground">{rfp.budget_range}</p>
                            </div>
                            <div>
                                <span className="font-medium">Category:</span>
                                <p className="text-muted-foreground">{rfp.category}</p>
                            </div>
                            <div>
                                <span className="font-medium">Deadline:</span>
                                <p className="text-muted-foreground">
                                    {new Date(rfp.deadline).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {rfp.requirements && (
                            <div>
                                <span className="font-medium text-sm">Requirements:</span>
                                <p className="text-sm text-muted-foreground mt-1">{rfp.requirements}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Proposal Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Proposal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4" data-testid="rfp-response-form">
                            <div className="space-y-2">
                                <Label htmlFor="proposal">Proposal Details *</Label>
                                <Textarea
                                    id="proposal"
                                    data-testid="proposal-field"
                                    placeholder="Describe your approach, methodology, and how you'll deliver this project..."
                                    value={formData.proposal}
                                    onChange={(e) => handleInputChange('proposal', e.target.value)}
                                    required
                                    rows={6}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="budget">Proposed Budget *</Label>
                                <Input
                                    id="budget"
                                    data-testid="budget-field"
                                    type="text"
                                    placeholder="e.g., $50,000 or $45,000 - $55,000"
                                    value={formData.budget}
                                    onChange={(e) => handleInputChange('budget', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeline">Project Timeline *</Label>
                                <Input
                                    id="timeline"
                                    data-testid="timeline-field"
                                    type="text"
                                    placeholder="e.g., 3 months, 6-8 weeks"
                                    value={formData.timeline}
                                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience">Relevant Experience</Label>
                                <Textarea
                                    id="experience"
                                    data-testid="experience-field"
                                    placeholder="Describe your relevant experience and past projects..."
                                    value={formData.experience}
                                    onChange={(e) => handleInputChange('experience', e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <Button
                                type="submit"
                                data-testid="submit-response-btn"
                                className="w-full"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Proposal'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 