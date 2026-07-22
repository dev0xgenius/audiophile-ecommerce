"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Address {
    id: string
    type: string
    line1: string
    line2: string | null
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
}

interface OrderItem {
    id: string
    quantity: number
    unitPrice: number
    lineTotal: number
    variant: { id: string; name: string; sku: string } | null
}

interface Order {
    id: string
    status: string
    total: number
    createdAt: string
    items: OrderItem[]
}

interface CustomerNote {
    id: string
    note: string
    author: { id: string; name: string } | null
    createdAt: string
}

interface CustomerProfile {
    id: string
    name: string
    email: string | null
    phone: string | null
    flags: string[]
    notes: string | null
    lifetimeValue: number
    createdAt: string
    addresses: Address[]
    orders: Order[]
    customerNotes: CustomerNote[]
}

interface CustomerProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    customerId: string | null
}

export function CustomerProfileDialog({
    open,
    onOpenChange,
    customerId,
}: CustomerProfileDialogProps) {
    const [profile, setProfile] = useState<CustomerProfile | null>(null)
    const [activeTab, setActiveTab] = useState<"overview" | "orders" | "notes">("overview")
    const [newNote, setNewNote] = useState("")

    useEffect(() => {
        if (!open || !customerId) return
        setActiveTab("overview")
        setNewNote("")
        let active = true
        fetch(`/api/customers/${customerId}`)
            .then((r) => r.json())
            .then((j) => { if (active) setProfile(j.data ?? null) })
            .catch(() => { if (active) setProfile(null) })
        return () => { active = false }
    }, [open, customerId])

    const handleFlagToggle = async (flag: "VIP" | "fraud-risk") => {
        if (!profile) return
        const newFlags = profile.flags.includes(flag)
            ? profile.flags.filter((f) => f !== flag)
            : [...profile.flags, flag]

        try {
            const res = await fetch(`/api/customers/${profile.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ flags: newFlags }),
            })
            if (!res.ok) throw new Error("Failed to update flags")
            setProfile((p) => p ? { ...p, flags: newFlags } : null)
            toast.success("Flags updated")
        } catch {
            toast.error("Failed to update flags")
        }
    }

    const handleExport = async () => {
        if (!profile) return
        try {
            const res = await fetch(`/api/customers/${profile.id}/export`)
            if (!res.ok) throw new Error("Export failed")
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `customer-${profile.id}.json`
            a.click()
            URL.revokeObjectURL(url)
        } catch {
            toast.error("Export failed")
        }
    }

    const handleAnonymize = async () => {
        if (!profile || !confirm("This action cannot be undone. Anonymize this customer?")) return
        try {
            const res = await fetch(`/api/customers/${profile.id}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Failed to anonymize")
            toast.success("Customer data anonymized")
            onOpenChange(false)
        } catch {
            toast.error("Failed to anonymize")
        }
    }

    const handleAddNote = async () => {
        if (!profile || !newNote.trim()) return
        try {
            const res = await fetch(`/api/customers/${profile.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: newNote }),
            })
            if (!res.ok) throw new Error("Failed to add note")
            toast.success("Note added")
            setNewNote("")
        } catch {
            toast.error("Failed to add note")
        }
    }

    if (!profile) return null

    const tabs = [
        { id: "overview" as const, label: "Overview" },
        { id: "orders" as const, label: "Orders" },
        { id: "notes" as const, label: "Notes" },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{profile.name || "Anonymous Customer"}</DialogTitle>
                    <DialogDescription>
                        Customer since {new Date(profile.createdAt).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-1 rounded-lg bg-muted p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                activeTab === tab.id ? "bg-background shadow-xs" : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "overview" && (
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4 text-sm">
                            <div>
                                <p className="font-medium text-muted-foreground">Email</p>
                                <p>{profile.email ?? "—"}</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Phone</p>
                                <p>{profile.phone ?? "—"}</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Lifetime Value</p>
                                <p className="text-lg font-bold gradient-text">${profile.lifetimeValue.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Orders</p>
                                <p>{profile.orders.length}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-2">Flags</p>
                            <div className="flex gap-2">
                                <Button
                                    variant={profile.flags.includes("VIP") ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleFlagToggle("VIP")}
                                >
                                    VIP
                                </Button>
                                <Button
                                    variant={profile.flags.includes("fraud-risk") ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={() => handleFlagToggle("fraud-risk")}
                                >
                                    Fraud Risk
                                </Button>
                            </div>
                        </div>

                        {profile.addresses.length > 0 && (
                            <div>
                                <p className="text-sm font-medium mb-2">Addresses</p>
                                <div className="space-y-2">
                                    {profile.addresses.map((addr) => (
                                        <div key={addr.id} className="rounded-lg border px-3 py-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs capitalize">{addr.type}</Badge>
                                                {addr.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                                            </div>
                                            <p className="mt-1 text-muted-foreground">
                                                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleExport}>
                                Export Data
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleAnonymize}>
                                Anonymize
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="space-y-2">
                        {profile.orders.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No orders yet.</p>
                        ) : (
                            profile.orders.map((order) => (
                                <div key={order.id} className="rounded-lg border px-3 py-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">#{order.id.slice(-6)}</span>
                                        <Badge variant="outline" className="capitalize text-xs">
                                            {order.status.replace(/_/g, " ")}
                                        </Badge>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between text-muted-foreground">
                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span className="tabular-nums font-medium">${order.total.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {order.items.length} item(s)
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "notes" && (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <textarea
                                rows={2}
                                className="flex-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                placeholder="Add an internal note..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                            />
                            <Button size="sm" onClick={handleAddNote}>Add</Button>
                        </div>
                        {profile.customerNotes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No notes yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {profile.customerNotes.map((note) => (
                                    <div key={note.id} className="rounded-lg bg-muted px-3 py-2 text-sm">
                                        <p>{note.note}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {note.author?.name ?? "System"} — {new Date(note.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
