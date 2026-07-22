import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/auth/permissions";
import { uploadFile } from "@/lib/storage/s3";
import { processImage } from "@/lib/storage/image-processor";
import crypto from "node:crypto";

export const POST = withPermission(async (request: NextRequest, context) => {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json(
            { error: "No file provided", code: "MISSING_FILE" },
            { status: 400 },
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueId = crypto.randomUUID();
    const baseKey = `uploads/${uniqueId}-${sanitizedName}`;

    try {
        const uploadFn = async (buf: Buffer, key: string, mime: string) => {
            const result = await uploadFile(buf, key, mime);
            return result.url;
        };

        const result = await processImage(buffer, file.type, uploadFn, baseKey);

        const media = await prisma.mediaAsset.create({
            data: {
                url: result.variants?.original?.original ?? "",
                filename: file.name,
                mimeType: file.type,
                sizeBytes: buffer.length,
                variants: JSON.parse(JSON.stringify(result.variants)),
                width: result.width,
                height: result.height,
                uploadedById: context.userId,
            },
        });

        return NextResponse.json({ data: media }, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        return NextResponse.json(
            { error: message, code: "UPLOAD_FAILED" },
            { status: 500 },
        );
    }
}, "gallery", "create");
