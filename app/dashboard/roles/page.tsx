"use client"

import { useCallback, useEffect, useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { RoleTable } from "@/components/dashboard/role-table"
import { RoleFormDialog } from "@/components/dashboard/role-form-dialog"
import { RoleDeleteDialog } from "@/components/dashboard/role-delete-dialog"

export interface RoleRow {
    id: string
    name: string
    description: string | null
    isSystem: boolean
    userCount: number
    permissionCount: number
    permissionIds: string[]
    createdAt: string
}

export default function RolesPage() {
    const [roles, setRoles] = useState<RoleRow[]>([])
    const [loading, setLoading] = useState(true)
    const [formOpen, setFormOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<RoleRow | undefined>()
    const [deletingRole, setDeletingRole] = useState<RoleRow | undefined>()

    const fetchRoles = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/roles")
            if (!res.ok) throw new Error("Failed to fetch")
            const json = await res.json()
            const rows: RoleRow[] = (json.data ?? []).map((r: Record<string, unknown>) => ({
                id: r.id as string,
                name: r.name as string,
                description: r.description as string | null,
                isSystem: r.isSystem as boolean,
                userCount: ((r as Record<string, unknown>)._count as Record<string, number>)?.users ?? 0,
                permissionCount: ((r.permissions as Array<unknown>) ?? []).length,
                permissionIds: ((r.permissions as Array<{ permission: { id: string } }>) ?? []).map((p) => p.permission.id),
                createdAt: r.createdAt as string,
            }))
            setRoles(rows)
        } catch {
            // silent
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchRoles()
    }, [fetchRoles])

    const handleAdd = async (data: Record<string, unknown>) => {
        const res = await fetch("/api/roles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error("Failed to create")
        await fetchRoles()
    }

    const handleEdit = async (data: Record<string, unknown>) => {
        if (!editingRole) return
        const res = await fetch(`/api/roles/${editingRole.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error("Failed to update")
        await fetchRoles()
    }

    const handleDelete = async () => {
        if (!deletingRole) return
        const res = await fetch(`/api/roles/${deletingRole.id}`, {
            method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to delete")
        setDeletingRole(undefined)
        await fetchRoles()
    }

    const openAdd = () => {
        setEditingRole(undefined)
        setFormOpen(true)
    }

    const openEdit = (role: RoleRow) => {
        if (role.isSystem) return
        setEditingRole(role)
        setFormOpen(true)
    }

    const openDelete = (role: RoleRow) => {
        if (role.isSystem) return
        setDeletingRole(role)
        setDeleteOpen(true)
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <h2 className="text-2xl font-semibold tracking-tight gradient-text">Roles</h2>
                    <p className="text-sm text-secondary">
                        Manage roles and their permissions for dashboard access control.
                    </p>
                </div>
                <Button onClick={openAdd}>
                    <IconPlus className="size-4 mr-2" />
                    Add Role
                </Button>
            </div>
            <RoleTable roles={roles} loading={loading} onEdit={openEdit} onDelete={openDelete} />
            <RoleFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                role={editingRole}
                onSubmit={(editingRole ? handleEdit : handleAdd) as (data: Record<string, unknown>) => Promise<void>}
            />
            <RoleDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                roleName={deletingRole?.name ?? ""}
                onConfirm={handleDelete}
            />
        </div>
    )
}
