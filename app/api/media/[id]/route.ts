import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateMediaSchema } from "@/lib/validations/media";
import { withPermission } from "@/lib/auth/permissions";
import { deleteFile, getKeyFromUrl } from "@/lib/storage/s3";

function getId(request: NextRequest): string {
    return request.nextUrl.pathname.split("/media/")[1]?.split("/")[0] ?? "";
}

export const PUT = withPermission(async (request: NextRequest) => {
    const id = getId(request);
    const body = await request.json();
    const data = updateMediaSchema.parse(body);

    const media = await prisma.mediaAsset.update({
        where: { id },
        data: {
            ...(data.altText !== undefined && { altText: data.altText }),
            ...(data.tags !== undefined && { tags: data.tags }),
            ...(data.folder !== undefined && { folder: data.folder }),
        },
    });

    return NextResponse.json({ data: media });
}, "gallery", "edit");

export const DELETE = withPermission(async (request: NextRequest) => {
    const id = getId(request);

    const inUse = await prisma.productMedia.findFirst({
        where: { mediaAssetId: id },
        include: {
            product: { select: { id: true, name: true } },
        },
    });

    if (inUse) {
        return NextResponse.json(
            {
                error: "Asset is linked to products",
                code: "IN_USE",
                references: [{ productId: inUse.product.id, productName: inUse.product.name }],
            },
            { status: 409 },
        );
    }

    const media = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!media) {
        return NextResponse.json(
            { error: "Media not found", code: "NOT_FOUND" },
            { status: 404 },
        );
    }

    const keysToDelete: string[] = [];
    const mainKey = getKeyFromUrl(media.url);
    if (mainKey) keysToDelete.push(mainKey);

    if (media.variants && typeof media.variants === "object") {
        const variants = media.variants as Record<string, { webp?: string; original?: string }>;
        for (const variant of Object.values(variants)) {
            if (variant.webp) {
                const k = getKeyFromUrl(variant.webp);
                if (k) keysToDelete.push(k);
            }
            if (variant.original) {
                const k = getKeyFromUrl(variant.original);
                if (k) keysToDelete.push(k);
            }
        }
    }

    await Promise.allSettled(keysToDelete.map((key) => deleteFile(key)));

    await prisma.mediaAsset.delete({ where: { id } });

    return NextResponse.json({ data: { id, deleted: true } });
}, "gallery", "delete");
