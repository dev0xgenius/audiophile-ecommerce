# Storefront Image & Cart Polish — Build Checklist

**Legend:** `⬜` pending `🔄` in progress `✅` done

## Task 1: Image fallback foundation
- [x] `ImageFallback` component created (gray box + icon)
- [x] `ResponsiveImage` converted to client component with empty-src guard + `onError` fallback
- [x] Cart dialog thumbnails use fallback instead of "No img" text

## Task 2: Seed pipeline fix
- [x] `category-preview` → `purpose: "category"`; per-breakpoint folders derived from baseKey
- [x] Cart assets linked to products (`purpose: "cart"`) via `CART_SLUG_BY_FILENAME`
- [x] Legacy collided category-preview rows + orphan assets cleaned (idempotent)
- [x] `npm run seed` re-run: 120 assets, 0 errors

## Task 3: Category page images
- [x] Query `purpose: "category"` media, resolve src by folder suffix (`/mobile|/tablet|/desktop`)
- [x] Aspect-ratio rendering: `aspect-square md:aspect-[689/352] lg:aspect-[540/560]`, `fill` + `object-cover`
- [x] Fallback to primary detail asset when no category media

## Task 4: Category product links
- [x] `slug` + `categorySlug` passed to card; SEE PRODUCT → `/{category}/{slug}`

## Task 5: Cart thumbnails
- [x] Product page resolves `variants.thumbnail.webp` of cart asset; `AddToCart` `image` prop; dialog renders 64×64 thumb

## Task 6: Responsive cart dialog
- [x] `useIsMobile` + `useSyncExternalStore` mount guard; `modal={isMobile}`
- [x] md+: top-right (`md:top-[6.25rem] md:right-6 xl:right-[calc((100vw-1110px)/2)]`, 377px, max-h scroll), no overlay
- [x] Mobile: centered modal with overlay unchanged

## Verification
- [x] `npm run lint` — 0 errors
- [x] `npm run build` — success (48/48)
- [x] DB query: 3 category assets + 1 cart asset per product; 0 legacy orphans
- [x] Runtime: `/headphones` serves `category-preview/{size}` webp per breakpoint; links resolve; cart thumb URL on product page
