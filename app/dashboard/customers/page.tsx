"use client"

import { useCallback, useEffect, useState } from "react"
import { CustomerTable } from "@/components/dashboard/customer-table"
import { CustomerProfileDialog } from "@/components/dashboard/customer-profile-dialog"

interface CustomerRow {
    id: string
    name: string
    email: string | null
    phone: string | null
    flags: string[]
    orderCount: number
    totalSpent: number
    createdAt: string
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<CustomerRow[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
    const [profileOpen, setProfileOpen] = useState(false)

    const fetchCustomers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/customers?page=${page}&pageSize=20`)
            if (!res.ok) throw new Error("Failed to fetch")
            const json = await res.json()
            setCustomers(json.data ?? [])
            setTotalPages(json.meta.totalPages)
        } catch {
            // silent
        } finally {
            setLoading(false)
        }
    }, [page])

    useEffect(() => {
        fetchCustomers()
    }, [fetchCustomers])

    const handleSelect = (customer: CustomerRow) => {
        setSelectedCustomerId(customer.id)
        setProfileOpen(true)
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="space-y-1.5">
                <h2 className="text-2xl font-semibold tracking-tight gradient-text">Customers</h2>
                <p className="text-sm text-secondary">
                    View and manage customer profiles, orders, and notes.
                </p>
            </div>

            <CustomerTable
                customers={customers}
                loading={loading}
                onSelect={handleSelect}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            <CustomerProfileDialog
                open={profileOpen}
                onOpenChange={setProfileOpen}
                customerId={selectedCustomerId}
            />
        </div>
    )
}
