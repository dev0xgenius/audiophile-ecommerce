"use client"

import { useCallback, useEffect, useState } from "react"
import { MediaGallery } from "@/components/dashboard/media-gallery"

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

export default function GalleryPage() {
    const [assets, setAssets] = useState<MediaAsset[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAssets = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/media?pageSize=50")
            if (!res.ok) throw new Error("Failed to fetch")
            const json = await res.json()
            setAssets(json.data ?? [])
        } catch {
            // silent
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAssets()
    }, [fetchAssets])

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="space-y-1.5">
                <h2 className="text-2xl font-semibold tracking-tight gradient-text">Gallery</h2>
                <p className="text-sm text-secondary">
                    Manage your product images and media assets.
                </p>
            </div>

            <MediaGallery
                assets={assets}
                loading={loading}
                onRefresh={fetchAssets}
            />
        </div>
    )
}
