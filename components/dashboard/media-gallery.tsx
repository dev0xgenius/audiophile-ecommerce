"use client"

import { useCallback, useRef, useState } from "react"
import { IconPhoto, IconUpload, IconX, IconEdit, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface MediaAsset {
    id: string
    url: string
    filename: string
    mimeType: string
    sizeBytes: number
    variants: Record<string, { webp: string; original: string }> | null
    altText: string | null
    tags: string[]
    folder: string | null
    width: number | null
    height: number | null
    uploadedBy: { id: string; name: string } | null
    createdAt: string
}

interface MediaGalleryProps {
    assets: MediaAsset[]
    loading: boolean
    onRefresh: () => void
    selectable?: boolean
    onSelect?: (asset: MediaAsset) => void
    onMultiSelect?: (assets: MediaAsset[]) => void
}

export function MediaGallery({
    assets,
    loading,
    onRefresh,
    selectable,
    onSelect,
    onMultiSelect,
}: MediaGalleryProps) {
    const [uploading, setUploading] = useState(false)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null)
    const [editAltText, setEditAltText] = useState("")
    const [editTags, setEditTags] = useState("")
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = useCallback(async (files: FileList | null) => {
        if (!files?.length) return
        setUploading(true)
        try {
            for (const file of Array.from(files)) {
                const formData = new FormData()
                formData.append("file", file)
                const res = await fetch("/api/media/upload", {
                    method: "POST",
                    body: formData,
                })
                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error ?? "Upload failed")
                }
            }
            toast.success(`${files.length} file(s) uploaded`)
            onRefresh()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed")
        } finally {
            setUploading(false)
        }
    }, [onRefresh])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        handleUpload(e.dataTransfer.files)
    }, [handleUpload])

    const toggleSelect = (id: string) => {
        const next = new Set(selectedIds)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedIds(next)
        if (selectable && onMultiSelect) {
            const selected = assets.filter((a) => next.has(a.id))
            onMultiSelect(selected)
        }
    }

    const handleEdit = async () => {
        if (!editingAsset) return
        try {
            const res = await fetch(`/api/media/${editingAsset.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    altText: editAltText || undefined,
                    tags: editTags ? editTags.split(",").map((t) => t.trim()) : undefined,
                }),
            })
            if (!res.ok) throw new Error("Failed to update")
            toast.success("Media updated")
            setEditingAsset(null)
            onRefresh()
        } catch {
            toast.error("Failed to update media")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this asset? This cannot be undone.")) return
        try {
            const res = await fetch(`/api/media/${id}`, { method: "DELETE" })
            if (!res.ok) {
                const err = await res.json()
                if (err.code === "IN_USE") {
                    toast.error(`Cannot delete: linked to ${err.references?.[0]?.productName ?? "a product"}`)
                    return
                }
                throw new Error(err.error ?? "Delete failed")
            }
            toast.success("Media deleted")
            onRefresh()
        } catch {
            toast.error("Failed to delete media")
        }
    }

    const getDisplayUrl = (asset: MediaAsset): string => {
        if (asset.variants?.thumbnail?.webp) return asset.variants.thumbnail.webp
        if (asset.variants?.thumbnail?.original) return asset.variants.thumbnail.original
        return asset.url
    }

    return (
        <div className="space-y-4">
            <div
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                    dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <IconUpload className="size-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or click to browse
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files)}
                />
                <Button
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploading ? "Uploading..." : "Browse Files"}
                </Button>
            </div>

            {selectedIds.size > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                    <span className="text-sm text-muted-foreground">
                        {selectedIds.size} selected
                    </span>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
                    ))}
                </div>
            ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl glass p-12 text-center">
                    <IconPhoto className="size-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No media yet. Upload your first image.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border transition-all hover:ring-2 hover:ring-primary ${
                                selectedIds.has(asset.id) ? "ring-2 ring-primary" : "border-border"
                            }`}
                            onClick={() => selectable ? toggleSelect(asset.id) : onSelect?.(asset)}
                        >
                            <img
                                src={getDisplayUrl(asset)}
                                alt={asset.altText ?? asset.filename}
                                className="size-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-end gap-1 bg-black/0 p-2 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                                <button
                                    className="rounded-md bg-background/80 p-1.5 hover:bg-background"
                                    onClick={(e) => { e.stopPropagation(); setEditingAsset(asset); setEditAltText(asset.altText ?? ""); setEditTags(asset.tags.join(", ")) }}
                                >
                                    <IconEdit className="size-3" />
                                </button>
                                <button
                                    className="rounded-md bg-background/80 p-1.5 hover:bg-background"
                                    onClick={(e) => { e.stopPropagation(); handleDelete(asset.id) }}
                                >
                                    <IconTrash className="size-3 text-error" />
                                </button>
                            </div>
                            {selectedIds.has(asset.id) && (
                                <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                                    <IconX className="size-3" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={!!editingAsset} onOpenChange={(o) => !o && setEditingAsset(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Media</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Alt Text</Label>
                            <Input value={editAltText} onChange={(e) => setEditAltText(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Tags (comma separated)</Label>
                            <Input value={editTags} onChange={(e) => setEditTags(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingAsset(null)}>Cancel</Button>
                        <Button onClick={handleEdit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
