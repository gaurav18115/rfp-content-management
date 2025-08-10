import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Building, MapPin, Plus, Eye, Edit } from "lucide-react";
import Link from "next/link";

export default function MyRfpsPage() {
    // This is a placeholder - you'll need to fetch actual user RFP data
    const myRfps = [
        {
            id: "1",
            title: "Website Redesign Project",
            company: "My Company",
            location: "Remote",
            deadline: "2024-03-01",
            status: "draft",
            responses: 0,
            category: "Web Design"
        },
        {
            id: "2",
            title: "Marketing Campaign Services",
            company: "My Company",
            location: "Remote",
            deadline: "2024-03-15",
            status: "published",
            responses: 3,
            category: "Marketing"
        }
    ];

    const myResponses = [
        {
            id: "1",
            rfpTitle: "Software Development Services",
            company: "TechCorp Inc.",
            submittedAt: "2024-01-15",
            status: "submitted",
            category: "Technology"
        }
    ];

    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-2">My RFPs & Responses</h1>
                <p className="text-muted-foreground">
                    Manage your created RFPs and track your responses
                </p>
            </div>

            {/* My Created RFPs */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">My RFPs</h2>
                    <Button asChild>
                        <Link href="/rfps/create">
                            <Plus size="16" className="mr-2" />
                            Create New RFP
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myRfps.map((rfp) => (
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
                                            <Calendar size="16" />
                                            Due: {new Date(rfp.deadline).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <FileText size="20" className="text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${rfp.status === 'published'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {rfp.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {rfp.category}
                                    </span>
                                </div>

                                <div className="text-sm text-muted-foreground mb-4">
                                    {rfp.status === 'published' ? `${rfp.responses} responses` : 'Not yet published'}
                                </div>

                                <div className="flex gap-2">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/rfps/${rfp.id}`}>
                                            <Eye size="16" className="mr-2" />
                                            View
                                        </Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link href={`/rfps/${rfp.id}/edit`}>
                                            <Edit size="16" className="mr-2" />
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {myRfps.length === 0 && (
                    <div className="text-center py-12">
                        <FileText size="48" className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No RFPs Created Yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Start by creating your first RFP to find suppliers and vendors.
                        </p>
                        <Button asChild>
                            <Link href="/rfps/create">
                                <Plus size="16" className="mr-2" />
                                Create Your First RFP
                            </Link>
                        </Button>
                    </div>
                )}
            </section>

            {/* My Responses */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">My Responses</h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myResponses.map((response) => (
                        <Card key={response.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-lg mb-2">{response.rfpTitle}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <Building size="16" />
                                    {response.company}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar size="16" />
                                    Submitted: {new Date(response.submittedAt).toLocaleDateString()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {response.category}
                                    </span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        {response.status}
                                    </span>
                                </div>

                                <Button asChild variant="outline" size="sm" className="w-full">
                                    <Link href={`/rfps/${response.id}/response`}>
                                        <Eye size="16" className="mr-2" />
                                        View Response
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {myResponses.length === 0 && (
                    <div className="text-center py-12">
                        <FileText size="48" className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Responses Yet</h3>
                        <p className="text-muted-foreground">
                            You haven't responded to any RFPs yet. Browse available RFPs to get started.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
} 