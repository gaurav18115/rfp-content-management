import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon, UserIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", data.claims.sub)
    .single();

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Welcome to your dashboard! You are now authenticated.
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Profile Card */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <UserIcon size="20" />
            <h2 className="font-bold text-xl">Profile Information</h2>
          </div>

          {profile ? (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Role:</span>
                <p className="font-medium capitalize">{profile.role}</p>
              </div>
              {profile.first_name && (
                <div>
                  <span className="text-sm text-muted-foreground">First Name:</span>
                  <p className="font-medium">{profile.first_name}</p>
                </div>
              )}
              {profile.last_name && (
                <div>
                  <span className="text-sm text-muted-foreground">Last Name:</span>
                  <p className="font-medium">{profile.last_name}</p>
                </div>
              )}
              {profile.company_name && (
                <div>
                  <span className="text-sm text-muted-foreground">Company:</span>
                  <p className="font-medium">{profile.company_name}</p>
                </div>
              )}
              {profile.contact_phone && (
                <div>
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <p className="font-medium">{profile.contact_phone}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Profile not found</p>
          )}

          <div className="mt-6">
            <Link href="/profile">
              <Button variant="outline" className="w-full">
                <SettingsIcon size="16" className="mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="font-bold text-xl mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {profile?.role === 'buyer' && (
              <Link href="/rfps/create">
                <Button className="w-full" variant="default">
                  Create New RFP
                </Button>
              </Link>
            )}
            {profile?.role === 'supplier' && (
              <Link href="/rfps">
                <Button className="w-full" variant="default">
                  Browse RFPs
                </Button>
              </Link>
            )}
            <Link href="/rfps/my">
              <Button className="w-full" variant="outline">
                My RFPs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <h2 className="font-bold text-xl mb-4">Account Details</h2>
        <div className="bg-background border rounded p-4">
          <pre className="text-xs font-mono overflow-auto">
            {JSON.stringify(data.claims, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
