"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
    children,
    allowedRoles,
}: {
    children: React.ReactNode;
    allowedRoles: string[];
}) {

    const { role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {

        if (loading) return;

        if (!role) {
            router.replace("/auth/login");
            return;
        }

        if (!allowedRoles.includes(role)) {

            switch (role) {

                case "admin":
                    router.replace("/admin/dashboard");
                    break;
                    
                case "trainer":
                    router.replace("/trainer/dashboard");
                    break;

                case "client":
                    router.replace("/client/dashboard");
                    break;

                default:
                    router.replace("/auth/login");
            }

        }

    }, [loading, role, router, allowedRoles]);

    if (loading) return null;

    if (!role) return null;

    if (!allowedRoles.includes(role)) return null;

    return children;
}