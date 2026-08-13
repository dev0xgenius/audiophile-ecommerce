# Implementation Plan: Storefront Image & Cart Polish

**Updated:** 2026-08-06

## Overview

Five storefront fixes: graceful image fallbacks, correct per-breakpoint category-preview images at Figma display sizes, working category product links, cart dialog thumbnails, and a responsive cart dialog (top-right dropdown without overlay on md+).

## Architecture Decisions

- **Category images (R2/seed pipeline fix):** `seedMediaAssets` now derives a unique `folder` from the manifest `baseKey` for `category-preview` entries (`products/{slug}/category-preview/{size}`), removing the `@@unique([folder, filename])` collision that collapsed mobile/tablet/desktop into one asset. Linked via new `purpose: "category"`. Each asset keeps standard `{thumbnail, medium, desktop, original}` derivative keys so the dashboard gallery keeps working.
- **Cart thumbnails (R2):** Seed links the existing `assets/cart/*.jpg` uploads (folder `cart`) to products via `CART_SLUG_BY_FILENAME` with `purpose: "cart"`. Product page resolves `variants.thumbnail.webp` and passes it through `AddToCart` into the localStorage cart item.
- **Image fallback:** Shared `ImageFallback` component (gray box + lucide icon). `ResponsiveImage` converted to a client component with empty-src guard and `onError` swap. Cart dialog thumbnails use the same fallback.
- **Cart dialog on md+:** True non-modal via `useIsMobile()` + `useSyncExternalStore` mount guard (avoids hydration mismatch and lint rule). `modal={false}` renders no overlay at all; content repositioned top-right with tailwind-merge overrides.
- **Category display sizes (Figma):** mobile 327×327 (`aspect-square`), tablet 689×352 (`md:aspect-[689/352]`), desktop 540×560 (`lg:aspect-[540/560]`), rendered with `fill` + `object-cover` on a gray rounded box.

## Task List

### Completed
- [x] Task 1: Image fallback foundation (`ImageFallback`, client `ResponsiveImage`, cart thumb fallback)
- [x] Task 2: Seed pipeline fix — per-breakpoint category-preview MediaAssets + cart thumb linking + legacy cleanup
- [x] Task 3: Category page — `purpose: "category"` media resolved by folder suffix, aspect-ratio rendering
- [x] Task 4: Category product links — `slug`/`categorySlug` passed to `CategoryProductCard`
- [x] Task 5: Cart thumbnails end-to-end — seed link → product page resolve → `AddToCart image` prop → dialog `CartThumb`
- [x] Task 6: Responsive cart dialog — `useIsMobile` + `useMounted` + top-right `md:` positioning classes

### Checkpoint: Complete
- [x] `npm run lint` — 0 errors
- [x] `npm run build` — success (48/48 routes)
- [x] Seed re-run — 120 assets, idempotent, legacy rows cleaned (0 orphans)
- [x] DB verified: each product has 3 category-preview assets (`/mobile|/tablet|/desktop`) + 1 cart asset
- [x] Runtime verified: category page serves `category-preview/{size}` webp per breakpoint; links resolve; cart thumbnail URL resolves on product page

## Files Touched

| File | Change |
|---|---|
| `components/ui/image-fallback.tsx` | New shared fallback component |
| `components/ui/responsive-image.tsx` | Client component; empty-src + `onError` fallback; skips invalid sources |
| `components/ui/cart-dialog.tsx` | `CartThumb` fallback; `useMounted` + `useIsMobile`; `modal={isMobile}`; `md:` top-right positioning |
| `lib/seed.ts` | `category-preview`→`category` purpose, per-breakpoint folders, cart linking map, legacy cleanup |
| `app/(shop)/[category]/page.tsx` | `purpose:"category"` query, folder-suffix src resolution, `slug`/`categorySlug` props |
| `app/(shop)/[category]/_components/category-product-card.tsx` | Aspect-ratio box + `fill`/`object-cover`; removed `imgWidth/imgHeight`/`metadataTitle` |
| `components/ui/add-to-cart.tsx` | Optional `image` prop |
| `app/(shop)/[category]/[product]/page.tsx` | Resolves cart thumbnail, passes `image` to `AddToCart` |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Seed cleanup deleting referenced assets | High | Cleanup targets only `image-category-page-preview.jpg` outside `/category-preview/` folders; verified 0 orphans after reseed |
| ResponsiveImage client conversion serialization | Med | All consumer props are plain data; all 8 usages verified compatible |
| `modal` toggle hydration mismatch | Med | `useSyncExternalStore` mount guard; SSR renders trigger-only |
| tailwind-merge dialog positioning overrides | Low | Verified `md:` overrides of `top/left/translate/max-w` in rendered HTML |
