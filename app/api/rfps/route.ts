import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { rfpFormSchema } from "@/lib/validations/rfp";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // Get the current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse and validate the request body
        const body = await req.json();
        const validationResult = rfpFormSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.issues
                },
                { status: 400 }
            );
        }

        const rfpData = validationResult.data;

        // Create the RFP in the database
        const { data: rfp, error: insertError } = await supabase
            .from('rfps')
            .insert({
                title: rfpData.title,
                description: rfpData.description,
                company: rfpData.company,
                location: rfpData.location || null,
                requirements: rfpData.requirements || null,
                budget_range: rfpData.budget_range,
                deadline: rfpData.deadline,
                category: rfpData.category,
                priority: rfpData.priority,
                status: rfpData.status,
                contact_email: rfpData.contact_email || null,
                contact_phone: rfpData.contact_phone || null,
                additional_information: rfpData.additional_information || null,
                attachments: rfpData.attachments || [],
                tags: rfpData.tags || [],
                created_by: user.id, // Use created_by to match database schema
            })
            .select()
            .single();

        if (insertError) {
            console.error("RFP creation error:", insertError);
            return NextResponse.json(
                { error: "Failed to create RFP" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "RFP created successfully",
            rfp
        }, { status: 201 });

    } catch (error) {
        console.error("RFP creation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const supabase = await createClient();

        // Get the current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get RFPs for the current user
        const { data: rfps, error: fetchError } = await supabase
            .from('rfps')
            .select('*')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });

        if (fetchError) {
            console.error("RFP fetch error:", fetchError);
            return NextResponse.json(
                { error: "Failed to fetch RFPs" },
                { status: 500 }
            );
        }

        return NextResponse.json({ rfps });

    } catch (error) {
        console.error("RFP fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 