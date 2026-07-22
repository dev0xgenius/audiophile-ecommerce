# Dashboard Implementation Tasks

PRD v1.1 — Mapped to actionable tasks per phase.

---

## Phase 1 — Foundation

### 1.1 Prisma Schema Expansion ✅

| #      | Task                                                                                                               | PRD Refs                         | Files                  | Status |
| ------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------- | ---------------------- | ------ |
| 1.1.1  | Auth models: `User`, `Account`, `Session`, `VerificationToken`, `Role`, `Permission`, `RolePermission`, `UserRole` | §7, FR-4.4.1, FR-4.4.2           | `prisma/schema.prisma` | ✅     |
| 1.1.2  | `AuditLogEntry`                                                                                                    | §7, FR-4.4.3, NFR Auditability   | `prisma/schema.prisma` | ✅     |
| 1.1.3  | Expanded `Product`, `Category`, `Supplier`                                                                         | §7, FR-4.2.1, FR-4.2.5, FR-4.2.6 | `prisma/schema.prisma` | ✅     |
| 1.1.4  | Expanded `Order`, `OrderLineItem`, `OrderStatusHistory`                                                            | §7, FR-4.3.1–4.3.3               | `prisma/schema.prisma` | ✅     |
| 1.1.5  | `PSPConnection`, `Payment`, `Refund`, `WebhookEvent`                                                               | §7, FR-4.5.1–4.5.8               | `prisma/schema.prisma` | ✅     |
| 1.1.6  | `MediaAsset`, `ProductMedia`                                                                                       | §7, FR-4.6.1–4.6.7               | `prisma/schema.prisma` | ✅     |
| 1.1.7  | `Customer`, `Address`, `CustomerNote`                                                                              | §7, FR-4.4.5–4.4.7               | `prisma/schema.prisma` | ✅     |
| 1.1.8  | `ProductVariant`, `StockLedgerEntry`                                                                               | §7, FR-4.2.2, FR-4.2.7–4.2.11    | `prisma/schema.prisma` | ✅     |
| 1.1.9  | `Shipment`, `ShipmentItem`, `Return`                                                                               | §7, FR-4.3.4, FR-4.3.5           | `prisma/schema.prisma` | ✅     |
| 1.1.10 | `Bundle`                                                                                                           | §7, FR-4.2.3                     | `prisma/schema.prisma` | ✅     |
| 1.1.11 | Dropped old Product fields (box, features, stocked), old OrderStatus enum                                          | §7                               | `prisma/schema.prisma` | ✅     |
| 1.1.12 | Dropped `Cart` / `CartItem` (storefront-managed)                                                                   | §7                               | `prisma/schema.prisma` | ✅     |
| 1.1.13 | Ran `prisma db push` + `prisma generate`                                                                           | —                                | CLI                    | ✅     |

### 1.2 Authentication (BetterAuth) ✅

| #     | Task                                                                                                      | PRD Refs              | Files                          | Status |
| ----- | --------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------ | ------ |
| 1.2.1 | Install `better-auth` + `@auth/prisma-adapter`                                                            | §8 Auth               | `package.json`                 | ✅     |
| 1.2.2 | Create `lib/auth.ts` — BetterAuth config with Prisma adapter, email/password, session, nextCookies plugin | §8 Auth, FR-4.4.1     | `lib/auth.ts`                  | ✅     |
| 1.2.3 | Create `app/api/auth/route.ts` — BetterAuth API route handler via `toNextJsHandler`                       | §8 Auth               | `app/api/auth/route.ts`        | ✅     |
| 1.2.4 | Create sign-in page at `/dashboard/login` with email/password form                                        | §8 Auth, FR-4.4.1     | `app/dashboard/login/page.tsx` | ✅     |
| 1.2.5 | Create middleware (`middleware.ts`) — protect `/dashboard/*`, redirect to login                           | §8 Auth, NFR Security | `middleware.ts`                | ✅     |
| 1.2.6 | Session handled via `nextCookies()` plugin (no provider needed)                                           | §8 Auth               | `lib/auth.ts`                  | ✅     |
| 1.2.7 | Create seed script: Owner/SuperAdmin user + 6 default roles + 36 permissions                              | FR-4.4.1, FR-4.4.2    | `lib/seed.ts`, `package.json`  | ✅     |

