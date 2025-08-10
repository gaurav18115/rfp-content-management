"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, MessageSquare, User, Award, AlertCircle } from "lucide-react";

interface ActivityItem {
    id: string;
    type: 'rfp_created' | 'rfp_published' | 'response_submitted' | 'response_approved' | 'user_registered';
    title: string;
    description: string;
    timestamp: string;
    user: string;
    status?: string;
    priority?: 'low' | 'medium' | 'high';
}

export function RecentActivity() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching recent activities
        const mockActivities: ActivityItem[] = [
            {
                id: '1',
                type: 'rfp_created',
                title: 'New RFP Created',
                description: 'Software Development Services for E-commerce Platform',
                timestamp: '2 hours ago',
                user: 'John Smith',
                status: 'draft',
                priority: 'high'
            },
            {
                id: '2',
                type: 'response_submitted',
                title: 'Response Submitted',
                description: 'Proposal for Cloud Infrastructure Project',
                timestamp: '4 hours ago',
                user: 'Tech Solutions Inc.',
                status: 'submitted',
                priority: 'medium'
            },
            {
                id: '3',
                type: 'rfp_published',
                title: 'RFP Published',
                description: 'Marketing Campaign Services',
                timestamp: '1 day ago',
                user: 'Marketing Team',
                status: 'published',
                priority: 'medium'
            },
            {
                id: '4',
                type: 'response_approved',
                title: 'Response Approved',
                description: 'Web Design Services Proposal',
                timestamp: '2 days ago',
                user: 'Creative Agency',
                status: 'approved',
                priority: 'high'
            },
            {
                id: '5',
                type: 'user_registered',
                title: 'New User Registration',
                description: 'Supplier account created',
                timestamp: '3 days ago',
                user: 'Innovation Corp',
                status: 'active',
                priority: 'low'
            }
        ];

        setActivities(mockActivities);
        setLoading(false);
    }, []);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'rfp_created':
                return <FileText className="h-4 w-4 text-blue-600" />;
            case 'rfp_published':
                return <FileText className="h-4 w-4 text-green-600" />;
            case 'response_submitted':
                return <MessageSquare className="h-4 w-4 text-purple-600" />;
            case 'response_approved':
                return <Award className="h-4 w-4 text-emerald-600" />;
            case 'user_registered':
                return <User className="h-4 w-4 text-orange-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
            published: { color: 'bg-blue-100 text-blue-800', label: 'Published' },
            submitted: { color: 'bg-yellow-100 text-yellow-800', label: 'Submitted' },
            approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
            active: { color: 'bg-emerald-100 text-emerald-800', label: 'Active' }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    const getPriorityBadge = (priority: string) => {
        const priorityConfig = {
            low: { color: 'bg-green-100 text-green-800', label: 'Low' },
            medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
            high: { color: 'bg-red-100 text-red-800', label: 'High' }
        };

        const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-3 animate-pulse">
                                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Recent Activity</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex-shrink-0 mt-1">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    {getActivityIcon(activity.type)}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {activity.title}
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        {activity.status && getStatusBadge(activity.status)}
                                        {activity.priority && getPriorityBadge(activity.priority)}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    {activity.description}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center space-x-1">
                                        <User className="h-3 w-3" />
                                        <span>{activity.user}</span>
                                    </span>
                                    <span>{activity.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                        View All Activity
                    </button>
                </div>
            </CardContent>
        </Card>
    );
} 