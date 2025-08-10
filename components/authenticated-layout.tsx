import { Navigation } from "@/components/navigation";

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
} 