### 1.3 RBAC Middleware & Permission System ✅

| #     | Task                                                                                                           | PRD Refs           | Files                     | Status |
| ----- | -------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------- | ------ |
| 1.3.1 | Create `lib/auth/permissions.ts` — getUserPermissions, hasPermission, requirePermission, getSessionPermissions | §2.1, NFR Security | `lib/auth/permissions.ts` | ✅     |
| 1.3.2 | Create `withPermission` API route guard — wraps handlers with session check + permission check                 | §2.1               | `lib/auth/permissions.ts` | ✅     |
| 1.3.3 | Seed 36 permissions across 7 modules                                                                           | FR-4.4.2           | `lib/seed.ts`             | ✅     |
| 1.3.4 | Seed 6 roles with permission assignments                                                                       | §2.1               | `lib/seed.ts`             | ✅     |

### 1.4 Redux Toolkit Store Scaffolding ✅

| #     | Task                                                                    | PRD Refs | Files                           | Status |
| ----- | ----------------------------------------------------------------------- | -------- | ------------------------------- | ------ |
| 1.4.1 | Create Redux store with `configureStore` (ui + auth reducers)           | §8       | `app/store.ts`                  | ✅     |
| 1.4.2 | Create `StoreProvider` client component                                 | §8       | `components/store-provider.tsx` | ✅     |
| 1.4.3 | Add `<StoreProvider>` to dashboard layout                               | §8       | `app/dashboard/layout.tsx`      | ✅     |
| 1.4.4 | Create `uiSlice` (sidebar, filters) and `authSlice` (user, permissions) | §8       | `lib/redux/slices/`             | ✅     |
| 1.4.5 | Create typed hooks (`useAppDispatch`, `useAppSelector`, `useAppStore`)  | §8       | `lib/redux/hooks.ts`            | ✅     |

### 1.5 API Routes — Base Product CRUD ✅

| #     | Task                                                    | PRD Refs | Files                            | Status |
| ----- | ------------------------------------------------------- | -------- | -------------------------------- | ------ |
| 1.5.1 | `GET /api/products` — pagination, search, filter, sort  | FR-4.2.1 | `app/api/products/route.ts`      | ✅     |
| 1.5.2 | `POST /api/products` — create with Zod validation       | FR-4.2.1 | `app/api/products/route.ts`      | ✅     |
| 1.5.3 | `GET /api/products/[id]` — single product detail        | FR-4.2.1 | `app/api/products/[id]/route.ts` | ✅     |
| 1.5.4 | `PUT /api/products/[id]` — update product               | FR-4.2.1 | `app/api/products/[id]/route.ts` | ✅     |
| 1.5.5 | `DELETE /api/products/[id]` — soft-delete (archive)     | FR-4.2.1 | `app/api/products/[id]/route.ts` | ✅     |
| 1.5.6 | `GET /api/categories` — nested tree                     | FR-4.2.5 | `app/api/categories/route.ts`    | ✅     |
| 1.5.7 | `POST /api/categories` — create category                | FR-4.2.5 | `app/api/categories/route.ts`    | ✅     |
| 1.5.8 | Zod validation schemas for product + category endpoints | §8       | `lib/validations/`               | ✅     |

### 1.6 API Routes — Basic Order List ✅

| #     | Task                                                              | PRD Refs | Files                                 | Status |
| ----- | ----------------------------------------------------------------- | -------- | ------------------------------------- | ------ |
| 1.6.1 | `GET /api/orders` — pagination, filters, search                   | FR-4.2.3 | `app/api/orders/route.ts`             | ✅     |
| 1.6.2 | `GET /api/orders/[id]` — order detail w/ items, payments, history | FR-4.2.3 | `app/api/orders/[id]/route.ts`        | ✅     |
| 1.6.3 | `PUT /api/orders/[id]/status` — validated status transition       | FR-4.2.3 | `app/api/orders/[id]/status/route.ts` | ✅     |
| 1.6.4 | Zod schemas for order filters + status transitions                | §8       | `lib/validations/order.ts`            | ✅     |

