"use client"

import { useCallback, useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MediaAsset {
    id: string
    url: string
    filename: string
    mimeType: string
    altText: string | null
    variants: Record<string, { webp: string; original: string }> | null
}

interface ImagePickerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (assetIds: string[]) => void
    multiSelect?: boolean
}

export function ImagePicker({ open, onOpenChange, onSelect, multiSelect }: ImagePickerProps) {
    const [assets, setAssets] = useState<MediaAsset[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [search, setSearch] = useState("")

    const fetchAssets = useCallback(async () => {
        try {
            const params = new URLSearchParams()
            params.set("pageSize", "100")
            if (search) params.set("search", search)
            const res = await fetch(`/api/media?${params.toString()}`)
            if (!res.ok) throw new Error("Failed to fetch")
            const json = await res.json()
            setAssets(json.data ?? [])
        } catch {
            setAssets([])
        }
    }, [search])

    useEffect(() => {
        if (open) fetchAssets()
    }, [open, fetchAssets])

    const toggleSelect = (id: string) => {
        const next = new Set(multiSelect ? selectedIds : new Set<string>())
        if (next.has(id)) next.delete(id)
        else next.add(id)
        if (!multiSelect) {
            onSelect([id])
            onOpenChange(false)
            return
        }
        setSelectedIds(next)
    }

    const handleConfirm = () => {
        onSelect(Array.from(selectedIds))
        onOpenChange(false)
    }

    const getUrl = (asset: MediaAsset): string => {
        if (asset.variants?.thumbnail?.webp) return asset.variants.thumbnail.webp
        if (asset.variants?.thumbnail?.original) return asset.variants.thumbnail.original
        return asset.url
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Select Images</DialogTitle>
                </DialogHeader>
                <Input
                    placeholder="Search images..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4"
                />
                {assets.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        No images found. Upload images in the Gallery first.
                    </p>
                ) : (
                    <div className="grid max-h-80 grid-cols-4 gap-3 overflow-y-auto">
                        {assets.map((asset) => (
                            <div
                                key={asset.id}
                                className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border transition-all hover:ring-2 hover:ring-primary ${
                                    selectedIds.has(asset.id) ? "ring-2 ring-primary" : "border-border"
                                }`}
                                onClick={() => toggleSelect(asset.id)}
                            >
                                <img
                                    src={getUrl(asset)}
                                    alt={asset.altText ?? asset.filename}
                                    className="size-full object-cover"
                                    loading="lazy"
                                />
                                {selectedIds.has(asset.id) && (
                                    <div className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                                        ✓
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {multiSelect && (
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleConfirm} disabled={selectedIds.size === 0}>
                            Select ({selectedIds.size})
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
