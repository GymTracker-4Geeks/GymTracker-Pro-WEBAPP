"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Users } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { SearchInput } from "@/components/ui/SearchInput"
import { Spinner } from "@/components/ui/Spinner"
import { EmptyState } from "@/components/ui/EmptyState"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import { WEEK_DAYS } from "@/lib/constants"
import { getMyClients, getClientAssignedDays } from "@/services/trainerService"
import { assignRoutineToClient, unassignRoutineFromClient } from "@/services/routineService"
import type { ClientListItem, AssignedDay } from "@/lib/types"

interface AssignRoutineModalProps {
    isOpen: boolean
    onClose: () => void
    routineId: number
    routineName: string
    onAssigned: () => void
}

export function AssignRoutineModal({
    isOpen,
    onClose,
    routineId,
    routineName,
    onAssigned,
}: AssignRoutineModalProps) {
    const [search, setSearch] = useState("")
    const [clients, setClients] = useState<ClientListItem[]>([])
    const [isSearching, setIsSearching] = useState(true)
    const [selectedClient, setSelectedClient] = useState<ClientListItem | null>(null)
    const [selectedDay, setSelectedDay] = useState<string | null>(null)
    const [assignedDays, setAssignedDays] = useState<AssignedDay[]>([])
    const [isLoadingDays, setIsLoadingDays] = useState(false)
    const [isAssigning, setIsAssigning] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
    const [conflictInfo, setConflictInfo] = useState<{
        routineId: number
        routineName: string
        weekDay: string
    } | null>(null)

    useEffect(() => {
        const controller = new AbortController()
        if (!isOpen) return
        setSearch("")
        setSelectedClient(null)
        setSelectedDay(null)
        setAssignedDays([])
        setToast(null)
        setIsSearching(true)
        getMyClients(controller.signal)
            .then(setClients)
            .catch((err) => {
                if (err.name !== "AbortError") console.error(err)
            })
            .finally(() => setIsSearching(false))
        return () => controller.abort()
    }, [isOpen])

    const filteredClients = useMemo(() => {
        if (!search.trim()) return clients
        return clients.filter((c) =>
            c.full_name.toLowerCase().includes(search.toLowerCase())
        )
    }, [clients, search])

    const handleSelectClient = useCallback((client: ClientListItem) => {
        setSelectedClient(client)
        setSelectedDay(null)
        setAssignedDays([])
        setIsLoadingDays(true)
        getClientAssignedDays(client.id)
            .then(setAssignedDays)
            .catch(console.error)
            .finally(() => setIsLoadingDays(false))
    }, [])

    const isDayOccupied = useCallback(
        (day: string) => assignedDays.some((d) => d.week_day === day),
        [assignedDays]
    )

    const getDayRoutine = useCallback(
        (day: string) => assignedDays.find((d) => d.week_day === day),
        [assignedDays]
    )

    const handleSelectDay = useCallback(
        (day: string) => {
            if (isDayOccupied(day)) {
                const existing = getDayRoutine(day)
                if (existing) {
                    setConflictInfo({
                        routineId: existing.routine_id,
                        routineName: existing.routine_name,
                        weekDay: day,
                    })
                }
            } else {
                setSelectedDay(day)
            }
        },
        [isDayOccupied, getDayRoutine]
    )

    const handleAssign = useCallback(async () => {
        if (!selectedClient || !selectedDay) return

        setIsAssigning(true)
        try {
            await assignRoutineToClient({
                routine_id: routineId,
                client_id: selectedClient.id,
                routine_day: selectedDay,
            })

            onAssigned()
            onClose()
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : "Failed to assign routine",
                type: "error",
            })
        } finally {
            setIsAssigning(false)
        }
    }, [selectedClient, selectedDay, routineId, onAssigned, onClose])

    const handleReplaceConfirm = useCallback(async () => {
        if (!conflictInfo || !selectedClient) return

        setIsAssigning(true)
        setConflictInfo(null)
        setSelectedDay(conflictInfo.weekDay)

        try {
            await unassignRoutineFromClient(conflictInfo.routineId, selectedClient.id)
            await assignRoutineToClient({
                routine_id: routineId,
                client_id: selectedClient.id,
                routine_day: conflictInfo.weekDay,
            })

            onAssigned()
            onClose()
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : "Failed to replace routine",
                type: "error",
            })
        } finally {
            setIsAssigning(false)
        }
    }, [conflictInfo, selectedClient, routineId, onAssigned, onClose])

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assign routine" className="!max-w-lg">
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Assigning <span className="font-medium text-foreground">"{routineName}"</span>
                </p>

                {!selectedClient ? (
                    <>
                        <SearchInput
                            value=""
                            onChange={setSearch}
                            placeholder="Search clients..."
                            debounceMs={200}
                        />
                        {isSearching ? (
                            <div className="flex justify-center py-8">
                                <Spinner className="h-6 w-6" />
                            </div>
                        ) : filteredClients.length === 0 ? (
                            <EmptyState
                                icon={<Users className="h-10 w-10" />}
                                title={search ? "No clients found" : "No clients yet"}
                                description={search ? "Try a different search" : "Assign clients to your account first"}
                            />
                        ) : (
                            <div className="max-h-48 space-y-1 overflow-y-auto">
                                {filteredClients.map((client) => (
                                    <button
                                        key={client.id}
                                        type="button"
                                        onClick={() => handleSelectClient(client)}
                                        className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left text-sm transition-all hover:border-primary/40 hover:shadow-sm"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                            {client.full_name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-foreground">
                                            {client.full_name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                                {selectedClient.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    {selectedClient.full_name}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSelectedClient(null)}
                                    className="text-xs text-muted-foreground hover:text-primary"
                                >
                                    Change client
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="mb-3 text-sm font-medium text-foreground">Training day</p>
                            {isLoadingDays ? (
                                <div className="flex justify-center py-6">
                                    <Spinner className="h-5 w-5" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="Select training day">
                                    {WEEK_DAYS.map((day) => {
                                        const occupied = isDayOccupied(day)
                                        const isSelected = selectedDay === day && !occupied
                                        const existing = getDayRoutine(day)

                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => handleSelectDay(day)}
                                                aria-pressed={isSelected}
                                                className={cn(
                                                    "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2.5 text-center transition-all",
                                                    occupied
                                                        ? "cursor-pointer border-orange-500/30 bg-orange-500/5 hover:border-orange-500/50"
                                                        : isSelected
                                                            ? "border-primary bg-primary/15 text-primary"
                                                            : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                                )}
                                            >
                                                <span className="text-[11px] font-semibold leading-none">
                                                    {day.slice(0, 3)}
                                                </span>
                                                {occupied && existing && (
                                                    <Badge variant="body_part">
                                                        {existing.routine_name.length > 8
                                                            ? existing.routine_name.slice(0, 8) + "…"
                                                            : existing.routine_name}
                                                    </Badge>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {toast && (
                            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {toast.message}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isAssigning}
                                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAssign}
                                disabled={!selectedDay || isAssigning}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50",
                                    selectedDay
                                        ? "gradient-red glow-red hover:scale-105"
                                        : "bg-secondary text-muted-foreground"
                                )}
                            >
                                {isAssigning ? (
                                    <>
                                        <Spinner className="h-4 w-4" />
                                        Assigning...
                                    </>
                                ) : (
                                    "Assign"
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>

            <ConfirmDialog
                isOpen={conflictInfo !== null}
                onClose={() => {
                    if (!isAssigning) setConflictInfo(null)
                }}
                onConfirm={handleReplaceConfirm}
                title="Replace routine"
                message={`${selectedClient?.full_name ?? "This client"} already has "${conflictInfo?.routineName}" assigned for ${conflictInfo?.weekDay}. Do you want to replace it with "${routineName}"?`}
                confirmLabel="Replace"
                cancelLabel="Cancel"
                variant="destructive"
                isConfirming={isAssigning}
            />
        </Modal>
    )
}
