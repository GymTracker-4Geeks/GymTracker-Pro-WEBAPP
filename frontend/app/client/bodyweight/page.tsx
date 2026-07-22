"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Plus, Search, Scale } from "lucide-react"
import { SearchInput } from "@/components/ui/SearchInput"
import { Select } from "@/components/ui/Select"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Toast } from "@/components/ui/Toast"
import { PageHeader } from "@/components/ui/PageHeader"
import { BodyWeightCard } from "@/components/bodyweight/BodyWeightCard"
import { BodyWeightFormModal } from "@/components/bodyweight/BodyWeightFormModal"
import { getWeights, deleteWeight } from "@/services/bodyweightService"
import type { BodyWeightRecord } from "@/lib/types"

export default function BodyWeightPage() {
    const [weights, setWeights] = useState<BodyWeightRecord[]>([])
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("Newest")
    const [isLoading, setIsLoading] = useState(true)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
    const [modalState, setModalState] = useState<{
        mode: "create" | "edit"
        record?: BodyWeightRecord
    } | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<BodyWeightRecord | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [fetchError, setFetchError] = useState<string | null>(null)

    const fetchWeights = useCallback((signal?: AbortSignal) => {
        setIsLoading(true)
        setFetchError(null)
        getWeights(signal)
            .then((data) => {
                setWeights(data)
                setIsLoading(false)
            })
            .catch((err) => {
                if (err instanceof DOMException && err.name === "AbortError") return
                setFetchError(err instanceof Error ? err.message : "Failed to load records")
                setIsLoading(false)
            })
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchWeights(controller.signal)
        return () => controller.abort()
    }, [fetchWeights])

    const sortedWeights = useMemo(() => {
        const sorted = [...weights]
        switch (sortBy) {
            case "Oldest":
                return sorted.sort(
                    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
                )
            case "Heaviest":
                return sorted.sort((a, b) => b.weight - a.weight)
            case "Lightest":
                return sorted.sort((a, b) => a.weight - b.weight)
            case "Newest":
            default:
                return sorted.sort(
                    (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
                )
        }
    }, [weights, sortBy])

    const filteredWeights = useMemo(() => {
        if (!search.trim()) return sortedWeights
        const term = search.toLowerCase()
        return sortedWeights.filter(
            (w) =>
                String(w.weight).includes(term) ||
                new Date(w.recorded_at).toLocaleDateString("en-US").includes(term)
        )
    }, [sortedWeights, search])

    const handleSaved = useCallback((record: BodyWeightRecord) => {
        setWeights((prev) => {
            const exists = prev.find((w) => w.id === record.id)
            if (exists) {
                return prev.map((w) => (w.id === record.id ? record : w))
            }
            return [record, ...prev]
        })
        setModalState(null)
    }, [])

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return
        setIsDeleting(true)
        try {
            await deleteWeight(deleteTarget.id)
            setWeights((prev) => prev.filter((w) => w.id !== deleteTarget.id))
            setToast({ message: "Weight record deleted", type: "success" })
            setDeleteTarget(null)
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : "Failed to delete",
                type: "error",
            })
        } finally {
            setIsDeleting(false)
        }
    }, [deleteTarget])

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                title="Body Weight"
                subtitle="Track your weight over time"
                actions={
                    <button
                        type="button"
                        onClick={() => setModalState({ mode: "create" })}
                        className="inline-flex items-center gap-2 rounded-lg gradient-red glow-red px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" /> Log Weight
                    </button>
                }
            />

            <div className="mb-5 flex items-center gap-4">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by date or weight..."
                    debounceMs={300}
                    className="flex-1"
                />
                <div className="w-40 flex-shrink-0">
                    <Select
                        label="Sort by"
                        value={sortBy}
                        options={["Newest", "Oldest", "Heaviest", "Lightest"]}
                        onChange={setSortBy}
                        placeholder="Select order"
                    />
                </div>
            </div>

            {fetchError ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Search className="mb-4 h-12 w-12 text-destructive/30" aria-hidden="true" />
                    <p className="text-sm font-medium text-destructive">{fetchError}</p>
                    <button
                        onClick={() => fetchWeights()}
                        className="mt-3 text-sm font-medium text-primary hover:underline"
                    >
                        Try again
                    </button>
                </div>
            ) : filteredWeights.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Scale className="mb-4 h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
                    <p className="text-sm font-medium text-muted-foreground">No weight records yet</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">Start logging your body weight</p>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredWeights.map((w) => (
                        <BodyWeightCard
                            key={w.id}
                            weight={w}
                            onEdit={() => setModalState({ mode: "edit", record: w })}
                            onDelete={() => setDeleteTarget(w)}
                        />
                    ))}
                </div>
            )}

            <BodyWeightFormModal
                isOpen={modalState !== null}
                onClose={() => setModalState(null)}
                mode={modalState?.mode ?? "create"}
                record={modalState?.record}
                onSaved={handleSaved}
            />

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                onClose={() => { if (!isDeleting) setDeleteTarget(null) }}
                onConfirm={handleDelete}
                title="Delete Weight Record"
                message={`Are you sure you want to delete this weight record (${deleteTarget?.weight} kg)? This action is irreversible.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="destructive"
                isConfirming={isDeleting}
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
