import { AuthenticatedLayout } from "@/components/authenticated-layout";

export default function RfpsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
} 