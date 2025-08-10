"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/toast/use-toast";
import { rfpFormSchema } from "@/lib/validations/rfp";

export default function CreateRfpPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "technology",
        description: "",
        company: "",
        location: "",
        budget_range: "negotiable",
        deadline: "",
        requirements: "",
        additional_information: "",
        priority: "medium",
        status: "draft",
        contact_email: "",
        contact_phone: "",
        attachments: [],
        tags: [],
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" })); // Clear error when typing
    };

    const handleSelectChange = (name: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" })); // Clear error when selecting
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({}); // Clear previous errors

        const result = rfpFormSchema.safeParse(formData);

        if (!result.success) {
            const newErrors: { [key: string]: string } = {};
            result.error.issues.forEach(issue => {
                const pathKey = issue.path[0] as string;
                if (pathKey) {
                    newErrors[pathKey] = issue.message;
                }
            });
            setErrors(newErrors);
            setIsSubmitting(false);
            toast({
                title: "Validation Error",
                description: "Please correct the errors in the form.",
                variant: "destructive",
            });
            return;
        }

        console.log('Form data:', result.data);

        try {
            // In a real app, you'd send this to your API
            toast({
                title: "RFP Created Successfully!",
                description: "Your RFP has been created and is now visible to suppliers.",
            });

            // Reset form
            setFormData({
                title: "",
                category: "technology",
                description: "",
                company: "",
                location: "",
                budget_range: "negotiable",
                deadline: "",
                requirements: "",
                additional_information: "",
                priority: "medium",
                status: "draft",
                contact_email: "",
                contact_phone: "",
                attachments: [],
                tags: [],
            });

        } catch {
            toast({
                title: "Error",
                description: "Failed to create RFP. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
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

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2" data-testid="rfp-details-card-title">
                        <FileText size="20" />
                        RFP Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">RFP Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g., Website Development Services"
                                    value={formData.title}
                                    onChange={handleChange}
                                    data-testid="rfp-title-input"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm" data-testid="rfp-title-error">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    name="category"
                                    onValueChange={(value) => handleSelectChange("category", value)}
                                    value={formData.category}
                                >
                                    <SelectTrigger data-testid="rfp-category-select">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="marketing">Marketing</SelectItem>
                                        <SelectItem value="design">Design</SelectItem>
                                        <SelectItem value="consulting">Consulting</SelectItem>
                                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                        <SelectItem value="services">Services</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-red-500 text-sm" data-testid="rfp-category-error">
                                        {errors.category}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Provide a detailed description of what you're looking for..."
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                data-testid="rfp-description-textarea"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm" data-testid="rfp-description-error">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name *</Label>
                                <Input
                                    id="company"
                                    name="company"
                                    placeholder="Your company name"
                                    value={formData.company}
                                    onChange={handleChange}
                                    data-testid="rfp-company-input"
                                />
                                {errors.company && (
                                    <p className="text-red-500 text-sm" data-testid="rfp-company-error">
                                        {errors.company}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="e.g., Remote, New York, NY"
                                    value={formData.location}
                                    onChange={handleChange}
                                    data-testid="rfp-location-input"
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-sm" data-testid="rfp-location-error">
                                        {errors.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget Range</Label>
                                <Select
                                    name="budget_range"
                                    onValueChange={(value) => handleSelectChange("budget_range", value)}
                                    value={formData.budget_range}
                                >
                                    <SelectTrigger data-testid="rfp-budget-select">
                                        <SelectValue placeholder="Select budget range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="under-10k">Under $10,000</SelectItem>
                                        <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                                        <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                                        <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                                        <SelectItem value="over-500k">Over $500,000</SelectItem>
                                        <SelectItem value="negotiable">Negotiable</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.budget_range && (
                                    <p className="text-red-500 text-sm" data-testid="rfp-budget-error">
                                        {errors.budget_range}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deadline">Submission Deadline *</Label>
                                <Input
                                    id="deadline"
                                    name="deadline"
                                    type="date"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    data-testid="rfp-deadline-input"
                                />
                                {errors.deadline && (
                                    <p className="text-red-500 text-sm" data-testid="rfp-deadline-error">
                                        {errors.deadline}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirements">Requirements & Specifications</Label>
                            <Textarea
                                id="requirements"
                                name="requirements"
                                placeholder="List specific requirements, technical specifications, or evaluation criteria..."
                                rows={4}
                                value={formData.requirements}
                                onChange={handleChange}
                                data-testid="rfp-requirements-textarea"
                            />
                            {errors.requirements && (
                                <p className="text-red-500 text-sm" data-testid="rfp-requirements-error">
                                    {errors.requirements}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="additional">Additional Information</Label>
                            <Textarea
                                id="additional"
                                name="additional_information"
                                placeholder="Any other relevant information for suppliers..."
                                rows={3}
                                value={formData.additional_information}
                                onChange={handleChange}
                                data-testid="rfp-additional-info-textarea"
                            />
                            {errors.additional_information && (
                                <p className="text-red-500 text-sm" data-testid="rfp-additional-info-error">
                                    {errors.additional_information}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" className="flex-1" disabled={isSubmitting} data-testid="create-rfp-submit-button">
                                {isSubmitting ? "Creating..." : "Create RFP"}
                            </Button>
                            <Button type="button" variant="outline" asChild data-testid="create-rfp-cancel-button">
                                <Link href="/rfps/my">
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