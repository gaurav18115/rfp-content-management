"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/toast/use-toast";
import RfpForm from "@/components/rfp/rfp-form";
import { type RfpFormData } from "@/lib/validations/rfp";
import { type IRFP } from "@/types/rfp";
import { useUser } from "@/lib/contexts/UserContext";

export default function EditRfpPage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const rfpId = params.id as string;
    const { profile, loading: userLoading } = useUser();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [rfpData, setRfpData] = useState<IRFP | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Check if user is a buyer
    useEffect(() => {
        if (!userLoading && profile && profile.role !== 'buyer') {
            toast({
                title: "Access Denied",
                description: "Only buyers can edit RFPs. Please contact support if you believe this is an error.",
                variant: "destructive",
            });
            router.push('/dashboard');
        }
    }, [profile, userLoading, router, toast]);

    const fetchRfpData = useCallback(async () => {
        try {
            const response = await fetch(`/api/rfps/${rfpId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch RFP data');
            }
            const data = await response.json();

            // Check if RFP is in draft status (only allow editing drafts)
            if (data.rfp.status !== 'draft') {
                setError('Only draft RFPs can be edited');
                return;
            }

            setRfpData(data.rfp);
        } catch (error) {
            console.error('Error fetching RFP:', error);
            setError('Failed to load RFP data');
        } finally {
            setIsLoading(false);
        }
    }, [rfpId]);

    useEffect(() => {
        if (profile && profile.role === 'buyer') {
            fetchRfpData();
        }
    }, [fetchRfpData, profile]);

    // Show loading state while checking user role
    if (userLoading) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // Show access denied if user is not a buyer
    if (profile && profile.role !== 'buyer') {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                    <p className="text-muted-foreground mb-4">
                        Only buyers can edit RFPs. Please contact support if you believe this is an error.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (formData: RfpFormData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/rfps/${rfpId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update RFP');
            }

            const responseData = await response.json();
            console.log('RFP updated successfully:', responseData);

            toast({
                title: "RFP Updated Successfully!",
                description: "Your RFP has been updated successfully.",
            });

            // Redirect to My RFPs page after a short delay
            setTimeout(() => {
                router.push('/rfps/my');
            }, 1500);

        } catch (error) {
            console.error('RFP update error:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update RFP. Please try again.",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/rfps/my');
    };

    const handlePublish = async () => {
        if (!rfpData) return;

        try {
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

            const responseData = await response.json();
            console.log('RFP published successfully:', responseData);

            toast({
                title: "RFP Published Successfully!",
                description: "Your RFP is now visible to suppliers.",
            });

            // Redirect to My RFPs page after a short delay
            setTimeout(() => {
                router.push('/rfps/my');
            }, 1500);

        } catch (error) {
            console.error('RFP publish error:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to publish RFP. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <p>Loading RFP data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Error</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button asChild>
                        <Link href="/rfps/my">Back to My RFPs</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (!rfpData) {
        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">RFP Not Found</h3>
                    <p className="text-muted-foreground mb-4">The RFP you&apos;re looking for doesn&apos;t exist.</p>
                    <Button asChild>
                        <Link href="/rfps/my">Back to My RFPs</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Convert RFP data to form data format
    const initialFormData: Partial<RfpFormData> = {
        title: rfpData.title,
        category: rfpData.category,
        description: rfpData.description,
        company: rfpData.company,
        location: rfpData.location || "",
        budget_range: rfpData.budget_range,
        deadline: rfpData.deadline,
        requirements: rfpData.requirements || "",
        additional_information: rfpData.additional_information || "",
        priority: rfpData.priority as "low" | "medium" | "high" | "urgent",
        status: rfpData.status as "draft" | "published" | "closed" | "awarded",
        contact_email: rfpData.contact_email || "",
        contact_phone: rfpData.contact_phone || "",
        attachments: rfpData.attachments || [],
        tags: rfpData.tags || [],
    };

    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
            <div className="w-full">
                <div className="flex items-center gap-4 mb-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/rfps/my">
                            <ArrowLeft size="16" className="mr-2" />
                            Back to My RFPs
                        </Link>
                    </Button>
                </div>
                <h1 className="text-3xl font-bold mb-2" data-testid="edit-rfp-page-title">Edit RFP</h1>
                <p className="text-muted-foreground">
                    Update your Request for Proposal details
                </p>
            </div>

            <RfpForm
                mode="edit"
                initialData={initialFormData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onPublish={handlePublish}
                isSubmitting={isSubmitting}
                canPublish={rfpData.status === 'draft'}
            />
        </div>
    );
} 