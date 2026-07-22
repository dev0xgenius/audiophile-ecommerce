"use client"

import { useCallback, useEffect, useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { UserTable } from "@/components/dashboard/user-table"
import { UserFormDialog } from "@/components/dashboard/user-form-dialog"
import { UserDeleteDialog } from "@/components/dashboard/user-delete-dialog"

export interface UserRow {
    id: string
    name: string | null
    email: string | null
    isActive: boolean
    roles: string[]
    roleIds: string[]
    createdAt: string
}

interface UsersResponse {
    data: UserRow[]
    meta: { page: number; pageSize: number; total: number; totalPages: number }
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserRow[]>([])
    const [loading, setLoading] = useState(true)
    const [formOpen, setFormOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<UserRow | undefined>()
    const [deletingUser, setDeletingUser] = useState<UserRow | undefined>()

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/users")
            if (!res.ok) throw new Error("Failed to fetch")
            const json = await res.json()
            const rows: UserRow[] = (json.data ?? []).map((u: Record<string, unknown>) => ({
                id: u.id as string,
                name: u.name as string | null,
                email: u.email as string | null,
                isActive: u.isActive as boolean,
                roles: ((u.roles as Array<{ role: { name: string } }>) ?? []).map((r) => r.role.name),
                roleIds: ((u.roles as Array<{ role: { id: string } }>) ?? []).map((r) => r.role.id),
                createdAt: u.createdAt as string,
            }))
            setUsers(rows)
        } catch {
            // silent
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleAdd = async (data: Record<string, unknown>) => {
        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error("Failed to create")
        await fetchUsers()
    }

    const handleEdit = async (data: Record<string, unknown>) => {
        if (!editingUser) return
        const res = await fetch(`/api/users/${editingUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error("Failed to update")
        await fetchUsers()
    }

    const handleDelete = async () => {
        if (!deletingUser) return
        const res = await fetch(`/api/users/${deletingUser.id}`, {
            method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to deactivate")
        setDeletingUser(undefined)
        await fetchUsers()
    }

    const openAdd = () => {
        setEditingUser(undefined)
        setFormOpen(true)
    }

    const openEdit = (user: UserRow) => {
        setEditingUser(user)
        setFormOpen(true)
    }

    const openDelete = (user: UserRow) => {
        setDeletingUser(user)
        setDeleteOpen(true)
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <h2 className="text-2xl font-semibold tracking-tight gradient-text">Users</h2>
                    <p className="text-sm text-secondary">
                        Manage dashboard users and their roles.
                    </p>
                </div>
                <Button onClick={openAdd}>
                    <IconPlus className="size-4 mr-2" />
                    Add User
                </Button>
            </div>
            <UserTable users={users} loading={loading} onEdit={openEdit} onDelete={openDelete} />
            <UserFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                user={editingUser}
                onSubmit={(editingUser ? handleEdit : handleAdd) as (data: Record<string, unknown>) => Promise<void>}
            />
            <UserDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                userName={deletingUser?.name ?? deletingUser?.email ?? ""}
                onConfirm={handleDelete}
            />
        </div>
    )
}
