"use client"

import { useEffect, useState, useCallback } from "react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SupplierFormDialog } from "@/components/dashboard/supplier-form-dialog"

interface SupplierRecord {
    id: string
    name: string
    contactName: string | null
    email: string | null
    phone: string | null
    leadTimeDays: number | null
    notes: string | null
    _count: { products: number }
}

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<SupplierRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editSupplier, setEditSupplier] = useState<SupplierRecord | null>(null)
    const [search, setSearch] = useState("")

    const fetchSuppliers = useCallback(async (q?: string) => {
        setLoading(true)
        try {
            const params = q ? `?search=${encodeURIComponent(q)}` : ""
            const res = await fetch(`/api/suppliers${params}`)
            const j = await res.json()
            setSuppliers(j.data ?? [])
        } catch {
            // handled by error boundary
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchSuppliers(search) }, [fetchSuppliers, search])

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-h2">Suppliers</h1>
                <Button onClick={() => { setEditSupplier(null); setDialogOpen(true) }}>
                    <IconPlus className="size-4 mr-2" />
                    Add Supplier
                </Button>
            </div>

            <div className="flex gap-2">
                <input
                    className="flex h-10 w-full max-w-sm rounded-lg border bg-transparent px-3 py-2 text-sm"
                    placeholder="Search suppliers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
                    ))}
                </div>
            ) : suppliers.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
                    <p className="text-body">No suppliers yet.</p>
                    <p className="text-sm">Add your first supplier to link them to products.</p>
                </div>
            ) : (
                <div className="glass-table rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Lead Time</TableHead>
                                <TableHead>Products</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.map((s) => (
                                <TableRow
                                    key={s.id}
                                    className="cursor-pointer"
                                    onClick={() => { setEditSupplier(s); setDialogOpen(true) }}
                                >
                                    <TableCell className="font-medium">{s.name}</TableCell>
                                    <TableCell>{s.contactName ?? "—"}</TableCell>
                                    <TableCell>{s.email ?? "—"}</TableCell>
                                    <TableCell>{s.phone ?? "—"}</TableCell>
                                    <TableCell>{s.leadTimeDays != null ? `${s.leadTimeDays}d` : "—"}</TableCell>
                                    <TableCell>{s._count.products}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <SupplierFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSaved={() => fetchSuppliers(search)}
                editSupplier={editSupplier}
            />
        </div>
    )
}
