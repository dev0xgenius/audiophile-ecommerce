# Phase 3 — Granular Implementation Plan

PRD v1.1 — Task breakdown with exact files, patterns, and edge cases.

---

## Dependency Graph

```
0.x (schemas) ──┬── 1.x (Analytics API)
                 ├── 2.x (Bundles)
                 ├── 3.x (Suppliers)
                 └── 4.x (Export)
```

---

## Track 0: Validation Schemas (prerequisite for all tracks)

### 0.1 — Bundle schemas
**Files:** `lib/validations/bundle.ts` (new)
- `createBundleSchema`: productId (string), componentVariantId (string), quantity (int, min 1), decrementComponentStock (boolean, default true)
- `updateBundleSchema`: partial of create
- `bundleQuerySchema`: page, pageSize, sortBy, sortOrder

### 0.2 — Supplier schemas
**Files:** `lib/validations/supplier.ts` (new)
- `createSupplierSchema`: name (string, 1-200), contactName (string, optional, max 100), email (email, optional), phone (string, optional, max 30), leadTimeDays (int, optional, min 0), notes (string, optional)
- `updateSupplierSchema`: partial of create
- `supplierQuerySchema`: page, pageSize, search, sortBy, sortOrder

### 0.3 — Analytics schemas
**Files:** `lib/validations/analytics.ts` (new)
- `dateRangeSchema`: period (enum: today, 7d, 30d, custom), dateFrom (string, optional), dateTo (string, optional)
- `topProductsQuerySchema`: period, dateFrom, dateTo, limit (int, default 10)

### 0.4 — Export schemas
**Files:** `lib/validations/order.ts` (append)
- `orderExportSchema`: format (enum: csv / pdf-invoice / pdf-packing-slip)

---

## Track 1: Analytics with Real Data

### 1.1 — GET /api/dashboard/revenue
**Files:** `app/api/dashboard/revenue/route.ts` (new)
- Accept query params: period (today/7d/30d/custom), dateFrom, dateTo
- Query orders grouped by day: sum of total for completed orders (status ≠ cancelled/refunded)
- Return daily revenue array: `{ date: string, revenue: number }[]`
- For period comparison: also return `previousPeriod` data (same length shifted back)
- Permission: `"orders"`, `"view"`

### 1.2 — GET /api/dashboard/top-products
**Files:** `app/api/dashboard/top-products/route.ts` (new)
- Accept query params: period, dateFrom, dateTo, limit (default 10)
- Query OrderLineItems grouped by variant → product, sum quantities
- Return: `{ productId, productName, variantName, quantitySold, revenue }[]`
- Also return top categories: `{ categoryId, categoryName, quantitySold, revenue }[]`
- Permission: `"orders"`, `"view"`

### 1.3 — Wire ChartAreaInteractive to real API
**Files:** `components/chart-area-interactive.tsx` (modify)
- Remove hardcoded chartData array
- Fetch from `GET /api/dashboard/revenue?period={timeRange}` on mount and when timeRange changes
- Map response to the `{ date, revenue }` shape consumed by recharts
- Keep existing time range toggle (7d/30d/90d)
- Add period-over-period comparison: show previous period as "mobile" series
- Loading skeleton while fetching

### 1.4 — Wire SectionCards to support period comparison
**Files:** `components/section-cards.tsx` (modify)
- Add optional `revenueChange` prop (e.g., "+12.5%") to show period-over-period comparison badge
- Update stat-card to display change indicator

### 1.5 — Top products widget
**Files:** `components/dashboard/top-products.tsx` (new)
- Client component fetching from `GET /api/dashboard/top-products`
- Display top 10 products as a ranked list with quantity sold and revenue
- Categories section below products
- Loading skeleton when fetching
- Empty state if no data

### 1.6 — Wire top products into dashboard page
**Files:** `app/dashboard/page.tsx` (modify)
- Import and render `<TopProducts>` in the dashboard layout
- Place below the chart section

---

## Track 2: Bundles/Kits

### 2.1 — GET + POST /api/bundles
**Files:** `app/api/bundles/route.ts` (new)
- GET: paginated list, include product name + component variant SKU/name
  - Permission: `"products"`, `"view"`
- POST: create bundle record with `createBundleSchema`
  - Permission: `"products"`, `"create"`
  - AuditLogEntry: "bundle.create"

### 2.2 — PUT /api/bundles/[id]
**Files:** `app/api/bundles/[id]/route.ts` (new)
- PUT: update bundle with `updateBundleSchema`
  - Permission: `"products"`, `"edit"`
  - AuditLogEntry: "bundle.update"
