"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import { useToast } from "@/components/toast/use-toast";
import { rfpFormSchema, type RfpFormData } from "@/lib/validations/rfp";

interface RfpFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<RfpFormData>;
    onSubmit: (data: RfpFormData) => Promise<void>;
    onCancel: () => void;
    onPublish?: () => Promise<void>;
    isSubmitting: boolean;
    canPublish?: boolean;
}

export default function RfpForm({ mode, initialData, onSubmit, onCancel, onPublish, isSubmitting, canPublish = false }: RfpFormProps) {
    const { toast } = useToast();
    const [formData, setFormData] = useState<RfpFormData>({
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
        ...initialData
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Update form data when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (name: keyof RfpFormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

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
            toast({
                title: "Validation Error",
                description: `Please correct the following errors: ${Object.values(newErrors).join(', ')}`,
                variant: "destructive",
            });
            return;
        }

        try {
            await onSubmit(result.data);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText size="20" />
                    RFP Details
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Fields marked with * are required. All other fields are optional and can be filled in later.
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter RFP title"
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
                                value={formData.category}
                                onValueChange={(value) => handleSelectChange('category', value)}
                                data-testid="rfp-category-select-wrapper"
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
                            placeholder="Provide a detailed description of your requirements"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            data-testid="rfp-description-input"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm" data-testid="rfp-description-error">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="requirements">Requirements (Optional)</Label>
                        <Textarea
                            id="requirements"
                            name="requirements"
                            placeholder="List specific technical requirements, skills, or qualifications needed"
                            value={formData.requirements}
                            onChange={handleChange}
                            rows={3}
                            data-testid="rfp-requirements-input"
                        />
                        {errors.requirements && (
                            <p className="text-red-500 text-sm" data-testid="rfp-requirements-error">
                                {errors.requirements}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="budget_range">Budget Range *</Label>
                            <Select
                                value={formData.budget_range}
                                onValueChange={(value) => handleSelectChange('budget_range', value)}
                                data-testid="rfp-budget-range-select-wrapper"
                            >
                                <SelectTrigger data-testid="rfp-budget-select">
                                    <SelectValue placeholder="Select budget range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="under-10k">Under $10,000</SelectItem>
                                    <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                                    <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                                    <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                                    <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                                    <SelectItem value="over-1m">Over $1,000,000</SelectItem>
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
                            <Label htmlFor="deadline">Deadline *</Label>
                            <Input
                                id="deadline"
                                name="deadline"
                                type="datetime-local"
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
                            <Label htmlFor="location">Location (Optional)</Label>
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
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => handleSelectChange('priority', value)}
                                data-testid="rfp-priority-select-wrapper"
                            >
                                <SelectTrigger data-testid="rfp-priority-select">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.priority && (
                                <p className="text-red-500 text-sm" data-testid="rfp-priority-error">
                                    {errors.priority}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleSelectChange('status', value)}
                                data-testid="rfp-status-select-wrapper"
                            >
                                <SelectTrigger data-testid="rfp-status-select">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-red-500 text-sm" data-testid="rfp-status-error">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="additional_information">Additional Information (Optional)</Label>
                        <Textarea
                            id="additional_information"
                            name="additional_information"
                            placeholder="Any additional details, special requirements, or notes"
                            value={formData.additional_information}
                            onChange={handleChange}
                            rows={3}
                            data-testid="rfp-additional-info-input"
                        />
                        {errors.additional_information && (
                            <p className="text-red-500 text-sm" data-testid="rfp-additional-info-error">
                                {errors.additional_information}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="contact_email">Contact Email (Optional)</Label>
                            <Input
                                id="contact_email"
                                name="contact_email"
                                type="email"
                                placeholder="contact@company.com"
                                value={formData.contact_email}
                                onChange={handleChange}
                                data-testid="rfp-contact-email-input"
                            />
                            {errors.contact_email && (
                                <p className="text-red-500 text-sm" data-testid="rfp-contact-email-error">
                                    {errors.contact_email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact_phone">Contact Phone (Optional)</Label>
                            <Input
                                id="contact_phone"
                                name="contact_phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.contact_phone}
                                onChange={handleChange}
                                data-testid="rfp-contact-phone-input"
                            />
                            {errors.contact_phone && (
                                <p className="text-red-500 text-sm" data-testid="rfp-contact-phone-error">
                                    {errors.contact_phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? (mode === 'create' ? "Creating..." : "Updating...") : (mode === 'create' ? "Create RFP" : "Update RFP")}
                        </Button>

                        {mode === 'edit' && canPublish && onPublish && (
                            <Button
                                type="button"
                                variant="default"
                                onClick={onPublish}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Publish RFP
                            </Button>
                        )}

                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 