### 1.7 API Routes — Paystack PSP Integration ✅

| #     | Task                                                                    | PRD Refs                     | Files                                | Status |
| ----- | ----------------------------------------------------------------------- | ---------------------------- | ------------------------------------ | ------ |
| 1.7.1 | PSP adapter interface                                                   | §8 PSP Integration           | `lib/psp/types.ts`                   | ✅     |
| 1.7.2 | Paystack adapter: initialize transaction, refund, webhook verification  | FR-4.5.1, FR-4.5.5, FR-4.5.4 | `lib/psp/paystack.ts`                | ✅     |
| 1.7.3 | PSP adapter factory                                                     | —                            | `lib/psp/factory.ts`                 | ✅     |
| 1.7.4 | `GET`/`POST /api/psp/connections` — list + save encrypted Paystack keys | FR-4.5.1, FR-4.5.2           | `app/api/psp/connections/route.ts`   | ✅     |
| 1.7.5 | `POST /api/webhooks/paystack` — webhook handler (HMAC verification)     | FR-4.5.4                     | `app/api/webhooks/paystack/route.ts` | ✅     |
| 1.7.6 | Encryption utility for PSP credential storage                           | NFR Security                 | `lib/crypto.ts`                      | ✅     |

### 1.8 Dashboard UI — Base Product CRUD (Wire to API) ✅

| #     | Task                                                                       | PRD Refs      | Files                                                                                                                                                                         | Status |
| ----- | -------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1.8.1 | Rewrite `/dashboard/products/page.tsx` — fetch from API, wire CRUD dialogs | FR-4.2.1, §12 | `app/dashboard/products/page.tsx`, `components/dashboard/product-table.tsx`, `components/dashboard/product-form-dialog.tsx`, `components/dashboard/product-delete-dialog.tsx` | ✅     |
| 1.8.2 | Loading skeleton for products page                                         | §12.1         | `app/dashboard/products/loading.tsx`                                                                                                                                          | ✅     |
| 1.8.3 | Error boundary for products page                                           | §12.2         | `app/dashboard/products/error.tsx`                                                                                                                                            | ✅     |
| 1.8.4 | Category manager UI wired to API                                           | FR-4.2.5      | `components/dashboard/category-manager.tsx`                                                                                                                                   | ✅     |

### 1.9 Dashboard UI — Basic Order List (Wire to API) ✅

| #     | Task                                                                                                 | PRD Refs                | Files                                                                                                                                                                   | Status |
| ----- | ---------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1.9.1 | Rewrite `/dashboard/orders/page.tsx` — fetch from API, display with filters, wire status transitions | FR-4.3.1, FR-4.3.3, §12 | `app/dashboard/orders/page.tsx`, `components/dashboard/order-table.tsx`, `components/dashboard/order-detail-dialog.tsx`, `components/dashboard/order-status-update.tsx` | ✅     |
| 1.9.2 | Loading skeleton for orders page                                                                     | §12.1                   | `app/dashboard/orders/loading.tsx`                                                                                                                                      | ✅     |
| 1.9.3 | Error boundary for orders page                                                                       | §12.2                   | `app/dashboard/orders/error.tsx`                                                                                                                                        | ✅     |

### 1.10 Dashboard UI — Loading & Error Infrastructure ✅

| #      | Task                                                               | PRD Refs | Files                         | Status |
| ------ | ------------------------------------------------------------------ | -------- | ----------------------------- | ------ |
| 1.10.1 | Create `loading.tsx` for root dashboard (sidebar + skeleton shell) | §12.1    | `app/dashboard/loading.tsx`   | ✅     |
| 1.10.2 | Create `error.tsx` for root dashboard                              | §12.2    | `app/dashboard/error.tsx`     | ✅     |
| 1.10.3 | Create `not-found.tsx` for dashboard routes                        | §12.3    | `app/dashboard/not-found.tsx` | ✅     |
| 1.10.4 | `<Empty>` component exists and usable for zero-row states          | §12.2    | `components/ui/empty.tsx`     | ✅     |
| 1.10.5 | `sonner` `<Toaster>` wired in dashboard layout                     | §12.2    | `app/dashboard/layout.tsx`    | ✅     |

