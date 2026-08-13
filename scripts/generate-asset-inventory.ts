import fs from "fs";
import fsp from "fs/promises";
import path from "path";

// Product folder name → slug mapping
const PRODUCT_SLUGS: Record<string, string> = {
  "product-xx99-mark-two-headphones": "xx99-mark-ii",
  "product-xx99-mark-one-headphones": "xx99-mark-i",
  "product-xx59-headphones": "xx59",
  "product-zx9-speaker": "zx9",
  "product-zx7-speaker": "zx7",
  "product-yx1-earphones": "yx1",
};

// Variant slug mapping (from gallery image naming conventions)
const VARIANT_SLUGS: Record<string, string> = {
  "black": "black",
  "white": "white",
  "brown": "brown",
  "silver": "silver",
};

interface InventoryFile {
  localPath: string;
  type: "product-detail" | "category-preview" | "product-gallery" | "home-page" | "checkout" | "cart" | "shared" | "ui" | "icon";
  productSlug: string | null;
  variantSlug: string | null;
  size: "mobile" | "tablet" | "desktop" | "single";
  galleryIndex: number | null;
  suggestedR2Key: string;
  folder: string;
  filename: string;
}

function getExtension(filepath: string): string {
  return path.extname(filepath).slice(1).toLowerCase();
}

function isImageFile(filepath: string): boolean {
  const ext = getExtension(filepath);
  return ["jpg", "jpeg", "png", "webp", "avif", "gif"].includes(ext);
}

function parseGalleryVariant(filename: string): { galleryIndex: number | null; variantSlug: string | null } {
  const base = path.parse(filename).name;
  // Pattern: image-gallery-{index}-{variant-slug} or image-gallery-{index}
  const match = base.match(/^image-gallery-(\d+)(?:-(.+))?$/);
  if (match) {
    const index = parseInt(match[1], 10);
    const variantSlug = match[2] && VARIANT_SLUGS[match[2]] ? VARIANT_SLUGS[match[2]] : null;
    return { galleryIndex: index, variantSlug };
  }
  return { galleryIndex: null as number | null, variantSlug: null };
}

function walkDir(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  const allFiles = walkDir("assets");
  const inventory: InventoryFile[] = [];
  const errors: string[] = [];

  for (const filepath of allFiles) {
    if (!isImageFile(filepath) && !filepath.endsWith(".svg")) continue;

    const parts = filepath.split("/");
    // First two segments: assets/{category}/
    // Or: assets/{product-folder}/{size}/
    const category = parts[1];
    const filename = parts[parts.length - 1];
    const ext = getExtension(filepath);

    // Determine the size from the path
    let size: "mobile" | "tablet" | "desktop" | "single" = "single";
    if (
      parts.includes("mobile") ||
      filepath.startsWith("assets/home/mobile/") ||
      filepath.startsWith("assets/shared/mobile/")
    ) {
      size = "mobile";
    } else if (
      parts.includes("tablet") ||
      filepath.startsWith("assets/home/tablet/") ||
      filepath.startsWith("assets/shared/tablet/")
    ) {
      size = "tablet";
    } else if (
      parts.includes("desktop") ||
      filepath.startsWith("assets/home/desktop/") ||
      filepath.startsWith("assets/shared/desktop/")
    ) {
      size = "desktop";
    }

    const productSlug = PRODUCT_SLUGS[category] ?? null;

    let type: InventoryFile["type"] = "shared";
    let galleryIndex: number | null = null;
    let variantSlug: string | null = null;
    let suggestedR2Key = "";

    // Classify by path prefix
    if (productSlug) {
      // Product images
      const baseName = path.parse(filename).name;

      if (baseName.startsWith("image-category-page-preview")) {
        type = "category-preview";
        suggestedR2Key = `assets/products/${productSlug}/category-preview/${size}/${path.parse(filename).name}`;
      } else if (baseName.startsWith("image-gallery-")) {
        type = "product-gallery";
        const parsed = parseGalleryVariant(filename);
        galleryIndex = parsed.galleryIndex;
        variantSlug = parsed.variantSlug;
        const variantSuffix = variantSlug ? `-${variantSlug}` : "";
        suggestedR2Key = `assets/products/${productSlug}/gallery/${size}/image-gallery-${galleryIndex}${variantSuffix}`;
      } else if (baseName.startsWith("image-product")) {
        type = "product-detail";
        suggestedR2Key = `assets/products/${productSlug}/detail/${size}/${path.parse(filename).name}`;
      } else {
        suggestedR2Key = `assets/products/${productSlug}/other/${size}/${filename}`;
      }
    } else if (category === "home") {
      type = "home-page";
      const subPath = parts.slice(2).join("/");
      suggestedR2Key = `assets/home/${subPath}`;
    } else if (category === "checkout") {
      type = "checkout";
      suggestedR2Key = `assets/checkout/${filename}`;
    } else if (category === "cart") {
      type = "cart";
      suggestedR2Key = `assets/cart/${filename}`;
    } else if (category === "shared") {
      type = "shared";
      const subPath = parts.slice(2).join("/");
      suggestedR2Key = `assets/shared/${subPath}`;
    } else if (filepath.endsWith(".svg") || filepath.endsWith(".png") || filepath.endsWith(".ico")) {
      type = "icon";
      suggestedR2Key = `assets/icons/${filename}`;
    } else {
      // Fallback — reconstruct the path as R2 key
      suggestedR2Key = filepath;
    }

    // Remove extension from suggested key (upload script adds it back)
    suggestedR2Key = suggestedR2Key.replace(`.${ext}`, "");

    const folder = `products/${productSlug}`;

    inventory.push({
      localPath: filepath,
      type,
      productSlug,
      variantSlug,
      size,
      galleryIndex,
      suggestedR2Key,
      folder: productSlug ? folder : category,
      filename,
    });
  }

  // Write inventory
  const output = JSON.stringify({ files: inventory, generatedAt: new Date().toISOString() }, null, 2);
  await fsp.writeFile("scripts/asset-inventory.json", output);

  // Summary
  const byType: Record<string, number> = {};
  for (const f of inventory) {
    byType[f.type] = (byType[f.type] || 0) + 1;
  }

  console.log("Asset Inventory Generated");
  console.log("-------------------------");
  console.log(`Total files: ${inventory.length}`);
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log("\nOutput: scripts/asset-inventory.json");
  console.log("Errors:", errors.length > 0 ? errors : "none");
}

main().catch(console.error);
