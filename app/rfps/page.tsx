import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Building, MapPin } from "lucide-react";
import Link from "next/link";

export default function RfpsPage() {
    // This is a placeholder - you'll need to fetch actual RFP data
    const sampleRfps = [
        {
            id: "1",
            title: "Software Development Services",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            deadline: "2024-02-15",
            description: "Looking for experienced software developers for web application development.",
            category: "Technology"
        },
        {
            id: "2",
            title: "Office Furniture Supply",
            company: "OfficeMax Solutions",
            location: "New York, NY",
            deadline: "2024-02-20",
            description: "Bulk office furniture supply for new corporate headquarters.",
            category: "Furniture"
        }
    ];

    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-2">Available RFPs</h1>
                <p className="text-muted-foreground">
                    Browse and respond to available Request for Proposals
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sampleRfps.map((rfp) => (
                    <Card key={rfp.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg mb-2">{rfp.title}</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <Building size="16" />
                                        {rfp.company}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <MapPin size="16" />
                                        {rfp.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar size="16" />
                                        Due: {new Date(rfp.deadline).toLocaleDateString()}
                                    </div>
                                </div>
                                <FileText size="20" className="text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                {rfp.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {rfp.category}
                                </span>
                                <Button asChild size="sm">
                                    <Link href={`/rfps/${rfp.id}`}>
                                        View Details
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {sampleRfps.length === 0 && (
                <div className="text-center py-12">
                    <FileText size="48" className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No RFPs Available</h3>
                    <p className="text-muted-foreground">
                        There are currently no RFPs available. Check back later or contact us for more information.
                    </p>
                </div>
            )}
        </div>
    );
} 