### 1.11 Dashboard Overview Page (Wire to Real Data) ✅

| #      | Task                                                   | PRD Refs | Files                                        | Status |
| ------ | ------------------------------------------------------ | -------- | -------------------------------------------- | ------ |
| 1.11.1 | Rewrite `/dashboard/page.tsx` — fetch metrics from API | FR-4.1.1 | `app/dashboard/page.tsx`                     | ✅     |
| 1.11.2 | Create `GET /api/dashboard/metrics` — aggregate stats  | FR-4.1.1 | `app/api/dashboard/metrics/route.ts`         | ✅     |
| 1.11.3 | Create `GET /api/dashboard/needs-attention` endpoint   | FR-4.1.3 | `app/api/dashboard/needs-attention/route.ts` | ✅     |
| 1.11.4 | "Needs attention" widget                               | FR-4.1.3 | `components/dashboard/needs-attention.tsx`   | ✅     |
| 1.11.5 | Quick links section                                    | FR-4.1.5 | `app/dashboard/page.tsx`                     | ✅     |

### 1.12 Dashboard Sidebar & Navigation Update ✅

| #      | Task                                                 | PRD Refs | Files                        | Status |
| ------ | ---------------------------------------------------- | -------- | ---------------------------- | ------ |
| 1.12.1 | Add nav items: Customers, Payments, Gallery          | §2.1, §3 | `components/app-sidebar.tsx` | ✅     |
| 1.12.2 | Update `NavMain` items to include all Phase 1 routes | —        | `components/app-sidebar.tsx` |

---

## Phase 2 — Core Operations ✅

> **Note:** All Phase 2 tasks are complete. One follow-up item: `reserveStock()` / `releaseStock()` in `lib/services/stock.ts` exist but are not yet wired into the order checkout lifecycle (storefront integration task, not a Phase 2 gap).

### 2.1 Product Variants & Stock Per Variant ✅

| #     | Task                                                            | PRD Refs | Files                                          | Status |
| ----- | --------------------------------------------------------------- | -------- | ---------------------------------------------- | ------ |
| 2.1.1 | `GET /api/products/[id]/variants` — list variants for a product | FR-4.2.2 | `app/api/products/[id]/variants/route.ts`      | ✅     |
| 2.1.2 | `POST /api/products/[id]/variants` — create variant             | FR-4.2.2 | `app/api/products/[id]/variants/route.ts`      | ✅     |
| 2.1.3 | `PUT /api/variants/[id]` — update variant                       | FR-4.2.2 | `app/api/variants/[id]/route.ts`               | ✅     |
| 2.1.4 | `DELETE /api/variants/[id]` — deactivate variant                | FR-4.2.2 | `app/api/variants/[id]/route.ts`               | ✅     |
| 2.1.5 | Update product form dialog to support variant management        | FR-4.2.2 | `components/dashboard/product-form-dialog.tsx` | ✅     |
| 2.1.6 | Update inventory table to show per-variant stock levels         | FR-4.2.7 | `components/dashboard/inventory-table.tsx`     | ✅     |

### 2.2 Stock Ledger & Audit Trail ✅

