"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/contexts/UserContext";

export function LogoutButton() {
  const { signOut } = useUser();

  return <Button onClick={signOut}>Logout</Button>;
}
