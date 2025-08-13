"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    CheckCircle,
    XCircle,
    Clock,
    User,
    Building,
    DollarSign,
    Calendar,
    FileText,
    Eye,
    MessageSquare,
    Filter,
    Search,
    RefreshCw
} from "lucide-react";
import { useToast } from "@/components/toast/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IResponseWithRFP } from "@/types/rfp";
import Link from "next/link";

interface RFPFilter {
    id: string;
    title: string;
}

export default function ResponsesPage() {
    const { toast } = useToast();
    const [responses, setResponses] = useState<IResponseWithRFP[]>([]);
    const [filteredResponses, setFilteredResponses] = useState<IResponseWithRFP[]>([]);
    const [rfpFilters, setRfpFilters] = useState<RFPFilter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Filter states
    const [selectedRfp, setSelectedRfp] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Handle URL query parameters for direct linking
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const rfpParam = urlParams.get('rfp');
        const statusParam = urlParams.get('status');

        if (rfpParam && rfpParam !== 'all') {
            setSelectedRfp(rfpParam);
        }
        if (statusParam && statusParam !== 'all') {
            setStatusFilter(statusParam);
        }
    }, []);

    const fetchResponses = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/responses');

            if (!response.ok) {
                throw new Error('Failed to fetch responses');
            }

            const data = await response.json();
            const responsesData = data.responses || [];
            setResponses(responsesData);
            setFilteredResponses(responsesData);

            // Extract unique RFPs for filtering
            const rfpMap = new Map<string, string>();
            responsesData.forEach((r: IResponseWithRFP) => {
                if (!rfpMap.has(r.rfp_id)) {
                    rfpMap.set(r.rfp_id, r.rfp_title);
                }
            });

            const uniqueRfps = Array.from(rfpMap.entries()).map(([id, title]) => ({
                id,
                title: title || 'Unknown RFP'
            }));
            setRfpFilters(uniqueRfps);
        } catch (err) {
            console.error('Error fetching responses:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch responses');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Apply filters whenever responses or filter criteria change
    useEffect(() => {
        let filtered = responses;

        // Filter by RFP
        if (selectedRfp !== "all") {
            filtered = filtered.filter(r => r.rfp_id === selectedRfp);
        }

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter(r => r.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.supplier_name?.toLowerCase().includes(query) ||
                r.supplier_company?.toLowerCase().includes(query) ||
                r.rfp_title.toLowerCase().includes(query) ||
                r.proposal.toLowerCase().includes(query)
            );
        }

        setFilteredResponses(filtered);
    }, [responses, selectedRfp, statusFilter, searchQuery]);

    useEffect(() => {
        fetchResponses();
    }, [fetchResponses]);

    const handleApprove = async (responseId: string) => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/responses/${responseId}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to approve response');
            }

            toast({
                title: "Response Approved!",
                description: "The supplier has been notified of the approval.",
            });

            // Refresh the responses list
            await fetchResponses();
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

    const handleReject = async (responseId: string, reason: string) => {
        try {
            setIsProcessing(true);

            const response = await fetch(`/api/responses/${responseId}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejection_reason: reason }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to reject response');
            }

            toast({
                title: "Response Rejected",
                description: "The supplier has been notified with the rejection reason.",
            });

            // Reset form and refresh
            setRejectionReason("");
            await fetchResponses();
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

    const clearFilters = () => {
        setSelectedRfp("all");
        setStatusFilter("all");
        setSearchQuery("");
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

    const getStatusCount = (status: string) => {
        return responses.filter(r => r.status === status).length;
    };

    if (isLoading) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading responses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">Error: {error}</p>
                    <Button onClick={fetchResponses} variant="outline">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
            <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold">Review Responses</h1>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/rfps/my">
                            <FileText size="16" className="mr-2" />
                            Back to My RFPs
                        </Link>
                    </Button>
                </div>
                <p className="text-muted-foreground">
                    Review and manage supplier responses to your RFPs
                </p>
            </div>

            {/* Response Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{responses.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {getStatusCount('submitted') + getStatusCount('under_review')}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {getStatusCount('approved')}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {getStatusCount('rejected')}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active RFPs</CardTitle>
                        <FileText className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {rfpFilters.length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filter Responses
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* RFP Filter */}
                        <div>
                            <Label htmlFor="rfp-filter">Filter by RFP</Label>
                            <Select value={selectedRfp} onValueChange={setSelectedRfp}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All RFPs" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All RFPs</SelectItem>
                                    {rfpFilters.map((rfp) => (
                                        <SelectItem key={rfp.id} value={rfp.id}>
                                            {rfp.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <Label htmlFor="status-filter">Filter by Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Filter */}
                        <div>
                            <Label htmlFor="search">Search Responses</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search suppliers, companies, proposals..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-end gap-2">
                            <Button variant="outline" onClick={clearFilters} className="flex-1">
                                Clear Filters
                            </Button>
                            <Button variant="outline" onClick={fetchResponses} disabled={isProcessing}>
                                <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Responses List */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">
                        Responses ({filteredResponses.length})
                    </h2>
                    {filteredResponses.length !== responses.length && (
                        <Badge variant="secondary">
                            Filtered from {responses.length} total
                        </Badge>
                    )}
                </div>

                {filteredResponses.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare size="48" className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {responses.length === 0 ? 'No Responses Yet' : 'No Responses Match Filters'}
                        </h3>
                        <p className="text-muted-foreground">
                            {responses.length === 0
                                ? "You haven't received any responses to your RFPs yet."
                                : "Try adjusting your search criteria or filters."
                            }
                        </p>
                        {responses.length > 0 && (
                            <Button onClick={clearFilters} className="mt-4">
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredResponses.map((response) => (
                            <Card key={response.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg mb-2">{response.rfp_title}</CardTitle>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
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
                                                    {new Date(response.submitted_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(response.status)}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <DollarSign size="16" className="text-green-600" />
                                            <span className="font-medium">{formatCurrency(response.budget)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size="16" className="text-blue-600" />
                                            <span className="text-sm text-muted-foreground">{response.timeline}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText size="16" className="text-purple-600" />
                                            <span className="text-sm text-muted-foreground">Experience: {response.experience}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-medium mb-2">Proposal Summary</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {response.proposal}
                                        </p>
                                    </div>

                                    {/* Review Metadata */}
                                    {(response.reviewed_at || response.rejection_reason) && (
                                        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                            <h4 className="font-medium mb-2">Review Details</h4>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                {response.reviewed_at && (
                                                    <div>Reviewed on: {new Date(response.reviewed_at).toLocaleDateString()}</div>
                                                )}
                                                {response.rejection_reason && (
                                                    <div className="text-red-700">
                                                        Rejection Reason: {response.rejection_reason}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/responses/${response.id}`}>
                                                <Eye size="16" className="mr-2" />
                                                View Details
                                            </Link>
                                        </Button>

                                        {response.status === 'submitted' || response.status === 'under_review' ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApprove(response.id)}
                                                    disabled={isProcessing}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    <CheckCircle size="16" className="mr-2" />
                                                    Approve
                                                </Button>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            disabled={isProcessing}
                                                        >
                                                            <XCircle size="16" className="mr-2" />
                                                            Reject
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
                                                                    onClick={() => handleReject(response.id, rejectionReason)}
                                                                    disabled={!rejectionReason.trim() || isProcessing}
                                                                >
                                                                    {isProcessing ? 'Rejecting...' : 'Reject Response'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                {response.status === 'approved' ? 'Response approved' : 'Response rejected'}
                                                {response.reviewed_at && (
                                                    <span> on {new Date(response.reviewed_at).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}