| #     | Task                                                                                                        | PRD Refs  | Files                                              | Status |
| ----- | ----------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------- | ------ |
| 2.2.1 | `POST /api/stock/adjust` — manual adjustment with reason code, creates `StockLedgerEntry` + `AuditLogEntry` | FR-4.2.8  | `app/api/stock/adjust/route.ts`                    | ✅     |
| 2.2.2 | `GET /api/stock/ledger?variantId=X` — stock movement history per variant                                    | FR-4.2.11 | `app/api/stock/ledger/route.ts`                    | ✅     |
| 2.2.3 | Reserved stock logic: order placed → reserve stock; payment fails → release; order cancelled → release      | FR-4.2.10 | `lib/services/stock.ts`                            | ✅     |
| 2.2.4 | Wire inventory adjust dialog to API                                                                         | FR-4.2.8  | `components/dashboard/inventory-adjust-dialog.tsx` | ✅     |
| 2.2.5 | Add stock movement history view to inventory/variant detail                                                 | FR-4.2.11 | `components/dashboard/stock-ledger.tsx`            | ✅     |
| 2.2.6 | Update inventory page to fetch real data from API                                                           | FR-4.2.7  | `app/dashboard/inventory/page.tsx`                 | ✅     |

### 2.3 Order Fulfillment Workflow ✅

| #     | Task                                                                                     | PRD Refs | Files                                          | Status |
| ----- | ---------------------------------------------------------------------------------------- | -------- | ---------------------------------------------- | ------ |
| 2.3.1 | `POST /api/orders/[id]/fulfill` — create shipment (manual tracking number)               | FR-4.3.4 | `app/api/orders/[id]/fulfill/route.ts`         | ✅     |
| 2.3.2 | `POST /api/orders/[id]/ship` — mark as shipped (triggers status transition + audit log)  | FR-4.3.4 | `app/api/orders/[id]/ship/route.ts`            | ✅     |
| 2.3.3 | Add fulfillment UI to order detail dialog (pack items, enter tracking, partial shipment) | FR-4.3.4 | `components/dashboard/fulfillment-panel.tsx`   | ✅     |
| 2.3.4 | Add shipment history display in order detail                                             | FR-4.3.2 | `components/dashboard/order-detail-dialog.tsx` | ✅     |

### 2.4 Paystack PSP Integration ✅

| #     | Task                                                                         | PRD Refs | Files                                | Status |
| ----- | ---------------------------------------------------------------------------- | -------- | ------------------------------------ | ------ |
| 2.4.1 | Implement Paystack adapter (initialize transaction, verify, refund, webhook) | FR-4.5.1 | `lib/psp/paystack.ts`                | ✅     |
| 2.4.2 | `POST /api/webhooks/paystack` — Paystack webhook handler                     | FR-4.5.4 | `app/api/webhooks/paystack/route.ts` | ✅     |
| 2.4.3 | Add PSP selector to PSP connection management UI                             | FR-4.5.1 | `components/dashboard/psp-form.tsx`  | ✅     |

### 2.5 Webhook Event Log ✅

| #     | Task                                                                                  | PRD Refs | Files                                      | Status |
| ----- | ------------------------------------------------------------------------------------- | -------- | ------------------------------------------ | ------ |
| 2.5.1 | `GET /api/webhooks` — list webhook events with filters (status, provider, date range) | FR-4.5.4 | `app/api/webhooks/route.ts`                | ✅     |
| 2.5.2 | `POST /api/webhooks/[id]/retry` — manual retry of failed webhook                      | FR-4.5.4 | `app/api/webhooks/[id]/retry/route.ts`     | ✅     |
| 2.5.3 | Create webhook event log page in dashboard                                            | FR-4.5.4 | `app/dashboard/payments/webhooks/page.tsx` | ✅     |

### 2.6 Media Gallery Upload (S3/R2) ✅

