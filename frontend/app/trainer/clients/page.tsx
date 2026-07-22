"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Plus, Search, Users } from "lucide-react"
import { SearchInput } from "@/components/ui/SearchInput"
import { Select } from "@/components/ui/Select"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Toast } from "@/components/ui/Toast"
import { PageHeader } from "@/components/ui/PageHeader"
import { ClientCard } from "@/components/clients/ClientCard"
import { ClientDetailModal } from "@/components/clients/ClientDetailModal"
import { getClients, unassignClient } from "@/services/trainerService"
import type { ClientProfileExtended } from "@/lib/types"

export default function ClientsPage() {
    const [clients, setClients] = useState<ClientProfileExtended[]>([])
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("A-Z")
    const [selectedClient, setSelectedClient] = useState<ClientProfileExtended | null>(null)
    const [removeTarget, setRemoveTarget] = useState<ClientProfileExtended | null>(null)
    const [isRemoving, setIsRemoving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const fetchClients = useCallback((signal?: AbortSignal) => {
        setIsLoading(true)
        getClients(signal)
            .then((data) => {
                setClients(data)
                setIsLoading(false)
            })
            .catch((err) => {
                if (err instanceof DOMException && err.name === "AbortError") return
                console.error(err)
                setIsLoading(false)
            })
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchClients(controller.signal)
        return () => controller.abort()
    }, [fetchClients])

    const sortedClients = useMemo(() => {
        const sorted = [...clients]
        switch (sortBy) {
            case "Most routines":
                return sorted.sort((a, b) => (b.routine_ids?.length ?? 0) - (a.routine_ids?.length ?? 0))
            case "Least routines":
                return sorted.sort((a, b) => (a.routine_ids?.length ?? 0) - (b.routine_ids?.length ?? 0))
            case "Z-A":
                return sorted.sort((a, b) => b.full_name.localeCompare(a.full_name))
            case "A-Z":
            default:
                return sorted.sort((a, b) => a.full_name.localeCompare(b.full_name))
        }
    }, [clients, sortBy])

    const filteredClients = useMemo(() => {
        if (!search.trim()) return sortedClients
        const term = search.toLowerCase()
        return sortedClients.filter(
            (c) =>
                c.full_name.toLowerCase().includes(term) ||
                (c.email ?? "").toLowerCase().includes(term)
        )
    }, [sortedClients, search])

    const handleRemove = useCallback(async () => {
        if (!removeTarget) return
        setIsRemoving(true)
        try {
            await unassignClient(removeTarget.id)
            setToast({ message: `"${removeTarget.full_name}" removed`, type: "success" })
            setRemoveTarget(null)
            fetchClients()
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : "Failed to remove client",
                type: "error",
            })
        } finally {
            setIsRemoving(false)
        }
    }, [removeTarget, fetchClients])

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                title="Clients"
                subtitle="Manage your assigned clients"
                actions={
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" /> New Client
                    </button>
                }
            />

            <div className="mb-5 flex items-center gap-4">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search clients..."
                    debounceMs={300}
                    className="flex-1"
                />
                <div className="w-44 flex-shrink-0">
                    <Select
                        label="Sort by"
                        value={sortBy}
                        options={["A-Z", "Z-A", "Most routines", "Least routines"]}
                        onChange={setSortBy}
                        placeholder="Select order"
                    />
                </div>
            </div>

            {filteredClients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    {search ? (
                        <>
                            <Search className="mb-4 h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
                            <p className="text-sm font-medium text-muted-foreground">No clients found</p>
                            <p className="mt-1 text-xs text-muted-foreground/60">Try a different search term</p>
                        </>
                    ) : (
                        <>
                            <Users className="mb-4 h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
                            <p className="text-sm font-medium text-muted-foreground">No clients yet</p>
                            <p className="mt-1 text-xs text-muted-foreground/60">Clients assigned to you will appear here</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredClients.map((c) => (
                        <ClientCard
                            key={c.id}
                            client={c}
                            onSelect={() => setSelectedClient(c)}
                            onRemove={() => setRemoveTarget(c)}
                        />
                    ))}
                </div>
            )}

            {selectedClient && (
                <ClientDetailModal
                    isOpen={true}
                    onClose={() => setSelectedClient(null)}
                    client={selectedClient}
                />
            )}

            <ConfirmDialog
                isOpen={removeTarget !== null}
                onClose={() => {
                    if (!isRemoving) setRemoveTarget(null)
                }}
                onConfirm={handleRemove}
                title="Remove client"
                message={`Are you sure you want to remove "${removeTarget?.full_name ?? ""}" from your clients? This will only remove the assignment. The client account will remain active.`}
                confirmLabel="Remove"
                cancelLabel="Cancel"
                variant="destructive"
                isConfirming={isRemoving}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}
