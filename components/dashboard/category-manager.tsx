"use client"

import React, { useEffect, useState } from "react"
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    sortOrder: number
    parentId: string | null
    children?: Category[]
}

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/categories")
                const json = await res.json()
                setCategories(json.data ?? [])
            } catch {
                // silent
            }
        }
        load()
    }, [])

    const handleCreate = async () => {
        await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, slug, description: description || undefined }),
        })
        setDialogOpen(false)
        setName("")
        setSlug("")
        setDescription("")
        try {
            const res = await fetch("/api/categories")
            const json = await res.json()
            setCategories(json.data ?? [])
        } catch {
            // silent
        }
    }

    const renderRow = (cat: Category, depth = 0) => (
        <TableRow key={cat.id}>
            <TableCell className="font-medium" style={{ paddingLeft: `${12 + depth * 20}px` }}>
                {cat.name}
            </TableCell>
            <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
            <TableCell className="text-muted-foreground max-w-xs truncate">
                {cat.description ?? "—"}
            </TableCell>
            <TableCell>
                <Badge variant="outline">{cat.sortOrder}</Badge>
            </TableCell>
        </TableRow>
    )

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Categories</h3>
                    <p className="text-sm text-muted-foreground">
                        Organize your product catalog with categories.
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    <IconPlus className="size-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <div className="overflow-hidden rounded-xl glass-table">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Sort</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No categories yet.
                                </TableCell>
                            </TableRow>
                        )}
                        {categories.map((cat) => (
                            <React.Fragment key={cat.id}>
                                {renderRow(cat)}
                                {cat.children?.map((child) => renderRow(child, 1))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                        <DialogDescription>
                            Create a new product category.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cat-name">Name</Label>
                            <Input
                                id="cat-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cat-slug">Slug</Label>
                            <Input
                                id="cat-slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cat-desc">Description</Label>
                            <textarea
                                id="cat-desc"
                                rows={2}
                                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate} disabled={!name || !slug}>
                                Create
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