| #     | Task                                                                                                                | PRD Refs                     | Files                                                                      | Status |
| ----- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------- | ------ |
| 2.6.1 | Create S3/R2 client utility (presigned upload URLs or direct upload via signed requests)                            | FR-4.6.2, §8 Asset Storage   | `lib/storage/s3.ts`                                                        | ✅     |
| 2.6.2 | `POST /api/media/upload` — upload file, store in S3/R2, create `MediaAsset` record, generate responsive derivatives | FR-4.6.2, FR-4.6.6           | `app/api/media/upload/route.ts`                                            | ✅     |
| 2.6.3 | `GET /api/media` — list assets with tags, folder, date filters                                                      | FR-4.6.3                     | `app/api/media/route.ts`                                                   | ✅     |
| 2.6.4 | `DELETE /api/media/[id]` — soft-delete with orphan check                                                            | FR-4.6.6                     | `app/api/media/[id]/route.ts`                                              | ✅     |
| 2.6.5 | `PUT /api/media/[id]` — update metadata (alt text, tags, folder)                                                    | FR-4.6.5                     | `app/api/media/[id]/route.ts`                                              | ✅     |
| 2.6.6 | Create image derivative pipeline (sharp/WASM) — generates mobile/tablet/desktop sizes                               | FR-4.6.2                     | `lib/storage/image-processor.ts`                                           | ✅     |
| 2.6.7 | Create media gallery page: drag-and-drop upload, grid view, search/filter by tag                                    | FR-4.6.1, FR-4.6.2, FR-4.6.3 | `app/dashboard/gallery/page.tsx`, `components/dashboard/media-gallery.tsx` | ✅     |
| 2.6.8 | Add image picker/browser to product form dialog (attach images to product)                                          | FR-4.6.4                     | `components/dashboard/image-picker.tsx`                                    | ✅     |

### 2.7 Customer List & Profile ✅

| #     | Task                                                                                   | PRD Refs | Files                                                                                                                             | Status |
| ----- | -------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 2.7.1 | `GET /api/customers` — list/search customers with pagination                           | FR-4.4.5 | `app/api/customers/route.ts`                                                                                                      | ✅     |
| 2.7.2 | `GET /api/customers/[id]` — customer profile with order history, LTV, addresses, notes | FR-4.4.5 | `app/api/customers/[id]/route.ts`                                                                                                 | ✅     |
| 2.7.3 | `PUT /api/customers/[id]` — add internal notes, flag as VIP/fraud-risk                 | FR-4.4.6 | `app/api/customers/[id]/route.ts`                                                                                                 | ✅     |
| 2.7.4 | `DELETE /api/customers/[id]` — GDPR anonymize                                          | FR-4.4.7 | `app/api/customers/[id]/route.ts`                                                                                                 | ✅     |
| 2.7.5 | `GET /api/customers/[id]/export` — GDPR data export                                    | FR-4.4.7 | `app/api/customers/[id]/export/route.ts`                                                                                          | ✅     |
| 2.7.6 | Create customers page in dashboard                                                     | FR-4.4.5 | `app/dashboard/customers/page.tsx`, `components/dashboard/customer-table.tsx`, `components/dashboard/customer-profile-dialog.tsx` | ✅     |

---

## Phase 3 — Analytics & Management ✅

### 3.1 Dashboard Analytics with Real Data ✅

| #     | Task                                                                                        | PRD Refs           | Files                                          | Status |
| ----- | ------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------- | ------ |
| 3.1.1 | `GET /api/dashboard/revenue` — revenue by day/week/month for date range + period comparison | FR-4.1.1, FR-4.1.2 | `app/api/dashboard/revenue/route.ts`           | ✅     |
| 3.1.2 | `GET /api/dashboard/top-products` — top-selling products and categories for period          | FR-4.1.4           | `app/api/dashboard/top-products/route.ts`      | ✅     |
| 3.1.3 | Add date range selector component (today, 7d, 30d, custom)                                  | FR-4.1.1           | `components/dashboard/date-range-selector.tsx` | ✅     |
| 3.1.4 | Wire revenue chart to real API data with period comparison                                  | FR-4.1.2           | `components/chart-area-interactive.tsx`        | ✅     |
| 3.1.5 | Wire "Needs attention" widget to real API                                                   | FR-4.1.3           | `components/dashboard/needs-attention.tsx`     | ✅     |
| 3.1.6 | Add top products/categories section to dashboard                                            | FR-4.1.4           | `components/dashboard/top-products.tsx`        | ✅     |

### 3.2 Bundles/Kits ✅

