"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { LogOutIcon, UserIcon, HomeIcon } from "lucide-react";

export function Navigation() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authApi.logout();
            router.push("/auth/login");
        } catch (error) {
            console.error("Logout error:", error);
            // Still redirect even if logout fails
            router.push("/auth/login");
        }
    };

    return (
        <nav className="bg-background border-b px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-6">
                    <Link href="/protected" className="flex items-center gap-2">
                        <HomeIcon size="20" />
                        <span className="font-semibold">RFP Manager</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/rfps" className="text-sm hover:text-foreground/80">
                            Browse RFPs
                        </Link>
                        <Link href="/rfps/my" className="text-sm hover:text-foreground/80">
                            My RFPs
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/profile">
                        <Button variant="ghost" size="sm">
                            <UserIcon size="16" className="mr-2" />
                            Profile
                        </Button>
                    </Link>

                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOutIcon size="16" className="mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
} 