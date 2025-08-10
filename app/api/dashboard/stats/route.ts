import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Get counts for different user roles
        const { count: buyerCount, error: buyerError } = await supabase
            .from("user_profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "buyer");

        const { count: supplierCount, error: supplierError } = await supabase
            .from("user_profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "supplier");

        // Get RFP counts by status
        const { count: totalRfps, error: rfpsError } = await supabase
            .from("rfps")
            .select("*", { count: "exact", head: true });

        const { count: publishedRfps, error: publishedError } = await supabase
            .from("rfps")
            .select("*", { count: "exact", head: true })
            .eq("status", "published");

        const { count: activeRfps, error: activeError } = await supabase
            .from("rfps")
            .select("*", { count: "exact", head: true })
            .in("status", ["published", "draft"]);

        const { count: closedRfps, error: closedError } = await supabase
            .from("rfps")
            .select("*", { count: "exact", head: true })
            .eq("status", "closed");

        const { count: awardedRfps, error: awardedError } = await supabase
            .from("rfps")
            .select("*", { count: "exact", head: true })
            .eq("status", "awarded");

        // Get response counts
        const { count: totalResponses, error: responsesError } = await supabase
            .from("rfp_responses")
            .select("*", { count: "exact", head: true });

        const { count: pendingResponses, error: pendingError } = await supabase
            .from("rfp_responses")
            .select("*", { count: "exact", head: true })
            .eq("status", "submitted");

        const { count: underReviewResponses, error: underReviewError } = await supabase
            .from("rfp_responses")
            .select("*", { count: "exact", head: true })
            .eq("status", "under_review");

        const { count: approvedResponses, error: approvedError } = await supabase
            .from("rfp_responses")
            .select("*", { count: "exact", head: true })
            .eq("status", "approved");

        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: recentRfps, error: recentRfpsError } = await supabase
            .from("rfps")
            .select("*", { count: "exact", head: true })
            .gte("created_at", thirtyDaysAgo.toISOString());

        const { count: recentResponses, error: recentResponsesError } = await supabase
            .from("rfp_responses")
            .select("*", { count: "exact", head: true })
            .gte("submitted_at", thirtyDaysAgo.toISOString());

        // Check for any errors
        const errors = [
            buyerError, supplierError, rfpsError, publishedError, activeError,
            closedError, awardedError, responsesError, pendingError, underReviewError,
            approvedError, recentRfpsError, recentResponsesError
        ].filter(Boolean);

        if (errors.length > 0) {
            console.error("Dashboard stats errors:", errors);
        }

        const stats = {
            buyers: buyerCount || 0,
            suppliers: supplierCount || 0,
            totalRfps: totalRfps || 0,
            publishedRfps: publishedRfps || 0,
            activeRfps: activeRfps || 0,
            closedRfps: closedRfps || 0,
            awardedRfps: awardedRfps || 0,
            totalResponses: totalResponses || 0,
            pendingResponses: pendingResponses || 0,
            underReviewResponses: underReviewResponses || 0,
            approvedResponses: approvedResponses || 0,
            recentRfps: recentRfps || 0,
            recentResponses: recentResponses || 0,
            // Calculate percentages
            responseRate: (totalRfps || 0) > 0 ? Math.round(((totalResponses || 0) / (totalRfps || 0)) * 100) : 0,
            approvalRate: (totalResponses || 0) > 0 ? Math.round(((approvedResponses || 0) / (totalResponses || 0)) * 100) : 0,
            // Calculate averages
            avgResponsesPerRfp: (totalRfps || 0) > 0 ? Math.round(((totalResponses || 0) / (totalRfps || 0)) * 10) / 10 : 0,
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard statistics" },
            { status: 500 }
        );
    }
} 