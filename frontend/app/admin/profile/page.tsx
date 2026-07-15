"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "../layout";
import { Button } from "@/components/ui/Button";
import { changeName, getMe } from "@/services/userService";
import { UserProfile } from "@/lib/types";

export default function ProfilePage() {
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        fetchInfoProfile();
    }, []);

    useEffect(() => {
        if (userData?.full_name) {
            setInputValue(userData.full_name);
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value);
    };

    const handleName = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await changeName(inputValue);
            if (userData) {
                setUserData({ ...userData, full_name: inputValue });
            }
            alert("Name updated successfully!");
        } catch (err: any) {
            console.error("Error updating name:", err);
            setError(err?.response?.data?.error || "Error al actualizar el nombre");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchInfoProfile = async () => {
        try {
            const data = await getMe();
            setUserData(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    };

    if (error) return <p className="text-red-500 p-4">{error}</p>;
    if (!userData) return <p className="p-4">Loading...</p>;

    return (
        <div className="mx-auto max-w-4xl">
            <PageHeader title="Settings" subtitle="Your profile settings and preferences" />

            <form onSubmit={handleName} className="space-y-6">
                <section className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold">Profile</h3>
                    <p className="text-xs text-muted-foreground">
                        You can change your information.
                    </p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <label className="block">
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Name
                            </span>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleChange}
                                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary/60"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Email
                            </span>
                            <input
                                type="email"
                                defaultValue={userData?.email}
                                disabled
                                className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm outline-none opacity-70 cursor-not-allowed"
                            />
                        </label>
                    </div>
                </section>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 gradient-red glow-red px-5 py-2.5 text-sm font-semibold"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
