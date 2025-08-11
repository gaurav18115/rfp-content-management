import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Building2, DollarSign, Clock } from "lucide-react";
import { IRFP } from "@/types/rfp";
import Link from "next/link";

interface RFPCardProps {
    rfp: IRFP & {
        user_profiles?: {
            company_name?: string;
            first_name?: string;
            last_name?: string;
        };
    };
}

export function RFPCard({ rfp }: RFPCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysUntilDeadline = (deadline: string) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Expired';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `${diffDays} days`;
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

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow" data-testid="rfp-card">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2 mb-2" data-testid="rfp-title">
                            {rfp.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2" data-testid="rfp-description">
                            {rfp.description}
                        </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <Badge variant={getPriorityColor(rfp.priority)} data-testid="rfp-priority">
                            {rfp.priority}
                        </Badge>
                        <Badge variant={getCategoryColor(rfp.category)} data-testid="rfp-category">
                            {rfp.category}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="truncate" data-testid="rfp-company">
                            {rfp.user_profiles?.company_name || rfp.company}
                        </span>
                    </div>

                    {rfp.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate" data-testid="rfp-location">{rfp.location}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span data-testid="rfp-budget">{rfp.budget_range}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span data-testid="rfp-deadline">Deadline: {formatDate(rfp.deadline)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className={getDaysUntilDeadline(rfp.deadline) === 'Expired' ? 'text-destructive' : ''} data-testid="rfp-days-remaining">
                            {getDaysUntilDeadline(rfp.deadline)}
                        </span>
                    </div>
                </div>

                {rfp.tags && rfp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1" data-testid="rfp-tags">
                        {rfp.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {rfp.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{rfp.tags.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}

                <div className="mt-auto pt-3">
                    <Button asChild className="w-full" data-testid="rfp-view-details">
                        <Link href={`/rfps/${rfp.id}`}>
                            View Details
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 