| #     | Task                                                                                             | PRD Refs | Files                                         | Status |
| ----- | ------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------- | ------ |
| 3.2.1 | `POST /api/bundles` — create bundle (products + quantities + optional component stock decrement) | FR-4.2.3 | `app/api/bundles/route.ts`                    | ✅     |
| 3.2.2 | `GET /api/bundles` — list bundles                                                                | FR-4.2.3 | `app/api/bundles/route.ts`                    | ✅     |
| 3.2.3 | `PUT /api/bundles/[id]` — update bundle                                                          | FR-4.2.3 | `app/api/bundles/[id]/route.ts`               | ✅     |
| 3.2.4 | Add bundle management UI                                                                         | FR-4.2.3 | `components/dashboard/bundle-form-dialog.tsx` | ✅     |

### 3.3 Supplier Records ✅

| #     | Task                                                             | PRD Refs | Files                                                                          | Status |
| ----- | ---------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------ | ------ |
| 3.3.1 | `GET /api/suppliers` — list/search suppliers                     | FR-4.2.6 | `app/api/suppliers/route.ts`                                                   | ✅     |
| 3.3.2 | `POST /api/suppliers` — create supplier                          | FR-4.2.6 | `app/api/suppliers/route.ts`                                                   | ✅     |
| 3.3.3 | `PUT /api/suppliers/[id]` — update supplier                      | FR-4.2.6 | `app/api/suppliers/[id]/route.ts`                                              | ✅     |
| 3.3.4 | Add supplier management page and supplier picker on product form | FR-4.2.6 | `app/dashboard/suppliers/page.tsx`, `components/dashboard/suppliers-table.tsx` | ✅     |

### 3.4 Order Export ✅

| #     | Task                                                                | PRD Refs | Files                                       | Status |
| ----- | ------------------------------------------------------------------- | -------- | ------------------------------------------- | ------ |
| 3.4.1 | `GET /api/orders/export?format=csv` — CSV export of filtered orders | FR-4.3.7 | `app/api/orders/export/route.ts`            | ✅     |
| 3.4.2 | `GET /api/orders/[id]/invoice` — PDF invoice generation             | FR-4.3.7 | `app/api/orders/[id]/invoice/route.ts`      | ✅     |
| 3.4.3 | `GET /api/orders/[id]/packing-slip` — PDF packing slip              | FR-4.3.7 | `app/api/orders/[id]/packing-slip/route.ts` | ✅     |
| 3.4.4 | Add export button to orders page (CSV download)                     | FR-4.3.7 | `components/dashboard/order-table.tsx`      | ✅     |

---

## Phase 4 — Scale & Polish

### 4.1 Backorder / Preorder

| #     | Task                                                                                                 | PRD Refs  | Files                                          |
| ----- | ---------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------- |
| 4.1.1 | Update Product model: add `allow_backorder`, `expected_restock_date` fields                          | FR-4.2.12 | `prisma/schema.prisma`                         |
| 4.1.2 | Backorder logic: allow checkout with stock=0 when `allow_backorder=true`, show expected restock date | FR-4.2.12 | `lib/services/stock.ts`                        |
| 4.1.3 | Add backorder indicator + restock date field to product form                                         | FR-4.2.12 | `components/dashboard/product-form-dialog.tsx` |

### 4.2 Bulk Operations

| #     | Task                                                                                       | PRD Refs | Files                                         |
| ----- | ------------------------------------------------------------------------------------------ | -------- | --------------------------------------------- |
| 4.2.1 | `POST /api/products/bulk/update` — bulk price update, status change, category reassignment | FR-4.2.4 | `app/api/products/bulk/update/route.ts`       |
| 4.2.2 | `POST /api/products/bulk/import` — CSV import with validation + error report               | FR-4.2.4 | `app/api/products/bulk/import/route.ts`       |
| 4.2.3 | `GET /api/products/bulk/export` — CSV export of product catalog                            | FR-4.2.4 | `app/api/products/bulk/export/route.ts`       |
| 4.2.4 | Add bulk action toolbar to products table (select rows → bulk action)                      | FR-4.2.4 | `components/dashboard/data-table-toolbar.tsx` |

### 4.3 Multi-PSP Fallback

