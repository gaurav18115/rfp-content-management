"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast/use-toast";
import RfpForm from "@/components/rfp/rfp-form";
import { type RfpFormData } from "@/lib/validations/rfp";

export default function CreateRfpPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: RfpFormData) => {
        setIsSubmitting(true);

        try {
            // Send the RFP data to the API
            const response = await fetch('/api/rfps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create RFP');
            }

            const responseData = await response.json();
            console.log('RFP created successfully:', responseData);

            toast({
                title: "RFP Created Successfully!",
                description: "Your RFP has been created and is now visible to suppliers.",
            });

            // Redirect to My RFPs page after a short delay
            setTimeout(() => {
                router.push('/rfps/my');
            }, 1500);

        } catch (error) {
            console.error('RFP creation error:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create RFP. Please try again.",
                variant: "destructive",
            });
            throw error; // Re-throw to let the form component handle it
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/rfps/my');
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
                <h1 className="text-3xl font-bold mb-2" data-testid="create-rfp-page-title">Create New RFP</h1>
                <p className="text-muted-foreground">
                    Create a new Request for Proposal to find suppliers and vendors
                </p>
            </div>

            <RfpForm
                mode="create"
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
            />
        </div>
    );
} 