import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    // Log all query parameters
    const allParams = Object.fromEntries(searchParams.entries());

    console.log("Debug endpoint accessed with params:", allParams);

    return NextResponse.json({
        message: "Debug endpoint",
        url: req.url,
        params: allParams,
        headers: Object.fromEntries(req.headers.entries()),
        timestamp: new Date().toISOString()
    });
} 