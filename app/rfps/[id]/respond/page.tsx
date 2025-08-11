"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/toast/use-toast';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

interface RFPResponse {
  proposal: string;
  budget: string;
  timeline: string;
  experience: string;
}

export default function RFPResponsePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [rfp, setRfp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<RFPResponse>({
    proposal: '',
    budget: '',
    timeline: '',
    experience: ''
  });

  useEffect(() => {
    fetchRFP();
  }, [params.id]);

  const fetchRFP = async () => {
    try {
      const response = await fetch(`/api/rfps/${params.id}/view`);
      if (response.ok) {
        const data = await response.json();
        setRfp(data.rfp);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch RFP details",
          variant: "destructive",
        });
        router.push('/rfps');
      }
    } catch (error) {
      console.error('Error fetching RFP:', error);
      toast({
        title: "Error",
        description: "Failed to fetch RFP details",
        variant: "destructive",
      });
      router.push('/rfps');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/rfps/${params.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your proposal has been submitted successfully.",
        });
        
        // Redirect to RFP detail page
        router.push(`/rfps/${params.id}`);
      } else {
        const errorData = await response.json();
        toast({
          title: "Submission Failed",
          description: errorData.error || "Failed to submit proposal. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RFPResponse, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!rfp) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">RFP Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The RFP you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/rfps">← Back to RFPs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/rfps/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to RFP
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Submit Proposal</h1>
          <p className="text-muted-foreground">
            Respond to: {rfp.title}
          </p>
        </div>
      </div>

      {/* RFP Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">RFP Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Company:</strong> {rfp.company}</p>
            <p><strong>Category:</strong> {rfp.category}</p>
            <p><strong>Budget Range:</strong> {rfp.budget_range}</p>
            <p><strong>Deadline:</strong> {new Date(rfp.deadline).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Response Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Proposal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="rfp-response-form">
            <div className="space-y-2">
              <Label htmlFor="proposal">Proposal *</Label>
              <Textarea
                id="proposal"
                data-testid="proposal-field"
                placeholder="Describe your approach, methodology, and solution for this RFP..."
                value={formData.proposal}
                onChange={(e) => handleInputChange('proposal', e.target.value)}
                required
                rows={6}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Proposed Budget</Label>
              <Input
                id="budget"
                data-testid="budget-field"
                type="text"
                placeholder="e.g., $25,000 or $25k - $30k"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Proposed Timeline</Label>
              <Input
                id="timeline"
                data-testid="timeline-field"
                type="text"
                placeholder="e.g., 3 months, 6-8 weeks"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Relevant Experience</Label>
              <Textarea
                id="experience"
                data-testid="experience-field"
                placeholder="Describe your relevant experience, past projects, and team qualifications..."
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                rows={4}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitting || !formData.proposal.trim()}
                className="flex-1"
                data-testid="submit-response-btn"
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Proposal'}
              </Button>
              
              <Button variant="outline" asChild>
                <Link href={`/rfps/${params.id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}