import dotenv from "dotenv";
import fsp from "fs/promises";
import path from "path";
import { processImage } from "@/lib/storage/image-processor";
import { uploadFile } from "@/lib/storage/s3";

dotenv.config({ path: ".env.local", override: true });

interface InventoryEntry {
  localPath: string;
  type: string;
  productSlug: string | null;
  variantSlug: string | null;
  size: string;
  galleryIndex: number | null;
  suggestedR2Key: string;
  folder: string;
  filename: string;
}

interface ManifestEntry {
  baseKey: string;
  originalExt: string;
  width: number;
  height: number;
  type: string;
  productSlug: string | null;
  variantSlug: string | null;
  size: string;
  galleryIndex: number | null;
  folder: string;
  filename: string;
  variants: Record<string, { webpKey: string; originalKey: string }>;
}

function getMime(ext: string): string {
  switch (ext) {
    case "jpg": case "jpeg": return "image/jpeg";
    case "png": return "image/png";
    case "webp": return "image/webp";
    case "avif": return "image/avif";
    case "gif": return "image/gif";
    case "svg": return "image/svg+xml";
    default: return "application/octet-stream";
  }
}

async function main() {
  const raw = await fsp.readFile("scripts/asset-inventory.json", "utf-8");
  const inventory: { files: InventoryEntry[] } = JSON.parse(raw);

  const manifest: Record<string, ManifestEntry> = {};
  let uploaded = 0;
  const skipped = 0;
  let failed = 0;

  for (const entry of inventory.files) {
    const ext = path.extname(entry.localPath).slice(1).toLowerCase();

    if (!["jpg", "jpeg", "png", "webp", "avif"].includes(ext)) {
      // Non-image (svg, gif) — upload directly without processing
      try {
        const buffer = await fsp.readFile(entry.localPath);
        const key = `${entry.suggestedR2Key}.${ext}`;
        await uploadFile(buffer, key, getMime(ext));
        manifest[entry.localPath] = {
          baseKey: entry.suggestedR2Key,
          originalExt: ext,
          width: 0,
          height: 0,
          type: entry.type,
          productSlug: entry.productSlug,
          variantSlug: entry.variantSlug,
          size: entry.size,
          galleryIndex: entry.galleryIndex,
          folder: entry.folder,
          filename: entry.filename,
          variants: {},
        };
        uploaded++;
      } catch (e) {
        console.error(`Failed to upload ${entry.localPath}:`, e);
        failed++;
      }
      continue;
    }

    try {
      const buffer = await fsp.readFile(entry.localPath);
      const mime = getMime(ext);

      const urlToKeyMap = new Map<string, string>();

      const uploadFn = async (buf: Buffer, key: string, m: string) => {
        const result = await uploadFile(buf, key, m);
        urlToKeyMap.set(result.url, result.key);
        return result.url;
      };

      const result = await processImage(buffer, mime, uploadFn, entry.suggestedR2Key);

      const variants: Record<string, { webpKey: string; originalKey: string }> = {};
      if (result.variants) {
        for (const [sizeName, urls] of Object.entries(result.variants)) {
          variants[sizeName] = {
            webpKey: urlToKeyMap.get(urls.webp) ?? `${entry.suggestedR2Key}__${sizeName}.webp`,
            originalKey: urlToKeyMap.get(urls.original) ?? `${entry.suggestedR2Key}__${sizeName}.${ext}`,
          };
        }
      }

      manifest[entry.localPath] = {
        baseKey: entry.suggestedR2Key,
        originalExt: ext,
        width: result.width,
        height: result.height,
        type: entry.type,
        productSlug: entry.productSlug,
        variantSlug: entry.variantSlug,
        size: entry.size,
        galleryIndex: entry.galleryIndex,
        folder: entry.folder,
        filename: entry.filename,
        variants,
      };

      uploaded++;
    } catch (e) {
      console.error(`Failed to process ${entry.localPath}:`, e);
      failed++;
    }

    if ((uploaded + skipped + failed) % 20 === 0) {
      console.log(`Progress: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
    }
  }

  const output = JSON.stringify(manifest, null, 2);
  await fsp.writeFile("lib/asset-manifest.json", output);

  console.log("\nUpload Complete");
  console.log("---------------");
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total assets in manifest: ${Object.keys(manifest).length}`);
  console.log("Output: lib/asset-manifest.json");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
