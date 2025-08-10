"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Calendar, MessageSquare, Clock } from "lucide-react";

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        tension: number;
    }[];
}

interface DashboardChartsProps {
    stats: {
        recentRfps: number;
        recentResponses: number;
        totalRfps: number;
        totalResponses: number;
    };
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
    const [chartData, setChartData] = useState<ChartData | null>(null);

    useEffect(() => {
        // Generate sample chart data for the last 6 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const rfpData = [12, 19, 15, 25, 22, 30];
        const responseData = [8, 15, 12, 20, 18, 25];

        setChartData({
            labels: months,
            datasets: [
                {
                    label: 'RFPs Created',
                    data: rfpData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Responses Received',
                    data: responseData,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4
                }
            ]
        });
    }, [stats]);

    // Calculate trends
    const rfpTrend = stats.recentRfps > (stats.totalRfps / 6) ? 'up' : 'down';
    const responseTrend = stats.recentResponses > (stats.totalResponses / 6) ? 'up' : 'down';

    return (
        <div className="space-y-6">
            {/* Trend Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            RFP Activity Trend
                        </CardTitle>
                        <Activity className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            {rfpTrend === 'up' ? (
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                                <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                            <span className={`text-2xl font-bold ${rfpTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {rfpTrend === 'up' ? '+' : '-'}{Math.abs(Math.round((stats.recentRfps / (stats.totalRfps / 6)) * 100 - 100))}%
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {rfpTrend === 'up' ? 'Increased' : 'Decreased'} from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Response Engagement
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            {responseTrend === 'up' ? (
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                                <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                            <span className={`text-2xl font-bold ${responseTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {responseTrend === 'up' ? '+' : '-'}{Math.abs(Math.round((stats.recentResponses / (stats.totalResponses / 6)) * 100 - 100))}%
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {responseTrend === 'up' ? 'Increased' : 'Decreased'} from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Chart */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <span>6-Month Activity Overview</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {chartData ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-400 mb-2">📊</div>
                                <p className="text-gray-500">Chart visualization would go here</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Using a chart library like Chart.js or Recharts
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Avg Response Time
                        </CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">3.2 days</div>
                        <p className="text-xs text-gray-500 mt-1">Industry average: 4.1 days</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Success Rate
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">87%</div>
                        <p className="text-xs text-gray-500 mt-1">RFPs resulting in awards</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Cost Savings
                        </CardTitle>
                        <TrendingDown className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">23%</div>
                        <p className="text-xs text-gray-500 mt-1">Average cost reduction</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 