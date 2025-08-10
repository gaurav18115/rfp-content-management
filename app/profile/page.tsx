import { ProfileForm } from "@/components/profile-form";

export default function ProfilePage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">
                <ProfileForm />
            </div>
        </div>
    );
} 