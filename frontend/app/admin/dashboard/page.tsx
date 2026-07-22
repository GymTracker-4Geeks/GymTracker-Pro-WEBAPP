"use client";

import Link from "next/link";
import { Loader2, Plus, Save, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMe, getUsers, updateUserRole } from "@/services/userService";
import { UserProfile } from "@/lib/types";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/Button";
import { ProfileImage } from "@/components/ui/ProfileImage";

const USERS_PER_PAGE = 20;

export default function DashboardPage() {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [error, setError] = useState<string>('');
    const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>({});
    const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    const observerRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const debouncedSearch = useDebounce(search, 300);

    const handleRoleChange = (userId: number, role: string) => {
        setSelectedRoles((prev) => ({
            ...prev,
            [userId]: role,
        }));
    };

    const handleSaveRole = async (userId: number) => {
        const newRole = selectedRoles[userId];
        if (!newRole) return;

        setUpdatingUserId(userId);
        try {
            await updateUserRole(userId, newRole);

            setUsers(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, role: newRole }
                        : user
                )
            );

            setSelectedRoles(prev => {
                const updated = { ...prev };
                delete updated[userId];
                return updated;
            });
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        } finally {
            setUpdatingUserId(null);
        }
    };

    const fetchMoreUsers = async (pageNumber: number, searchText: string) => {
        if (loading) return;
        if (!hasMore && pageNumber !== 1) return;

        setLoading(true);

        try {
            const response = await getUsers(
                pageNumber,
                USERS_PER_PAGE,
                searchText
            );

            const usersData = response.users;

            if (usersData.length === 0) {
                setHasMore(false);
                return;
            }

            setHasMore(response.has_more);

            setUsers((prev) => {
                const existingIds = new Set(prev.map((user) => user.id));

                const newUsers = usersData.filter(
                    (user) => !existingIds.has(user.id)
                );

                return [...prev, ...newUsers];
            });

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error loading users.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const currentUserData = await getMe();
                setCurrentUser(currentUserData);
            } catch (err) {
                if (err instanceof Error) setError(err.message);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        setUsers([]);
        setHasMore(true);
        setPage(1);
        setLoading(false);
    }, [debouncedSearch]);

    useEffect(() => {
        if (!currentUser) return;

        fetchMoreUsers(page, debouncedSearch);

    }, [page, debouncedSearch, currentUser]);

    const loadingRef = useRef(loading);
    loadingRef.current = loading;
    const hasMoreRef = useRef(hasMore);
    hasMoreRef.current = hasMore;

    useEffect(() => {
        const target = observerRef.current;
        const root = scrollContainerRef.current;

        if (!target || !root) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMoreRef.current && !loadingRef.current) {
                    setPage(prev => prev + 1);
                }
            },
            {
                root,
                threshold: 0.2,
            }
        );

        observer.observe(target);

        return () => {
            observer.unobserve(target);
            observer.disconnect();
        };

    }, []);

    if (error) return <p>{error}</p>;
    if (!currentUser) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                title={`Hi ${currentUser.full_name}! 👋`}
                subtitle="This are all users registered."
                actions={
                    <div className="flex gap-2">
                        <Link href={`/admin/users/new`}
                            className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white">
                            <Plus className="h-4 w-4" /> New User
                        </Link>
                    </div>
                }
            />

            <div className="mt-6 flex items-center">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
                    />
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3"></div>

            <section className="mt-8 rounded-2xl border border-border bg-card p-6">
                <div ref={scrollContainerRef} className="mb-4 max-h-[70vh] overflow-y-auto overflow-x-auto">
                    <table className="w-full min-w-full table-fixed text-sm">
                        <thead className="sticky top-0 z-10 bg-background text-xs uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="w-1/2 px-5 py-3 text-left font-semibold">Client</th>
                                <th className="w-1/4 px-5 py-3 text-left font-semibold">Role</th>
                                <th className="w-1/4 px-5 py-3 text-right font-semibold"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && !loading && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="py-10 text-center text-muted-foreground"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}

                            {users?.map((user) => {
                                const currentRole = selectedRoles[user.id] ?? user.role;
                                const hasChanged = currentRole !== user.role;
                                const isSelf = user.id === currentUser.id;
                                const isSaving = updatingUserId === user.id;

                                return (
                                    <tr
                                        key={user.id}
                                        className="border-t border-border hover:bg-background/40"
                                    >
                                        {isSelf ? (
                                            <td className="hover:bg-primary rounded-full px-5 py-3">

                                                <div className="flex items-center gap-3">
                                                    <ProfileImage className="border-2 border-primary" alt="You" />
                                                    <div className="truncate">
                                                        <p className="font-bold text-sm truncate">Your account</p>
                                                        <p className="text-xs text-muted-foreground truncate">{user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        ) : (
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <ProfileImage className="border-2 border-primary" alt={user.full_name} />
                                                    <div className="truncate">
                                                        <p className="font-semibold truncate">{user.full_name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        )}

                                        <td className="px-5 py-3">
                                            {isSelf ? (
                                                <span className="rounded-full bg-primary/15 px-3 py-2 text-xs font-semibold text-primary">
                                                    Administrator
                                                </span>
                                            ) : (
                                                <select
                                                    value={currentRole}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={isSelf || isSaving}
                                                    className="w-36 rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="client">Client</option>
                                                    <option value="trainer">Trainer</option>
                                                </select>
                                            )}
                                        </td>

                                        <td className="px-5 py-3 text-right h-[60px]">
                                            {hasChanged && (
                                                <Button onClick={() => handleSaveRole(user.id)}
                                                    disabled={isSaving}
                                                    className="rounded-lg text-white bg-primary inline-flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50">
                                                    {isSaving ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Save size={16} />
                                                    )}
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div
                        ref={observerRef}
                        className="flex justify-center py-6"
                    >
                        {loading && (
                            <Loader2
                                className="animate-spin text-primary"
                                size={24}
                            />
                        )}

                        {!hasMore && users.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                No more users.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
