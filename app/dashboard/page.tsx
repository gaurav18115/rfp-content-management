import { DashboardStats } from "@/components/dashboard-stats";
import { DashboardCharts } from "@/components/dashboard-charts";
import { RecentActivity } from "@/components/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MessageSquare, Users, TrendingUp, UserIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Get user profile
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="dashboard-heading">Dashboard</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}! Here&apos;s what&apos;s happening with your RFPs.
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {profile?.role === 'buyer' && (
                                <Button asChild>
                                    <Link href="/rfps/create" data-testid="create-rfp-header">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create RFP
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* User Profile Card */}
                <div className="mb-8">
                    <Card className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <UserIcon size="20" />
                            <h2 className="font-bold text-xl">Profile Information</h2>
                        </div>

                        {profile ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <span className="text-sm text-muted-foreground">Email:</span>
                                    <p className="font-medium">{profile.email}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Role:</span>
                                    <p className="font-medium capitalize">{profile.role}</p>
                                </div>
                                {profile.first_name && (
                                    <div>
                                        <span className="text-sm text-muted-foreground">First Name:</span>
                                        <p className="font-medium">{profile.first_name}</p>
                                    </div>
                                )}
                                {profile.last_name && (
                                    <div>
                                        <span className="text-sm text-muted-foreground">Last Name:</span>
                                        <p className="font-medium">{profile.last_name}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Profile not found</p>
                        )}

                        <div className="mt-6">
                            <Link href="/profile">
                                <Button variant="outline">
                                    <SettingsIcon size="16" className="mr-2" />
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions Card */}
                <div className="mb-8">
                    <Card className="bg-card border rounded-lg p-6">
                        <h2 className="font-bold text-xl mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {profile?.role === 'buyer' && (
                                <Link href="/rfps/create">
                                    <Button className="w-full" variant="default" data-testid="create-rfp-quick">
                                        Create New RFP
                                    </Button>
                                </Link>
                            )}
                            {profile?.role === 'buyer' && (
                                <Link href="/dashboard/responses">
                                    <Button className="w-full" variant="outline">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Review Responses
                                    </Button>
                                </Link>
                            )}
                            {profile?.role === 'supplier' && (
                                <Link href="/rfps">
                                    <Button className="w-full" variant="default" data-testid="browse-rfps">
                                        Browse RFPs
                                    </Button>
                                </Link>
                            )}
                            <Link href="/rfps/my">
                                <Button className="w-full" variant="outline">
                                    My RFPs
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* Quick Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">My RFPs</CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">12</div>
                            <p className="text-xs text-gray-500 mt-1">Active RFPs</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Responses</CardTitle>
                            <MessageSquare className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">47</div>
                            <p className="text-xs text-gray-500 mt-1">Total responses</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Suppliers</CardTitle>
                            <Users className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">156</div>
                            <p className="text-xs text-gray-500 mt-1">Registered suppliers</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">89%</div>
                            <p className="text-xs text-gray-500 mt-1">Awarded RFPs</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Dashboard Content */}
                <div className="space-y-8">
                    {/* System Overview */}
                    <section>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">System Overview</h2>
                            <p className="text-gray-600 dark:text-gray-400">Comprehensive metrics and insights across your RFP ecosystem</p>
                        </div>
                        <DashboardStats />
                    </section>

                    {/* Analytics & Activity */}
                    <section>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics & Recent Activity</h2>
                            <p className="text-gray-600 dark:text-gray-400">Track trends and stay updated with the latest activities</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Charts Section */}
                            <div className="lg:col-span-2">
                                <DashboardCharts stats={{
                                    recentRfps: 8,
                                    recentResponses: 23,
                                    totalRfps: 45,
                                    totalResponses: 156
                                }} />
                            </div>

                            {/* Recent Activity Section */}
                            <div className="lg:col-span-1">
                                <RecentActivity />
                            </div>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h2>
                            <p className="text-gray-600 dark:text-gray-400">Common tasks and shortcuts to improve your workflow</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Link href="/rfps/create">
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                                            <Plus className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Create RFP</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Start a new request for proposal</p>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/rfps/my">
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Manage RFPs</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">View and edit existing RFPs</p>
                                    </CardContent>
                                </Card>
                            </Link>

                            {profile?.role === 'buyer' && (
                                <Link href="/dashboard/responses">
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardContent className="p-6 text-center">
                                            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                                                <MessageSquare className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Review Responses</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Evaluate supplier proposals</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )}

                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Generate Reports</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Create detailed analytics reports</p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}