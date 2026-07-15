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
import { es } from "date-fns/locale";
import { PageHeader } from "../layout";
import { cn } from "@/lib/utils";

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
    const [sessions, setSessions] = React.useState<Sess[]>([]);
    const [clients, setClients] = React.useState<ClientListItem[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    const startOfWeekConst = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const endOfWeekConst = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const currentWeekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekConst, i));

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const startStr = format(startOfWeekConst, "yyyy-MM-dd");
            const endStr = format(endOfWeekConst, "yyyy-MM-dd");

            const data = await GET<Sess[]>(`/api/agenda/sessions?start_date=${startStr}&end_date=${endStr}`);
            setSessions(data);
        } catch (error) {
            console.error("Error retrieving Flask sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const data = await getMyClients();
            setClients(data);
        } catch (error) {
            console.error("Error retrieving the list of assigned clients:", error);
        }
    };

    React.useEffect(() => {
        fetchSessions();
    }, [selectedDate]);

    React.useEffect(() => {
        fetchClients();
    }, []);

    const handleCreateSession = async (dateStr: string, hourIndex: number) => {
        if (clients.length === 0) {
            alert("There are no clients assigned to your profile to schedule sessions.");
            return;
        }

        const listaClientesTexto = clients.map(c => `${c.id}: ${c.full_name}`).join("\n");
        const clientIdInput = prompt(`Select the assigned client ID:\n\n${listaClientesTexto}`);

        if (!clientIdInput) return;
        const clientId = parseInt(clientIdInput);

        if (isNaN(clientId) || !clients.some(c => c.id === clientId)) {
            alert("Invalid client ID.");
            return;
        }

        const sessionType = prompt("Session Type:", "1-on-1") || "1-on-1";

        const newSession = {
            date: dateStr,
            hour: hourIndex,
            type: sessionType,
            color: "bg-primary/90",
            client_id: clientId
        };

        try {
            await POST<any, typeof newSession>("/api/agenda/sessions", newSession);
            fetchSessions();
        } catch (error: any) {
            console.error("Error sending the session via POST:", error);
            alert(error.message || "The session could not be scheduled.");
        }
    };

    const handlePrevWeek = () => setSelectedDate((prev) => subWeeks(prev, 1));
    const handleNextWeek = () => setSelectedDate((prev) => addWeeks(prev, 1));
    const handleToday = () => setSelectedDate(new Date());

    const startMonth = format(startOfWeekConst, "MMMM", { locale: es });
    const endMonth = format(endOfWeekConst, "MMMM", { locale: es });
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
                                Esta semana
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
                            <Plus className="h-4 w-4" /> Nueva sesión
                        </button>
                    </div>
                }
            />

            <div className="flex flex-col gap-6 lg:flex-row items-start mt-4">

                {/* Selector Lateral Izquierdo: Tu componente integrado */}
                <div className="rounded-2xl border border-border bg-card p-3 shrink-0 shadow-sm mx-auto lg:mx-0">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                    />
                </div>

                {/* Panel Derecho: Rejilla horaria dinámica */}
                <div className="flex-1 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm relative">
                    {loading && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-50 flex items-center justify-center text-sm font-medium text-muted-foreground">
                            Sincronizando con la base de datos...
                        </div>
                    )}

                    <div
                        className="grid min-w-[700px] md:min-w-0"
                        style={{ gridTemplateColumns: "60px repeat(7, minmax(0, 1fr))" }}
                    >
                        {/* Esquina superior izquierda vacía */}
                        <div className="border-b border-r border-border bg-background/40 p-3" />

                        {/* Mapeo de cabeceras de días (Eje X superior) */}
                        {currentWeekDays.map((day) => {
                            const esHoy = isSameDay(day, new Date());
                            return (
                                <div key={day.toISOString()} className={cn("border-b border-r border-border p-3 text-center text-xs font-semibold uppercase tracking-wider", esHoy ? "bg-primary/5 text-primary" : "bg-background/40 text-muted-foreground")}>
                                    <div className="text-[10px] opacity-70">{format(day, "eee", { locale: es })}</div>
                                    <div className={cn("text-sm font-bold mt-0.5 mx-auto flex h-6 w-6 items-center justify-center rounded-full", esHoy && "bg-primary text-primary-foreground")}>
                                        {format(day, "d")}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Renderizado de filas de horas (Eje Y lateral) */}
                        {hours.map((h, hi) => (
                            <div key={h} className="contents">
                                <div className="border-b border-r border-border bg-background/30 p-2 text-right text-[11px] font-medium text-muted-foreground flex items-center justify-end h-14">
                                    {h}:00
                                </div>

                                {/* Renderizado de las celdas cruzadas para cada día a la hora actual */}
                                {currentWeekDays.map((day) => {
                                    const dateStr = format(day, "yyyy-MM-dd");
                                    const s = sessions.find((x) => x.date === dateStr && x.hour === hi);

                                    return (
                                        <div
                                            key={`${h}-${day.toISOString()}`}
                                            // Se actualizó la lógica para interceptar de forma reactiva la eliminación de registros
                                            onClick={async () => {
                                                if (!s) {
                                                    handleCreateSession(dateStr, hi);
                                                } else {
                                                    const confirmar = confirm(`¿Estás seguro de que deseas eliminar la sesión de ${s.client}?`);
                                                    if (!confirmar || !s.id) return;

                                                    try {
                                                        await DELETE(`/api/agenda/sessions/${s.id}`);
                                                        fetchSessions();
                                                    } catch (error: any) {
                                                        console.error("Error al eliminar la sesión:", error);
                                                        alert(error.message || "No se pudo eliminar la sesión del servidor.");
                                                    }
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
        </div>
    );
}