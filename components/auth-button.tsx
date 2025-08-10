"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useUser } from "@/lib/contexts/UserContext";
import { LogoutButton } from "./logout-button";

export function AuthButton() {
  const { user, profile, loading } = useUser();

  if (loading) {
    return <div className="text-sm">Loading...</div>;
  }

  if (user && profile) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Hey, {profile.email} ({profile.role})!
        </span>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
