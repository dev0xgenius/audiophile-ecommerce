"use client"

import { useEffect, useState, useCallback } from "react"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BundleFormDialog } from "@/components/dashboard/bundle-form-dialog"

interface BundleRecord {
    id: string
    productId: string
    componentVariantId: string
    quantity: number
    decrementComponentStock: boolean
    product: { id: string; name: string }
    component: { id: string; name: string; sku: string }
}

export default function BundlesPage() {
    const [bundles, setBundles] = useState<BundleRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editBundle, setEditBundle] = useState<BundleRecord | null>(null)

    const fetchBundles = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/bundles")
            const j = await res.json()
            setBundles(j.data ?? [])
        } catch {
            // handled by error boundary
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchBundles() }, [fetchBundles])

    async function handleDelete(id: string) {
        if (!confirm("Delete this bundle?")) return
        try {
            const res = await fetch(`/api/bundles/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error()
            setBundles((prev) => prev.filter((b) => b.id !== id))
        } catch {
            // handled by error boundary
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-h2">Bundles / Kits</h1>
                <Button onClick={() => { setEditBundle(null); setDialogOpen(true) }}>
                    <IconPlus className="size-4 mr-2" />
                    Add Bundle
                </Button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
                    ))}
                </div>
            ) : bundles.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
                    <p className="text-body">No bundles yet.</p>
                    <p className="text-sm">Link product variants together to create kits.</p>
                </div>
            ) : (
                <div className="glass-table rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Component Variant</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Decrement Stock</TableHead>
                                <TableHead className="w-20" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bundles.map((b) => (
                                <TableRow
                                    key={b.id}
                                    className="cursor-pointer"
                                    onClick={() => { setEditBundle(b); setDialogOpen(true) }}
                                >
                                    <TableCell className="font-medium">{b.product.name}</TableCell>
                                    <TableCell>{b.component.name} ({b.component.sku})</TableCell>
                                    <TableCell>{b.quantity}</TableCell>
                                    <TableCell>
                                        <Badge variant={b.decrementComponentStock ? "default" : "outline"}>
                                            {b.decrementComponentStock ? "Yes" : "No"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(b.id) }}
                                        >
                                            <IconTrash className="size-4 text-error" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <BundleFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSaved={fetchBundles}
                editBundle={editBundle}
            />
        </div>
    )
}
