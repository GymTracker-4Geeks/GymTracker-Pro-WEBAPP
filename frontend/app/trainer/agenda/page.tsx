"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import {
    startOfWeek,
    endOfWeek,
    addWeeks,
    subWeeks,
    format,
    addDays,
    isSameDay
} from "date-fns";
import { enUS } from "date-fns/locale";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { Toast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

import { GET, POST, DELETE } from "@/services/api";
import { getMyClients } from "@/services/trainerService";
import { ClientListItem } from "@/lib/types";

const hours = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];

type Sess = {
    id?: number;
    date: string;
    hour: number;
    client: string;
    type: string;
    color: string;
    client_id: number;
    trainer_id: number;
};

export default function Agenda() {
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
    const [today] = React.useState(() => new Date());
    const [sessions, setSessions] = React.useState<Sess[]>([]);
    const [clients, setClients] = React.useState<ClientListItem[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null);
    const [deleteTarget, setDeleteTarget] = React.useState<{ session: Sess; dateStr: string } | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [sessionModalOpen, setSessionModalOpen] = React.useState(false);
    const [sessionDateStr, setSessionDateStr] = React.useState("");
    const [sessionHour, setSessionHour] = React.useState(0);
    const [selectedClientId, setSelectedClientId] = React.useState("");
    const [sessionType, setSessionType] = React.useState("1-on-1");
    const [isCreating, setIsCreating] = React.useState(false);

    const startOfWeekConst = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const endOfWeekConst = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const currentWeekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekConst, i));
    const startStr = format(startOfWeekConst, "yyyy-MM-dd");
    const endStr = format(endOfWeekConst, "yyyy-MM-dd");

    const fetchSessions = React.useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        try {
            const data = await GET<Sess[]>(`/api/agenda/sessions?start_date=${startStr}&end_date=${endStr}`, signal);
            setSessions(data);
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") return;
            console.error("Error retrieving sessions:", error);
        } finally {
            setLoading(false);
        }
    }, [startStr, endStr]);

    const fetchClients = React.useCallback(async (signal?: AbortSignal) => {
        try {
            const data = await getMyClients(signal);
            setClients(data);
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") return;
            console.error("Error retrieving clients:", error);
        }
    }, []);

    React.useEffect(() => {
        const controller = new AbortController();
        fetchSessions(controller.signal);
        return () => controller.abort();
    }, [fetchSessions]);

    React.useEffect(() => {
        const controller = new AbortController();
        fetchClients(controller.signal);
        return () => controller.abort();
    }, [fetchClients]);

    const handleCreateSession = async (dateStr: string, hourIndex: number) => {
        if (clients.length === 0) {
            setToast({ message: "There are no clients assigned to your profile to schedule sessions.", type: "error" });
            return;
        }
        setSessionDateStr(dateStr);
        setSessionHour(hourIndex);
        setSelectedClientId("");
        setSessionType("1-on-1");
        setSessionModalOpen(true);
    };

    const handleCreateSubmit = async () => {
        if (!selectedClientId) {
            setToast({ message: "Please select a client.", type: "error" });
            return;
        }

        setIsCreating(true);
        try {
            const newSession = {
                date: sessionDateStr,
                hour: sessionHour,
                type: sessionType,
                color: "bg-primary/90",
                client_id: parseInt(selectedClientId),
            };
            await POST<{ message: string }, typeof newSession>("/api/agenda/sessions", newSession);
            setSessionModalOpen(false);
            fetchSessions();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "The session could not be scheduled.";
            setToast({ message, type: "error" });
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteConfirm = React.useCallback(async () => {
        if (!deleteTarget || !deleteTarget.session.id) return;
        setIsDeleting(true);
        try {
            await DELETE(`/api/agenda/sessions/${deleteTarget.session.id}`);
            fetchSessions();
            setDeleteTarget(null);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Could not delete the session.";
            setToast({ message, type: "error" });
        } finally {
            setIsDeleting(false);
        }
    }, [deleteTarget, fetchSessions]);

    const handlePrevWeek = () => setSelectedDate((prev) => subWeeks(prev, 1));
    const handleNextWeek = () => setSelectedDate((prev) => addWeeks(prev, 1));
    const handleToday = () => setSelectedDate(new Date());

    const startMonth = format(startOfWeekConst, "MMMM", { locale: enUS });
    const endMonth = format(endOfWeekConst, "MMMM", { locale: enUS });
    const weekSubtitle = startMonth === endMonth
        ? `Week of ${format(startOfWeekConst, "MMMM d")} to ${format(endOfWeekConst, "d")}`
        : `Week of ${format(startOfWeekConst, "MMMM d")} to ${format(endOfWeekConst, "MMMM d")}`;

    return (
        <div className="mx-auto max-w-7xl px-4">
            <PageHeader
                title="Agenda"
                subtitle={weekSubtitle}
                actions={
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
                            <button type="button" onClick={handlePrevWeek} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={handleToday} className="px-2 text-sm font-medium hover:text-foreground">
                                This week
                            </button>
                            <button type="button" onClick={handleNextWeek} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleCreateSession(format(new Date(), "yyyy-MM-dd"), 0)}
                            className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                        >
                            <Plus className="h-4 w-4" /> New Session
                        </button>
                    </div>
                }
            />

            <div className="flex flex-col gap-6 lg:flex-row items-start mt-4">
                <div className="rounded-2xl border border-border bg-card p-3 shrink-0 shadow-sm mx-auto lg:mx-0">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                    />
                </div>

                <div className="flex-1 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm relative">
                    {loading && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-50 flex items-center justify-center text-sm font-medium text-muted-foreground">
                            Loading...
                        </div>
                    )}

                    <div
                        className="grid min-w-[700px] md:min-w-0"
                        style={{ gridTemplateColumns: "60px repeat(7, minmax(0, 1fr))" }}
                    >
                        <div className="border-b border-r border-border bg-background/40 p-3" />

                        {currentWeekDays.map((day) => {
                            const esHoy = isSameDay(day, today);
                            return (
                                <div key={day.toISOString()} className={cn("border-b border-r border-border p-3 text-center text-xs font-semibold uppercase tracking-wider", esHoy ? "bg-primary/5 text-primary" : "bg-background/40 text-muted-foreground")}>
                                    <div className="text-[10px] opacity-70">{format(day, "eee", { locale: enUS })}</div>
                                    <div className={cn("text-sm font-bold mt-0.5 mx-auto flex h-6 w-6 items-center justify-center rounded-full", esHoy && "bg-primary text-primary-foreground")}>
                                        {format(day, "d")}
                                    </div>
                                </div>
                            );
                        })}

                        {hours.map((h, hi) => (
                            <div key={h} className="contents">
                                <div className="border-b border-r border-border bg-background/30 p-2 text-right text-[11px] font-medium text-muted-foreground flex items-center justify-end h-14">
                                    {h}:00
                                </div>

                                {currentWeekDays.map((day) => {
                                    const dateStr = format(day, "yyyy-MM-dd");
                                    const s = sessions.find((x) => x.date === dateStr && x.hour === hi);

                                    return (
                                        <div
                                            key={`${h}-${day.toISOString()}`}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={s ? `${s.client} - ${s.type}` : `Create session at ${h}:00`}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    if (s) {
                                                        setDeleteTarget({ session: s, dateStr });
                                                    } else {
                                                        handleCreateSession(dateStr, hi);
                                                    }
                                                }
                                            }}
                                            onClick={() => {
                                                if (s) {
                                                    setDeleteTarget({ session: s, dateStr });
                                                } else {
                                                    handleCreateSession(dateStr, hi);
                                                }
                                            }}
                                            className="relative h-14 border-b border-r border-border hover:bg-background/40 transition-colors group cursor-pointer"
                                        >
                                            {s && (
                                                <div className={cn("absolute inset-1 rounded-md p-1.5 text-[11px] leading-tight text-white shadow-md flex flex-col justify-between transition-transform group-hover:scale-[1.02]", s.color)}>
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="truncate font-semibold">{s.client}</div>
                                                        <div className="truncate opacity-85 text-[10px]">{s.type}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                onClose={() => { if (!isDeleting) setDeleteTarget(null) }}
                onConfirm={handleDeleteConfirm}
                title="Delete Session"
                message={`Are you sure you want to delete the session for ${deleteTarget?.session.client}?`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="destructive"
                isConfirming={isDeleting}
            />

            <Modal isOpen={sessionModalOpen} onClose={() => setSessionModalOpen(false)} title="New Session" className="!max-w-sm">
                <div className="space-y-4">
                    <Select
                        label="Client"
                        value={selectedClientId}
                        options={clients.map((c) => String(c.id))}
                        labels={Object.fromEntries(clients.map((c) => {
                            const initials = c.full_name.split(" ").map(n => n[0]?.toUpperCase()).join("")
                            return [String(c.id), `${initials} — ${c.full_name}`]
                        }))}
                        onChange={setSelectedClientId}
                        placeholder="Select a client"
                    />
                    <Input
                        label="Session Type"
                        value={sessionType}
                        onChange={(e) => setSessionType(e.target.value)}
                        placeholder="e.g. 1-on-1"
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setSessionModalOpen(false)}
                            disabled={isCreating}
                            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateSubmit}
                            disabled={!selectedClientId || isCreating}
                            className="gradient-red glow-red inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isCreating ? <><Spinner className="h-4 w-4" /> Creating...</> : "Create"}
                        </button>
                    </div>
                </div>
            </Modal>

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
}
