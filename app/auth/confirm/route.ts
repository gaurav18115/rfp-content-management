import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const token = searchParams.get("token"); // Add support for 'token' parameter
  const type = searchParams.get("type") as EmailOtpType | null;
  const access_token = searchParams.get("access_token");
  const refresh_token = searchParams.get("refresh_token");
  const next = searchParams.get("next") ?? "/";

  // Log all parameters for debugging
  console.log("Confirmation route accessed with URL:", request.url);
  console.log("Confirmation route params:", {
    token_hash,
    token,
    type,
    access_token,
    refresh_token,
    next,
    allParams: Object.fromEntries(searchParams.entries())
  });

  const supabase = await createClient();

  // Handle new Supabase email confirmation format (v2) with 'token' parameter
  if (token && type) {
    console.log("Attempting OTP verification with token and type");

    try {
      // For email confirmation, we need to use the correct parameter structure
      const { error } = await supabase.auth.verifyOtp({
        type,
        token,
        email: '', // Required by type but not used when token is provided
      } as any); // Type assertion to bypass strict typing

      if (!error) {
        console.log("OTP verification successful, redirecting to:", next);
        redirect(next);
      } else {
        console.error("OTP verification error:", error);
        redirect(`/auth/error?error=${encodeURIComponent(error?.message || 'OTP verification failed')}`);
      }
    } catch (verifyError) {
      console.error("Exception during OTP verification:", verifyError);
      redirect(`/auth/error?error=${encodeURIComponent('OTP verification failed with exception')}`);
    }
  }

  // Handle new Supabase email confirmation format (v2) with 'token_hash' parameter
  if (token_hash && type) {
    console.log("Attempting OTP verification with token_hash and type");

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      console.log("OTP verification successful, redirecting to:", next);
      redirect(next);
    } else {
      console.error("OTP verification error:", error);
      redirect(`/auth/error?error=${encodeURIComponent(error?.message || 'OTP verification failed')}`);
    }
  }

  // Handle legacy Supabase email confirmation format (v1)
  if (access_token && refresh_token) {
    console.log("Attempting session setting with access_token and refresh_token");

    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (!error) {
      console.log("Session setting successful, redirecting to:", next);
      redirect(next);
    } else {
      console.error("Session setting error:", error);
      redirect(`/auth/error?error=${encodeURIComponent(error?.message || 'Session setting failed')}`);
    }
  }

  // If no expected parameters, try to check if user is already authenticated
  console.log("No expected confirmation parameters found, checking current user...");

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (user && !userError) {
    console.log("User already authenticated, redirecting to:", next);
    redirect(next);
  }

  // If we get here, we can't confirm the email
  console.error("Unable to confirm email confirmation. All params:", Object.fromEntries(searchParams.entries()));
  redirect(`/auth/error?error=${encodeURIComponent('Unable to confirm your email. Please try logging in or contact support.')}`);
}
