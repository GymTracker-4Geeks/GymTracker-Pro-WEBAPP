"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { Spinner } from "@/components/ui/Spinner"
import { getMe } from "@/services/userService"
import { changeName } from "@/services/userService"
import { UserProfile } from "@/lib/types"
import { useTrainerLayout } from "../layout"

export default function SettingsPage() {
    const { refreshUser } = useTrainerLayout();
    const [userData, setUserData] = useState<UserProfile | null>(null)
    const [inputValue, setInputValue] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        getMe()
            .then((data) => {
                setUserData(data)
                setInputValue(data.full_name)
            })
            .catch((err) => {
                if (err instanceof DOMException && err.name === "AbortError") return
                setError(err instanceof Error ? err.message : "Failed to load profile")
            })
            .finally(() => setIsLoading(false))
        return () => controller.abort()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value)
    }

    const handleName = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")

        if (!inputValue.trim()) {
            setError("Name cannot be empty")
            return
        }

        setIsSubmitting(true)

        try {
            await changeName(inputValue.trim())
            if (userData) {
                setUserData({ ...userData, full_name: inputValue.trim() })
            }
            await refreshUser();
            setSuccessMessage("Name updated successfully!")
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update name")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
    );

    if (error && !userData) {
        return (
            <div className="mx-auto max-w-4xl">
                <PageHeader title="Settings" subtitle="Your profile settings and preferences" />
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl">
            <PageHeader title="Settings" subtitle="Your profile settings and preferences" />

            <form onSubmit={handleName} className="space-y-6">
                <section className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold text-foreground">Profile</h3>
                    <p className="text-xs text-muted-foreground">
                        Update your personal information.
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
                                value={userData?.email ?? ""}
                                disabled
                                className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm outline-none opacity-70 cursor-not-allowed"
                            />
                        </label>
                    </div>
                </section>

                <div className="flex justify-end">
                    {successMessage && (
                        <p className="mr-auto rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                            {successMessage}
                        </p>
                    )}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 gradient-red glow-red px-5 py-2.5 text-sm font-semibold"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner className="h-4 w-4" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
