import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navigation } from "@/components/navigation";

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
}

export async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
} 