import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(req.url);

        // Get query parameters
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // Build the query for published RFPs
        let query = supabase
            .from('rfps')
            .select(`
                *,
                user_profiles!rfps_created_by_fkey(
                    company_name,
                    first_name,
                    last_name
                )
            `)
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        // Apply search filter
        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,company.ilike.%${search}%`);
        }

        // Apply category filter
        if (category) {
            query = query.eq('category', category);
        }

        // Get total count for pagination
        const { count, error: countError } = await supabase
            .from('rfps')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published');

        if (countError) {
            console.error("Count error:", countError);
            return NextResponse.json(
                { error: "Failed to get RFP count" },
                { status: 500 }
            );
        }

        // Apply pagination
        query = query.range(offset, offset + limit - 1);

        // Execute the query
        const { data: rfps, error: fetchError } = await query;

        if (fetchError) {
            console.error("RFP fetch error:", fetchError);
            return NextResponse.json(
                { error: "Failed to fetch RFPs" },
                { status: 500 }
            );
        }

        // Get unique categories for filtering
        const { data: categories } = await supabase
            .from('rfps')
            .select('category')
            .eq('status', 'published')
            .not('category', 'is', null);

        const uniqueCategories = [...new Set(categories?.map(c => c.category) || [])];

        return NextResponse.json({
            rfps: rfps || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            },
            filters: {
                categories: uniqueCategories
            }
        });

    } catch (error) {
        console.error("RFP browse error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 