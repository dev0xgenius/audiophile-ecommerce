import sharp from "sharp";

export interface DerivativeUrls {
    webp: string;
    original: string;
}

export interface DerivativeResult {
    width: number;
    height: number;
    variants: Record<string, DerivativeUrls> | null;
    type: "image" | "raw";
}

type UploadFn = (buffer: Buffer, key: string, mime: string) => Promise<string>;

const SIZES = [
    { suffix: "thumbnail", maxWidth: 150 },
    { suffix: "medium", maxWidth: 600 },
    { suffix: "desktop", maxWidth: 1200 },
    { suffix: "original", maxWidth: Infinity },
] as const;

function getExtension(mimeType: string): string {
    switch (mimeType) {
        case "image/jpeg": return "jpg";
        case "image/png": return "png";
        case "image/webp": return "webp";
        case "image/avif": return "avif";
        case "image/gif": return "gif";
        default: return "bin";
    }
}

export async function processImage(
    buffer: Buffer,
    mimeType: string,
    uploadFn: UploadFn,
    baseKey: string,
): Promise<DerivativeResult> {
    if (!mimeType.startsWith("image/")) {
        await uploadFn(buffer, `${baseKey}__original.${getExtension(mimeType)}`, mimeType);
        return { width: 0, height: 0, variants: null, type: "raw" };
    }

    const metadata = await sharp(buffer).metadata();
    const originalWidth = metadata.width ?? 0;
    const originalHeight = metadata.height ?? 0;

    const results = await Promise.all(
        SIZES.map(async ({ suffix, maxWidth }) => {
            const targetWidth = maxWidth === Infinity ? originalWidth : Math.min(maxWidth, originalWidth);
            const needsResize = targetWidth < originalWidth;

            const ext = getExtension(mimeType);
            const base = `${baseKey}__${suffix}`;

            const [webpResult, origResult] = await Promise.all([
                (async () => {
                    const resized = needsResize
                        ? await sharp(buffer).resize(targetWidth).webp({ quality: 80 }).toBuffer()
                        : await sharp(buffer).webp({ quality: 80 }).toBuffer();
                    return uploadFn(resized, `${base}.webp`, "image/webp");
                })(),
                (async () => {
                    const resized = needsResize
                        ? await sharp(buffer).resize(targetWidth).toBuffer()
                        : buffer;
                    return uploadFn(resized, `${base}.${ext}`, mimeType);
                })(),
            ]);

            return { suffix, urls: { webp: webpResult, original: origResult } };
        })
    );

    const variants: Record<string, DerivativeUrls> = {};
    for (const r of results) {
        variants[r.suffix] = r.urls;
    }

    return {
        width: originalWidth,
        height: originalHeight,
        variants,
        type: "image",
    };
}
