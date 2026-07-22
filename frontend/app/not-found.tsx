"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NotFound() {
    const { role } = useAuth();

    const url = role
        ? `/${role}/dashboard`
        : "/";

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <h1 className="text-7xl font-bold">404</h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    Page not found.
                </p>
                <Link
                    href={url}
                    className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                    Back Home
                </Link>
            </div>
        </div>
    );
}
