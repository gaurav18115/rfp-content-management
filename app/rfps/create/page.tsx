import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateRfpPage() {
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
                <h1 className="text-3xl font-bold mb-2">Create New RFP</h1>
                <p className="text-muted-foreground">
                    Create a new Request for Proposal to find suppliers and vendors
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText size="20" />
                        RFP Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">RFP Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Website Development Services"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select>
                                    <SelectTrigger>
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
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Provide a detailed description of what you're looking for..."
                                rows={4}
                                required
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name *</Label>
                                <Input
                                    id="company"
                                    placeholder="Your company name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g., Remote, New York, NY"
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget Range</Label>
                                <Select>
                                    <SelectTrigger>
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deadline">Submission Deadline *</Label>
                                <Input
                                    id="deadline"
                                    type="date"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirements">Requirements & Specifications</Label>
                            <Textarea
                                id="requirements"
                                placeholder="List specific requirements, technical specifications, or evaluation criteria..."
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="additional">Additional Information</Label>
                            <Textarea
                                id="additional"
                                placeholder="Any other relevant information for suppliers..."
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" className="flex-1">
                                Create RFP
                            </Button>
                            <Button type="button" variant="outline" asChild>
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