import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// This route is a placeholder for future server-side profile sync if needed.
// For now, all profile creation is handled client-side after sign-up.

export async function POST(req: NextRequest) {
  // Not implemented, as profile creation is handled in the sign-up form.
  return NextResponse.json({ ok: true });
}