| #     | Task                                                                | PRD Refs | Files                               |
| ----- | ------------------------------------------------------------------- | -------- | ----------------------------------- |
| 4.3.1 | Update PSP selector in checkout to use priority order with fallback | FR-4.5.2 | `lib/services/payment.ts`           |
| 4.3.2 | Add PSP priority reorder UI in PSP management                       | FR-4.5.2 | `components/dashboard/psp-list.tsx` |
| 4.3.3 | Currency/region restriction UI for each PSP                         | FR-4.5.2 | `components/dashboard/psp-form.tsx` |

### 4.4 Accessibility Audit

| #     | Task                                                       | PRD Refs                    | Files |
| ----- | ---------------------------------------------------------- | --------------------------- | ----- |
| 4.4.1 | Audit: keyboard navigation across all dashboard pages      | NFR Accessibility           | —     |
| 4.4.2 | Audit: color contrast on all text elements                 | NFR Accessibility           | —     |
| 4.4.3 | Audit: screen reader labels on tables, forms, icons        | NFR Accessibility           | —     |
| 4.4.4 | Audit: alt text on all images in gallery and product forms | NFR Accessibility, FR-4.6.5 | —     |

### 4.5 Edge Cases & Polish

| #     | Task                                                                  | PRD Refs        | Files                                       |
| ----- | --------------------------------------------------------------------- | --------------- | ------------------------------------------- |
| 4.5.1 | Chargeback handling: dispute tracking page with status + linked order | FR-4.5.7        | `components/dashboard/dispute-tracking.tsx` |
| 4.5.2 | Partial refunds UI in order detail                                    | FR-4.3.5        | `components/dashboard/refund-form.tsx`      |
| 4.5.3 | Return management: approve/reject/restock flow                        | FR-4.3.5        | `components/dashboard/return-form.tsx`      |
| 4.5.4 | Performance: add DB indexes, query optimization                       | NFR Performance | `prisma/schema.prisma`                      |
| 4.5.5 | Payout/settlement visibility (read-only from PSP API)                 | FR-4.5.6        | `components/dashboard/payout-summary.tsx`   |
| 4.5.6 | GDPR data anonymization flow                                          | FR-4.4.7        | `lib/gdpr.ts`                               |
| 4.5.7 | Configurable session timeout                                          | NFR Security    | `auth.ts`, `middleware.ts`                  |

---

## Current Codebase State

Phases 1 and 2 are fully implemented. The codebase has:

| Area                                  | Status                                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------- |
| Schema (`prisma/schema.prisma`)       | Full expanded schema (all Phase 1.1 models)                                      |
| Auth (`lib/auth.ts`, `middleware.ts`) | BetterAuth with email/password, RBAC                                             |
| API routes (`app/api/`)               | Full CRUD for products, orders, variants, stock, customers, media, PSP, webhooks |
| Dashboard pages (`app/dashboard/`)    | Products, orders, inventory, customers, gallery, payments, webhooks              |
| Analytics (`app/dashboard/page.tsx`)  | Metrics API, needs-attention, recent orders, stat cards                          |
| Storefront (`app/(shop)/`)            | Existing storefront pages (not modified by dashboard work)                       |

---

## Task Roadmap (Suggested Execution Order)

```
Phase 1:

  1.1  Prisma Schema (all models at once)
   ↓
  1.2  Auth (NextAuth) + 1.3 RBAC
   ↓
  1.4  Redux Store
   ↓
  1.5  Product API + 1.6 Order API
   ↓
  1.7  Stripe integration
   ↓
  1.8  Product UI + 1.9 Order UI
   ↓
  1.10 Loading/Error UI + 1.11 Overview + 1.12 Nav

Phase 2 (✅ Complete):

  2.1  Variants → 2.2 Stock Ledger → 2.3 Fulfillment
  2.4  Paystack + 2.5 Webhooks
  2.6  Media Gallery
  2.7  Customers

Phase 3 (✅ Complete):

   3.1  Analytics → 3.2 Bundles → 3.3 Suppliers
   3.4  Export

Phase 4:

  4.1  Backorder → 4.2 Bulk Ops → 4.3 Multi-PSP
  4.4  Accessibility → 4.5 Edge Cases
```
