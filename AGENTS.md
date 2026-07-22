# Audiophile Ecommerce — AGENTS.md

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm run lint` | ESLint (flat config, Next.js core-web-vitals + typescript) |

No test, typecheck (`tsc --noEmit`), or format scripts exist. `next build` runs typecheck automatically.

## Architecture

- **Next.js 16 App Router** with `@/` path alias mapping to project root.
- **Tailwind CSS v4** — no `tailwind.config.*`; all theme in `app/globals.css` via `@theme inline {}`. Custom color `--color-gray: #f1f1f1`, radius `--radius: 0.25rem`.
- **shadcn/ui (New York style)** — components under `components/ui/`, aliases in `components.json`.
- **Prisma** — schema at `prisma/schema.prisma`, client generated to `generated/prisma`. Database is PostgreSQL. Dashboard and storefront share the same DB tightly coupled (no separate API backend).
- **Redux Toolkit** — used for client-side dashboard state (form state, UI state, optimistic updates). Store configured in `app/store.ts`. Server data fetched via Server Components + Prisma directly.
- **Auth** — NextAuth.js (Auth.js) v5 with Prisma adapter and credentials provider. RBAC enforced server-side via middleware. Session management via JWT.

## Layout & Navigation

- `app/layout.tsx` wraps all pages with `<Header />` then `<Footer>` containing `<AboutInfo />`.
- Header and Footer return empty fragments for `/dashboard/*` paths (checked via `usePathname()`).
- Dashboard has its own layout (`app/dashboard/layout.tsx`) with sidebar.

## Responsive Pattern

- **Breakpoints**: mobile <768px, tablet 768–1023px, desktop ≥1024px.
- Tailwind: `md:` (768px+) for tablet-and-up, `lg:` (1024px+) for desktop-only overrides.
- `hooks/use-mobile.ts` uses `max-width: 767px` matchMedia for JS breakpoint.
- Images: use `<ResponsiveImage>` (client component) with `mobileSrc`, `tabletSrc`, `desktopSrc` props. All product/home/shared images have `assets/*/{mobile,tablet,desktop}/` variants.
- Imports: product images from `@/assets/<product-name>/{mobile,tablet,desktop}/`, shared images from `@/assets/shared/{mobile,tablet,desktop}/`, home page from `@/assets/home/{mobile,tablet,desktop}/`.

## Code Style

- Server components by default; add `"use client"` for interactivity (state, effects, router hooks).
- Class merging: `cn()` from `@/lib/utils` (clsx + tailwind-merge).
- No comments in code unless essential.
- No explicit Tailwind config — use Tailwind v4 arbitrary values with `@theme` for custom tokens.

## Design System

- **Font**: Manrope via `next/font/google`, loaded in `app/layout.tsx` as `--font-sans`.
- **Color tokens** (in `app/globals.css`):
  - `bg-primary` / `text-primary` → `#D87D4A` (orange accent)
  - `bg-primary-hover` → `#FBAF85` (light orange hover)
  - `bg-darker` → `#101010` (near-black, used for hero/footer backgrounds)
  - `bg-secondary` → `#000000` (pure black)
  - `bg-gray` → `#F1F1F1` (light gray)
  - `bg-off-white` → `#FAFAFA`
  - `text-accent-foreground` → `#979797` (muted text)
  - `text-error` / `border-error` → `#CD2C2C` (error red)
  - `border-ring` → `#D87D4A` (focus ring on inputs)
- **Typography utilities** (Tailwind v4 `@theme` tokens): `text-h1` through `text-h6`, `text-overline`, `text-sub-title`, `text-body`. All H1–H6 + Overline + Sub-title auto-uppercase.
- **Button variants** in `components/ui/button.tsx`:
  - `default` → solid `#D87D4A`, hover `#FBAF85`, sharp corners, uppercase.
  - `outline` → transparent bg, `#000000` border, black text; hover: bg black, text white.
- **Inputs** (`components/ui/input.tsx`): `rounded-lg` (8px), focus ring `#D87D4A`, error border `#CD2C2C`.
- **Radios** (`components/ui/radio-group.tsx`): hover and selected border transitions to `#D87D4A`.
- **Counter** (`components/ui/counter.tsx`): `+`/`-` buttons change to `#D87D4A` on hover.
- **Field labels** (`components/ui/field.tsx`): turn `text-error` when parent field has `data-invalid`.

## Key Files & Entrypoints

| File | Purpose |
|---|---|
| `app/page.tsx` | Home page (Hero, Categories, Products) |
| `app/layout.tsx` | Root layout (Header, Footer, AboutInfo) |
| `app/(shop)/[category]/page.tsx` | Category listing |
| `app/(shop)/[category]/[product]/page.tsx` | Product detail |
| `app/checkout/page.tsx` | Checkout with form |
| `components/ui/header.tsx` | Site header + mobile menu dialog |
| `components/ui/footer.tsx` | Site footer |
| `components/ui/home/hero.tsx` | Hero section (server component, uses HeaderImage client) |
| `components/ui/home/image-header.tsx` | Client hero image swapper |
| `components/ui/responsive-image.tsx` | Client responsive image swapper |
| `components/ui/home/category-list.tsx` | Category grid |
| `components/ui/home/product-list.tsx` | ZX9, ZX7, YX1 product cards |
| `components/ui/home/about-info.tsx` | "Best Audio Gear" section |
| `app/globals.css` | Tailwind v4 theme + CSS variables |
