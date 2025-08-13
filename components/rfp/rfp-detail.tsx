import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    MapPin,
    Building2,
    DollarSign,
    Clock,
    FileText,
    Mail,
    Phone,
    Tag,
    AlertCircle
} from "lucide-react";
import { IRFP } from "@/types/rfp";
import { RFPActions } from "./rfp-actions";

interface RFPDetailProps {
    rfp: IRFP & {
        user_profiles?: {
            company_name?: string;
            first_name?: string;
            last_name?: string;
        };
    };
}

export function RFPDetail({ rfp }: RFPDetailProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysUntilDeadline = (deadline: string) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: 'Expired', color: 'text-destructive' };
        if (diffDays === 0) return { text: 'Today', color: 'text-orange-600' };
        if (diffDays === 1) return { text: 'Tomorrow', color: 'text-orange-600' };
        if (diffDays <= 7) return { text: `${diffDays} days`, color: 'text-orange-600' };
        return { text: `${diffDays} days`, color: 'text-muted-foreground' };
    };

    const getPriorityColor = (priority: string): "destructive" | "default" | "secondary" => {
        switch (priority.toLowerCase()) {
            case 'high': return 'destructive';
            case 'medium': return 'default';
            case 'low': return 'secondary';
            default: return 'default';
        }
    };

    const getCategoryColor = (category: string): "default" | "secondary" | "outline" | "destructive" => {
        const colors: ("default" | "secondary" | "outline" | "destructive")[] = ['default', 'secondary', 'outline', 'destructive'];
        const hash = category.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return colors[Math.abs(hash) % colors.length];
    };

    const deadlineInfo = getDaysUntilDeadline(rfp.deadline);
    const isExpired = deadlineInfo.text === 'Expired';

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{rfp.title}</h1>
                        <p className="text-lg text-muted-foreground mb-4">
                            {rfp.description}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <Badge variant={getPriorityColor(rfp.priority)} className="text-sm">
                            {rfp.priority} Priority
                        </Badge>
                        <Badge variant={getCategoryColor(rfp.category)} className="text-sm">
                            {rfp.category}
                        </Badge>
                    </div>
                </div>

                {/* Status and Deadline Alert */}
                {isExpired && (
                    <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">This RFP has expired and is no longer accepting submissions.</span>
                    </div>
                )}

                {!isExpired && deadlineInfo.text !== 'Today' && deadlineInfo.text !== 'Tomorrow' && deadlineInfo.text.includes('7') && (
                    <div className="flex items-center gap-2 p-4 bg-orange-100 border border-orange-200 rounded-lg text-orange-800">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">Deadline approaching! Submit your proposal soon.</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Requirements Section */}
                    {rfp.requirements && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Requirements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none">
                                    {rfp.requirements}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Additional Information */}
                    {rfp.additional_information && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none">
                                    {rfp.additional_information}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Attachments */}
                    {rfp.attachments && rfp.attachments.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Attachments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {rfp.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{attachment}</span>
                                        </div>
                                    ))}
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
                            <CardTitle>Key Information</CardTitle>
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

                            {rfp.location && (
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{rfp.location}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{rfp.budget_range}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{formatDate(rfp.deadline)}</p>
                                    <p className={`text-sm ${deadlineInfo.color}`}>
                                        {deadlineInfo.text}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    {(rfp.contact_email || rfp.contact_phone) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {rfp.contact_email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a
                                            href={`mailto:${rfp.contact_email}`}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            {rfp.contact_email}
                                        </a>
                                    </div>
                                )}
                                {rfp.contact_phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <a
                                            href={`tel:${rfp.contact_phone}`}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            {rfp.contact_phone}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Tags */}
                    {rfp.tags && rfp.tags.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {rfp.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <RFPActions rfpId={rfp.id} isExpired={isExpired} />
                </div>
            </div>
        </div>
    );
}