import { ProfileForm } from "@/components/profile-form";

export default function ProfilePage() {
    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-6">
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
                <p className="text-muted-foreground">
                    Update your profile information and preferences.
                </p>
            </div>


            <ProfileForm />

        </div>
    );
} 