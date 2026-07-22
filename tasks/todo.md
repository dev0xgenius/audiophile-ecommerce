# Phase 4 — Build Checklist

**Legend:** `⬜` pending `🔄` in progress `✅` done `⏭️` skipped

## Slice 0: Schema & Foundation
- [ ] Task 0.1: DB Indexes
- [ ] Task 0.2: Fix Stock Service Bugs
- [ ] Task 0.3: Restore Product Fields (features, box)
- [ ] Task 0.4: Seed Product Data

### Checkpoint: Slice 0
- [ ] `npm run build` succeeds
- [ ] `prisma db push` succeeds
- [ ] Seed products exist in DB

## Slice 1: Payments & Storefront End-to-End
- [ ] Task 1.1: Email Service (Resend + templates)
- [ ] Task 1.2: PSP Routing Service + Transaction Log
- [ ] Task 1.3: Webhook Event Processing (charge.success/charge.failed)
- [ ] Task 1.4: Checkout API
- [ ] Task 1.5: Cart + Storefront Checkout Integration

### Checkpoint: Slice 1
- [ ] `npm run build` + `npm run lint` — 0 errors
- [ ] Guest can browse → add to cart → checkout → pay → see confirmation
- [ ] Order created in DB, stock reserved, email sent
- [ ] Paystack webhook processes success/failure correctly

## Slice 2: Storefront Prisma Migration
- [ ] Task 2.1: Category Page → fetch from Prisma
- [ ] Task 2.2: Product Detail Page → fetch from Prisma
- [ ] Task 2.3: Home Page → fetch from Prisma

### Checkpoint: Slice 2
- [ ] Storefront pages load real data from DB
- [ ] "Add to Cart" uses real variant IDs

## Slice 3: Operational Completeness
- [ ] Task 3.1: Staff & Role Management UI
- [ ] Task 3.2: Audit Log UI
- [ ] Task 3.3: Manual Order Creation

### Checkpoint: Slice 3
- [ ] Staff can be invited, activated, deactivated
- [ ] Roles and permissions manageable via UI
- [ ] Audit log page loads with real data

## Slice 4: Commerce Features
- [ ] Task 4.1: Bulk Operations (Products)
- [ ] Task 4.2: Refunds & Returns UI

### Checkpoint: Slice 4
- [ ] CSV import/export works
- [ ] Refund routed through Paystack
- [ ] Return management (approve/reject/restock)

## Slice 5: Polish
- [ ] Task 5.1: Accessibility Audit & Fixes
- [ ] Task 5.2: Performance & Edge Cases

### Checkpoint: Complete
- [ ] All acceptance criteria met
- [ ] End-to-end flow: storefront checkout → payment → order → email
- [ ] Dashboard fully functional for all modules
