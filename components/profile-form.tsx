"use client";

import { useState, useEffect } from "react";
import { profileApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/lib/contexts/UserContext";

export function ProfileForm() {
    const { profile, refreshProfile } = useUser();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        company_name: "",
        contact_phone: "",
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                company_name: profile.company_name || "",
                contact_phone: profile.contact_phone || "",
            });
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await profileApi.update(formData.company_name, formData.contact_phone);
            setSuccess("Profile updated successfully!");
            await refreshProfile();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (!profile) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                        Loading profile...
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                    Update your company information and contact details
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            disabled
                            className="bg-muted"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                            id="role"
                            value={profile.role}
                            disabled
                            className="bg-muted"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="company_name">Company Name</Label>
                        <Input
                            id="company_name"
                            value={formData.company_name}
                            onChange={(e) =>
                                setFormData({ ...formData, company_name: e.target.value })
                            }
                            placeholder="Enter your company name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="contact_phone">Contact Phone</Label>
                        <Input
                            id="contact_phone"
                            value={formData.contact_phone}
                            onChange={(e) =>
                                setFormData({ ...formData, contact_phone: e.target.value })
                            }
                            placeholder="Enter your contact phone"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                    {success && (
                        <p className="text-sm text-green-500">{success}</p>
                    )}
                    <Button type="submit" disabled={saving} className="w-full">
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 