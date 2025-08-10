import { DashboardStats } from "@/components/dashboard-stats";
import { DashboardCharts } from "@/components/dashboard-charts";
import { RecentActivity } from "@/components/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MessageSquare, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your RFPs.</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button asChild>
                                <Link href="/rfp/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create RFP
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                                        <Plus className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Create RFP</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Start a new request for proposal</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Manage RFPs</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">View and edit existing RFPs</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                                        <MessageSquare className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Review Responses</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Evaluate supplier proposals</p>
                                </CardContent>
                            </Card>

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