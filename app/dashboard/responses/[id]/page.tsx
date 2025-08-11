"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/toast/use-toast";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Building,
    DollarSign,
    Calendar,
    FileText,
    MessageSquare,
    AlertCircle,
    Loader2
} from "lucide-react";
import { RFPResponse } from "@/types/rfp";
import Link from "next/link";

export default function ResponseDetailPage() {
    const { toast } = useToast();
    const params = useParams();
    const responseId = params.id as string;

    const [response, setResponse] = useState<RFPResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchResponse = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/responses/${responseId}`);

            if (!response.ok) {
                if (response.status === 404) {
                    setError('Response not found');
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to fetch response');
                }
                return;
            }

            const data = await response.json();
            setResponse(data.response);
        } catch (error) {
            console.error('Error fetching response:', error);
            setError('Failed to load response data');
        } finally {
            setIsLoading(false);
        }
    }, [responseId]);

    useEffect(() => {
        fetchResponse();
    }, [fetchResponse]);

    const handleApprove = async () => {
        if (!response) return;

        try {
            setIsProcessing(true);

            const apiResponse = await fetch(`/api/responses/${response.id}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                throw new Error(errorData.error || 'Failed to approve response');
            }

            toast({
                title: "Response Approved!",
                description: "The supplier has been notified of the approval.",
            });

            // Refresh the response data
            await fetchResponse();
        } catch (error) {
            console.error('Approval error:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to approve response. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async (reason: string) => {
        if (!response) return;

        try {
            setIsProcessing(true);

            const apiResponse = await fetch(`/api/responses/${response.id}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejection_reason: reason }),
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                throw new Error(errorData.error || 'Failed to reject response');
            }

            toast({
                title: "Response Rejected",
                description: "The supplier has been notified with the rejection reason.",
            });

            // Reset form and refresh
            setRejectionReason("");
            await fetchResponse();
        } catch (error) {
            console.error('Rejection error:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to reject response. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading response details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error Loading Response</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <div className="flex gap-2 justify-center">
                        <Button onClick={fetchResponse} variant="outline">
                            Try Again
                        </Button>
                        <Button asChild>
                            <Link href="/dashboard/responses">
                                <ArrowLeft size="16" className="mr-2" />
                                Back to Responses
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!response) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Response Not Found</h3>
                    <p className="text-muted-foreground mb-4">
                        The response you&apos;re looking for doesn&apos;t exist or may have been removed.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/responses">
                            <ArrowLeft size="16" className="mr-2" />
                            Back to Responses
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
                    <Link href="/dashboard/responses">
                        <ArrowLeft size="16" className="mr-2" />
                        Back to Responses
                    </Link>
                </Button>
            </div>

            {/* Response Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-2xl mb-2">{response.rfp_title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User size="16" />
                                    {response.supplier_name}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building size="16" />
                                    {response.supplier_company}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size="16" />
                                    Submitted: {new Date(response.submitted_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(response.status)}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Response Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Proposal */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Proposal Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {response.proposal}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Experience */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Relevant Experience
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {response.experience}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Review Details */}
                    {(response.reviewed_at || response.rejection_reason) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Review Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {response.reviewed_at && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                Reviewed on: {new Date(response.reviewed_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    {response.rejection_reason && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                            <h4 className="font-medium text-red-800 mb-1">Rejection Reason</h4>
                                            <p className="text-sm text-red-700">{response.rejection_reason}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Key Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Key Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="font-medium">{formatCurrency(response.budget)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-muted-foreground">{response.timeline}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-purple-600" />
                                <span className="text-sm text-muted-foreground">Experience: {response.experience}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {response.status === 'submitted' || response.status === 'under_review' ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    onClick={handleApprove}
                                    disabled={isProcessing}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle size="16" className="mr-2" />
                                    Approve Response
                                </Button>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            disabled={isProcessing}
                                            className="w-full"
                                        >
                                            <XCircle size="16" className="mr-2" />
                                            Reject Response
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Reject Response</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                                                <Textarea
                                                    id="rejection-reason"
                                                    placeholder="Please provide a detailed reason for rejecting this response..."
                                                    value={rejectionReason}
                                                    onChange={(e) => setRejectionReason(e.target.value)}
                                                    rows={4}
                                                    required
                                                />
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    This reason will be shared with the supplier.
                                                </p>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setRejectionReason("")}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => handleReject(rejectionReason)}
                                                    disabled={!rejectionReason.trim() || isProcessing}
                                                >
                                                    {isProcessing ? 'Rejecting...' : 'Reject Response'}
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    {getStatusBadge(response.status)}
                                    {response.reviewed_at && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {response.status === 'approved' ? 'Approved' : 'Rejected'} on{' '}
                                            {new Date(response.reviewed_at).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
} 