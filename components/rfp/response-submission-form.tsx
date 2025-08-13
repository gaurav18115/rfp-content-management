'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, DollarSign, FileText, Building2 } from 'lucide-react';
import { IRFP } from '@/types/rfp';
import { createClient } from '@/lib/supabase/client';

interface ResponseSubmissionFormProps {
    rfp: IRFP & {
        user_profiles?: {
            company_name?: string;
            first_name?: string;
            last_name?: string;
        };
    };
}

interface FormData {
    proposal: string;
    budget: string;
    timeline: string;
    experience: string;
}

export function ResponseSubmissionForm({ rfp }: ResponseSubmissionFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        proposal: '',
        budget: '',
        timeline: '',
        experience: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const validateForm = (): boolean => {
        const errors: Partial<FormData> = {};
        
        if (!formData.proposal.trim()) {
            errors.proposal = 'Proposal is required';
        }
        
        if (!formData.budget.trim()) {
            errors.budget = 'Budget is required';
        }
        
        if (!formData.timeline.trim()) {
            errors.timeline = 'Timeline is required';
        }
        
        if (!formData.experience.trim()) {
            errors.experience = 'Experience is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const supabase = createClient();
            
            const { error } = await supabase
                .from('rfp_responses')
                .insert({
                    rfp_id: rfp.id,
                    proposal: formData.proposal,
                    budget: parseFloat(formData.budget),
                    timeline: formData.timeline,
                    experience: formData.experience,
                    status: 'submitted'
                })
                .select()
                .single();

            if (error) {
                if (error.code === '23505') {
                    setError('You have already submitted a response to this RFP.');
                } else {
                    setError('Failed to submit response. Please try again.');
                }
                return;
            }

            // Redirect to success page or RFP detail
            router.push(`/rfps/${rfp.id}?success=response-submitted`);
            
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Submit Your Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Proposal */}
                            <div className="space-y-2">
                                <Label htmlFor="proposal">
                                    Proposal <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="proposal"
                                    placeholder="Describe your approach, methodology, and how you plan to deliver this project..."
                                    value={formData.proposal}
                                    onChange={(e) => handleInputChange('proposal', e.target.value)}
                                    className={validationErrors.proposal ? 'border-destructive' : ''}
                                    rows={6}
                                />
                                {validationErrors.proposal && (
                                    <p className="text-sm text-destructive">{validationErrors.proposal}</p>
                                )}
                            </div>

                            {/* Budget */}
                            <div className="space-y-2">
                                <Label htmlFor="budget">
                                    Budget (USD) <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    placeholder="75000"
                                    value={formData.budget}
                                    onChange={(e) => handleInputChange('budget', e.target.value)}
                                    className={validationErrors.budget ? 'border-destructive' : ''}
                                    min="0"
                                    step="0.01"
                                />
                                {validationErrors.budget && (
                                    <p className="text-sm text-destructive">{validationErrors.budget}</p>
                                )}
                            </div>

                            {/* Timeline */}
                            <div className="space-y-2">
                                <Label htmlFor="timeline">
                                    Timeline <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="timeline"
                                    placeholder="3 months"
                                    value={formData.timeline}
                                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                                    className={validationErrors.timeline ? 'border-destructive' : ''}
                                />
                                {validationErrors.timeline && (
                                    <p className="text-sm text-destructive">{validationErrors.timeline}</p>
                                )}
                            </div>

                            {/* Experience */}
                            <div className="space-y-2">
                                <Label htmlFor="experience">
                                    Relevant Experience <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="experience"
                                    placeholder="Describe your relevant experience, past projects, and team qualifications..."
                                    value={formData.experience}
                                    onChange={(e) => handleInputChange('experience', e.target.value)}
                                    className={validationErrors.experience ? 'border-destructive' : ''}
                                    rows={4}
                                />
                                {validationErrors.experience && (
                                    <p className="text-sm text-destructive">{validationErrors.experience}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Response'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* RFP Summary */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>RFP Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="font-medium">
                                    {rfp.user_profiles?.company_name || rfp.company}
                                </p>
                                {rfp.user_profiles?.first_name && (
                                    <p className="text-sm text-muted-foreground">
                                        {rfp.user_profiles.first_name} {rfp.user_profiles.last_name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{rfp.budget_range}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="font-medium">{formatDate(rfp.deadline)}</p>
                                <p className="text-sm text-muted-foreground">Deadline</p>
                            </div>
                        </div>

                        {rfp.requirements && (
                            <div className="flex items-start gap-3">
                                <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-medium">Requirements</p>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {rfp.requirements}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Submission Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>• Ensure your proposal addresses all requirements</p>
                        <p>• Provide realistic budget and timeline estimates</p>
                        <p>• Highlight relevant experience and qualifications</p>
                        <p>• You can only submit one response per RFP</p>
                        <p>• Responses are final and cannot be edited after submission</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}