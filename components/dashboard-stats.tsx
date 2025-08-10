"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, MessageSquare, Clock, CheckCircle, AlertCircle, TrendingUp, Award, XCircle, BarChart3 } from "lucide-react";

interface DashboardStats {
    buyers: number;
    suppliers: number;
    totalRfps: number;
    publishedRfps: number;
    activeRfps: number;
    closedRfps: number;
    awardedRfps: number;
    totalResponses: number;
    pendingResponses: number;
    underReviewResponses: number;
    approvedResponses: number;
    recentRfps: number;
    recentResponses: number;
    responseRate: number;
    approvalRate: number;
    avgResponsesPerRfp: number;
}

export function DashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/dashboard/stats");
                if (!response.ok) {
                    throw new Error("Failed to fetch dashboard statistics");
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        // Refresh stats every 5 minutes
        const interval = setInterval(fetchStats, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="pb-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">Failed to load dashboard statistics</p>
                <p className="text-sm text-gray-500 mt-2">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        {
            title: "Total Buyers",
            value: stats.buyers,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            description: "Registered buyer accounts"
        },
        {
            title: "Total Suppliers",
            value: stats.suppliers,
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
            description: "Registered supplier accounts"
        },
        {
            title: "Total RFPs",
            value: stats.totalRfps,
            icon: FileText,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            description: "All RFPs created"
        },
        {
            title: "Published RFPs",
            value: stats.publishedRfps,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            description: "Currently active RFPs"
        },
        {
            title: "Active RFPs",
            value: stats.activeRfps,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            description: "Draft and published RFPs"
        },
        {
            title: "Closed RFPs",
            value: stats.closedRfps,
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            description: "Completed RFPs"
        },
        {
            title: "Awarded RFPs",
            value: stats.awardedRfps,
            icon: Award,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            description: "Successfully awarded"
        },
        {
            title: "Total Responses",
            value: stats.totalResponses,
            icon: MessageSquare,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            description: "All submitted proposals"
        },
        {
            title: "Pending Review",
            value: stats.pendingResponses,
            icon: Clock,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            description: "Awaiting review"
        },
        {
            title: "Under Review",
            value: stats.underReviewResponses,
            icon: BarChart3,
            color: "text-cyan-600",
            bgColor: "bg-cyan-50",
            description: "Currently being evaluated"
        },
        {
            title: "Approved Responses",
            value: stats.approvedResponses,
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            description: "Successfully approved"
        },
        {
            title: "Response Rate",
            value: `${stats.responseRate}%`,
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            description: "RFPs with responses"
        },
        {
            title: "Approval Rate",
            value: `${stats.approvalRate}%`,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
            description: "Response success rate"
        },
        {
            title: "Avg Responses/RFP",
            value: stats.avgResponsesPerRfp,
            icon: BarChart3,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            description: "Average engagement per RFP"
        },
        {
            title: "Recent RFPs (30d)",
            value: stats.recentRfps,
            icon: TrendingUp,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            description: "New RFPs this month"
        },
        {
            title: "Recent Responses (30d)",
            value: stats.recentResponses,
            icon: TrendingUp,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            description: "New responses this month"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.slice(0, 4).map((card, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${card.bgColor}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                            <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {statCards.slice(4).map((card, index) => (
                    <Card key={index + 4} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${card.bgColor}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                            <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                        Create New RFP
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                        View All RFPs
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
                        Manage Responses
                    </button>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm">
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    );
} 