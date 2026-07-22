# Implementation Plan: Phase 4 — Scale & Polish

**Updated:** 2026-07-21

## Overview

Deliver production-ready end-to-end checkout flow (storefront → Paystack → order → email confirmation), migrate the storefront to use Prisma data, then fill remaining operational gaps: staff/role management, audit log, bulk operations, refunds/returns, and accessibility/performance polish.

## Architecture Decisions

- **Email**: Resend + react-email for typed templates
- **PSP**: Paystack only (Stripe deferred). Routing service for future multi-PSP
- **Cart**: localStorage-based client cart (no server-side cart API)
- **Storefront Data**: Migrate from hardcoded to Prisma-fetched data. Images stay as local asset imports (bundled at build time)
- **Backorder**: Deferred to future phase
- **Checkout**: Real flow: product page → localStorage cart → checkout form → POST /api/checkout → Paystack redirect → webhook → confirm order + reserve stock + email confirmation
- **Audit Log**: Server Component page reusing existing AuditLogEntry model

## Task List

### Slice 0: Schema & Foundation

- [ ] **0.1 — DB Indexes**: Add composite indexes on Order(status+createdAt), StockLedgerEntry(variantId+timestamp), AuditLogEntry(timestamp), Product(status)
- [ ] **0.2 — Fix Stock Service**: Fix beforeQuantity/afterQuantity hardcoded to 0 in reserveStock()/releaseStock()
- [ ] **0.3 — Restore Product Fields**: Add `features String[]` and `box Json?` to Product model. Run prisma db push
- [ ] **0.4 — Seed Product Data**: Seed categories, products, variants matching storefront content

### Checkpoint: Slice 0
- [ ] npm run build succeeds
- [ ] prisma db push succeeds
- [ ] Seed products exist in DB

### Slice 1: Payments & Storefront End-to-End

- [ ] **1.1 — Email Service**: Resend SDK wrapper + order-confirmation and order-shipped react-email templates
- [ ] **1.2 — PSP Routing Service**: lib/services/payment.ts with selectPSP(), createPayment(), processRefund(). /api/payments transaction log
- [ ] **1.3 — Webhook Event Processing**: Handle charge.success (order→paid, reserveStock, email) and charge.failed (order→cancelled, releaseStock). Idempotent via pspEventId
- [ ] **1.4 — Checkout API**: POST /api/checkout — validate stock, create Order+LineItems, reserve stock, init Paystack, return authorization_url
- [ ] **1.5 — Cart + Storefront Checkout**: localStorage cart on product page. Wire checkout page to API. Order confirmation page

### Checkpoint: Slice 1
- [ ] Guest can browse → add to cart → checkout → pay → see confirmation
- [ ] Order created in DB, stock reserved, email sent
- [ ] Paystack webhook processes success/failure correctly

### Slice 2: Storefront Prisma Migration

- [ ] **2.1 — Category Page**: Fetch products from Prisma by category slug
- [ ] **2.2 — Product Detail Page**: Fetch by slug from Prisma, features/box from new fields
- [ ] **2.3 — Home Page**: Fetch featured products from Prisma

### Checkpoint: Slice 2
- [ ] All storefront pages load real data from DB
- [ ] "Add to Cart" uses real variant IDs from Prisma

### Slice 3: Operational Completeness

- [ ] **3.1 — Staff & Role Management UI**: Users page, roles page with permission matrix, invite/deactivate
- [ ] **3.2 — Audit Log UI**: /dashboard/audit with paginated table + filters
- [ ] **3.3 — Manual Order Creation**: POST /api/orders (staff source) + order creation dialog

### Checkpoint: Slice 3
- [ ] Staff management works end-to-end
- [ ] Audit log page renders real data
- [ ] Manual order creation works

### Slice 4: Commerce Features

- [ ] **4.1 — Bulk Operations**: CSV import/export, bulk update API, toolbar on products table
- [ ] **4.2 — Refunds & Returns UI**: Refund API + /dashboard/returns with approve/reject/restock

### Checkpoint: Slice 4
- [ ] CSV import/export works correctly
- [ ] Refund routed through Paystack
- [ ] Return management functional

### Slice 5: Polish

- [ ] **5.1 — Accessibility Audit**: Keyboard nav, color contrast, aria labels, alt text
- [ ] **5.2 — Performance & Edge Cases**: Session timeout config, GDPR utility, chargeback tracking, pagination defaults

### Checkpoint: Complete
- [ ] All acceptance criteria met
- [ ] End-to-end flow: storefront checkout → payment → order → email
- [ ] Dashboard fully functional for all modules

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Checkout complexity (PSP redirect + webhook + stock + email) | High | Build API first, test with curl before UI integration |
| Paystack webhook duplicates | High | Idempotency via pspEventId — check before processing |
| Stock race conditions | Medium | reserveStock uses Prisma $transaction |
| Resend sandbox (verified recipients only) | Medium | Note in dev setup; use verified email for testing |
| Storefront image-to-Prisma mapping | Medium | Keep local asset imports; only migrate text data for Phase 4 |

## Open Questions (Resolved)

| Question | Decision |
|---|---|
| Storefront data source | Migrate to Prisma |
| Slice order | Checkout first (Slice 1), then storefront migration (Slice 2) |
| PSP scope | Paystack-only (Stripe deferred) |
| Cart approach | localStorage (no server-side cart API) |
| Backorder | Deferred to future phase |