- DELETE: hard delete bundle record (it's a join table, safe to delete)
  - Permission: `"products"`, `"delete"`

### 2.3 — Bundle management UI
**Files:** `components/dashboard/bundle-form-dialog.tsx` (new)
- Dialog with: product selector (search + dropdown), component variant selector, quantity input, toggle for decrementComponentStock
- Shows existing bundles in a table below the form
- Follow `product-form-dialog.tsx` pattern (react-hook-form)
- Wire to bundle API endpoints

### 2.4 — Bundles page
**Files:** `app/dashboard/bundles/page.tsx` (new)
- Fetches bundles, displays in a table
- Uses bundle-form-dialog for create/edit
- Include `loading.tsx` and `error.tsx` siblings

### 2.5 — Sidebar nav
**Files:** `components/app-sidebar.tsx` (modify)
- Add "Bundles" nav item under Products section with `IconGift` or `IconPackage`

---

## Track 3: Suppliers

### 3.1 — GET + POST /api/suppliers
**Files:** `app/api/suppliers/route.ts` (new)
- GET: paginated list with search (name, email, contactName)
  - Permission: `"products"`, `"view"`
  - Include product count
- POST: create supplier with `createSupplierSchema`
  - Permission: `"products"`, `"create"`
  - AuditLogEntry: "supplier.create"

### 3.2 — PUT /api/suppliers/[id]
**Files:** `app/api/suppliers/[id]/route.ts` (new)
- PUT: update supplier with `updateSupplierSchema`
  - Permission: `"products"`, `"edit"`
  - AuditLogEntry: "supplier.update"

### 3.3 — Suppliers page
**Files:** `app/dashboard/suppliers/page.tsx` (new) + `components/dashboard/supplier-table.tsx` (new)
- TanStack table: name, contact, email, phone, lead time, product count, createdAt
- "Add Supplier" button opens form dialog
- Click row to edit (opens same dialog prefilled)
- Follow `customer-table.tsx` pattern

### 3.4 — Supplier form dialog
**Files:** `components/dashboard/supplier-form-dialog.tsx` (new)
- Fields: name (required), contactName, email, phone, leadTimeDays, notes
- react-hook-form with zod validation

### 3.5 — Sidebar nav
**Files:** `components/app-sidebar.tsx` (modify)
- Add "Suppliers" nav item under Products section

---

## Track 4: Order Export

### 4.1 — Install PDF library
- Install `jspdf` + `@types/jspdf` (lightweight, no server-side rendering needed)
- Install `jspdf-autotable` for table generation in PDFs

### 4.2 — GET /api/orders/export
**Files:** `app/api/orders/export/route.ts` (new)
- Query params: format (csv | pdf-invoice | pdf-packing-slip), plus existing order filters
- CSV: stream CSV with headers (order id, customer, status, total, items, etc.)
- PDF: generate invoice PDF via jspdf
- Permission: `"orders"`, `"view"`

### 4.3 - GET /api/orders/[id]/invoice
**Files:** `app/api/orders/[id]/invoice/route.ts` (new)
- Fetch order with items, customer, payments
- Generate PDF invoice with: company header, customer info, line items table, totals
- Return PDF with `Content-Type: application/pdf`

### 4.4 — GET /api/orders/[id]/packing-slip
**Files:** `app/api/orders/[id]/packing-slip/route.ts` (new)
- Similar to invoice but simpler: just items list with quantities, no prices
- Include shipping address, order number, barcode placeholder
- Return PDF

### 4.5 — Export button on orders page
**Files:** `components/dashboard/order-table.tsx` (modify)
- Add "Export" dropdown button in toolbar
- Options: "CSV (filtered)", "CSV (all)"
- Triggers download via window.open or fetch + blob

---

## Edge Case Reference

| Scenario | Handling |
|---|---|
| Analytics: no orders in period | Return empty arrays, chart shows "No data" message |
| Analytics: period comparison with prior period having no data | previousPeriod returns empty array, comparison badge shows "—" |
| Bundles: product has no variants | Show "No variants available" in component selector |
| Bundles: duplicate product+variant combo | Prisma unique constraint → return 409 with clear error |
| Suppliers: product count in list | Aggregate count from Product model, include in list response |
| Export: no orders match filters | Return empty CSV with headers only, or 404 for invoice |
| PDF: very long address lines | Truncate/jspdf auto-wrap with cell width constraint |
| PDF: missing customer name/address | Show "N/A" placeholders, don't crash |
| Chart: API fails/returns error | Show inline error state with retry |

---

## Implementation Order (Suggested)

```
0.1 Bundle schema + 0.2 Supplier schema + 0.3 Analytics schema + 0.4 Export schema
  │
  ├── 1.1 Revenue API → 1.3 Wire chart → 1.5 Top products widget → 1.6 Dashboard
  │
  ├── 2.1 Bundle API → 2.3 Bundle UI → 2.4 Bundle page → 2.5 Sidebar
  │
  ├── 3.1 Supplier API → 3.3 Supplier page → 3.5 Sidebar
  │
  └── 4.2 Export API → 4.5 Export button
```
