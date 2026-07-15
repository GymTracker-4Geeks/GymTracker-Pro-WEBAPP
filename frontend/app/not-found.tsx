"use client";

import Link from "next/link";
import { getRole } from "@/services/userService";
import { useEffect, useState } from "react";

export default function NotFound() {
    const [info, setInfo] = useState<string| null>(null);
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const data = await getRole();
                setInfo(data);
            } catch (err) {
                console.log(err)
                setUrl('/');
            }
        };
        fetchInfo();
    }, []);

    useEffect(() => {
        if (!info) return;

        if (info === "client") {
            setUrl('/client/dashboard');
        } else if (info === "trainer") {
            setUrl('/trainer/dashboard');
        } else if (info === "admin") {
            setUrl('/admin/dashboard');
        } else {
            setUrl('/');
        }
    }, [info]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <h1 className="text-7xl font-bold">404</h1>

                <p className="mt-3 text-sm text-muted-foreground">
                    Page not found.
                </p>

                {url && (
                    <Link
                        href={url}
                        className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                        Back Home
                    </Link>
                )}
            </div>
        </div>
    );
}