"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, CalendarCheck, ClipboardList, Dumbbell, Plus, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { getMe } from "@/services/userService";
import { getClients, getTrainerRoutines, getUnassignedClients, assignClientToMe } from "@/services/trainerService";
import { GET } from "@/services/api";
import type { UserProfile, ClientProfileExtended, RoutineProfile } from "@/lib/types";

type AgendaSession = {
    id?: number;
    date: string;
    hour: number;
    client: string;
    type: string;
};

export default function DashboardPage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const [totalClients, setTotalClients] = useState(0);
    const [totalRoutines, setTotalRoutines] = useState(0);
    const [todaySessions, setTodaySessions] = useState<AgendaSession[]>([]);

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [unassignedClients, setUnassignedClients] = useState<{ id: number; full_name: string; email: string | null }[]>([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [isAssigning, setIsAssigning] = useState(false);
    const [isLoadingUnassigned, setIsLoadingUnassigned] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const fetchAll = async () => {
            try {
                const userData = await getMe();
                setUser(userData);

                const [clients, routines] = await Promise.all([
                    getClients(controller.signal),
                    getTrainerRoutines(controller.signal),
                ]);
                if (controller.signal.aborted) return;
                setTotalClients(clients.length);
                setTotalRoutines(routines.length);

                const today = new Date().toISOString().split("T")[0];
                const sessions = await GET<AgendaSession[]>(
                    `/api/agenda/sessions?start_date=${today}&end_date=${today}`,
                    controller.signal
                );
                if (controller.signal.aborted) return;
                setTodaySessions(sessions);

                setIsLoading(false);
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") return;
                setError(err instanceof Error ? err.message : "Failed to load");
                setIsLoading(false);
            }
        };

        fetchAll();
        return () => controller.abort();
    }, []);

    const openAssignModal = async () => {
        setAssignModalOpen(true);
        setIsLoadingUnassigned(true);
        try {
            const clients = await getUnassignedClients();
            setUnassignedClients(clients);
        } catch {
            // silent
        } finally {
            setIsLoadingUnassigned(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedClientId) return;
        setIsAssigning(true);
        try {
            await assignClientToMe(Number(selectedClientId));
            setToast({ message: "Client assigned successfully", type: "success" });
            setAssignModalOpen(false);
            setSelectedClientId("");
            setTotalClients((prev) => prev + 1);
            setUnassignedClients((prev) => prev.filter((c) => String(c.id) !== selectedClientId));
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : "Failed to assign client",
                type: "error",
            });
        } finally {
            setIsAssigning(false);
        }
    };

    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (isLoading) return (
        <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                title={`Hi ${user?.full_name ?? "Trainer"}! 👋`}
                subtitle="This is what is happening with your clients today."
                actions={
                    <Button
                        type="button"
                        onClick={openAssignModal}
                        className="inline-flex items-center gap-2 gradient-red glow-red px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                        <Plus className="h-4 w-4" /> Assign Client
                    </Button>
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    href="/trainer/clients"
                    className="card-hover rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                    <div className="flex items-center justify-between">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
                            <Users className="h-5 w-5" />
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">Total Clients</div>
                    <div className="mt-1 text-2xl font-bold text-foreground">{totalClients}</div>
                </Link>

                <Link
                    href="/trainer/routines"
                    className="card-hover rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                    <div className="flex items-center justify-between">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">Total Routines</div>
                    <div className="mt-1 text-2xl font-bold text-foreground">{totalRoutines}</div>
                </Link>

                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                            <CalendarCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">Today Sessions</div>
                    <div className="mt-1 text-2xl font-bold text-foreground">{todaySessions.length}</div>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Today Agenda</h3>
                            <p className="text-xs text-muted-foreground">{todaySessions.length} sessions scheduled</p>
                        </div>
                        <Link href="/trainer/agenda" className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                            View agenda
                        </Link>
                    </div>
                    {todaySessions.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No sessions scheduled for today
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {todaySessions.map((s, i) => (
                                <div key={s.id ?? i} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                                        {String(s.hour).padStart(2, "0")}:00
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm font-medium text-foreground">{s.client}</div>
                                        <div className="text-xs text-muted-foreground">{s.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
                            <p className="text-xs text-muted-foreground">Manage your business</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Link
                            href="/trainer/clients"
                            className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                            <span className="text-sm text-foreground">Manage Clients</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <Link
                            href="/trainer/routines"
                            className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                            <span className="text-sm text-foreground">Manage Routines</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <Link
                            href="/trainer/agenda"
                            className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                            <span className="text-sm text-foreground">View Agenda</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <Link
                            href="/trainer/exercises"
                            className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                            <span className="text-sm text-foreground">Exercise Library</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                    </div>
                </section>
            </div>

            <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} title="Assign Client" className="!max-w-md">
                <div className="space-y-4">
                    {isLoadingUnassigned ? (
                        <div className="flex justify-center py-8"><Spinner className="h-6 w-6" /></div>
                    ) : unassignedClients.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No unassigned clients available</p>
                    ) : (
                        <>
                            <Select
                                label="Client"
                                value={selectedClientId}
                                options={unassignedClients.map((c) => String(c.id))}
                                labels={Object.fromEntries(unassignedClients.map((c) => {
                                    const initials = c.full_name.split(" ").map(n => n[0]?.toUpperCase()).join("")
                                    return [String(c.id), `${initials} — ${c.email ?? "No email"}`]
                                }))}
                                onChange={setSelectedClientId}
                                placeholder="Select a client"
                            />
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setAssignModalOpen(false)}
                                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAssign}
                                    disabled={!selectedClientId || isAssigning}
                                    className="gradient-red glow-red inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isAssigning ? <><Spinner className="h-4 w-4" /> Assigning...</> : "Assign"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
