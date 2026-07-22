# Phase 2 — Granular Implementation Plan

PRD v1.1 — Task breakdown with exact files, patterns, and edge cases.

---

## Track 0: Validation Schemas (prerequisite for all tracks)

### 0.1 — Variant schemas
**Files:** `lib/validations/product.ts` (append)
- `createVariantSchema`: productId (string), sku (string, max 100), name (string, max 200), priceDelta (number, default 0), stock (int, min 0, default 0), lowStockThreshold (int, min 0, default 5), weightDelta (number, optional), isActive (boolean, default true)
- `updateVariantSchema`: partial of create
- `variantQuerySchema`: page, pageSize, search, sortBy, sortOrder

### 0.2 — Stock adjust schema
**Files:** `lib/validations/stock.ts` (new)
- `stockAdjustSchema`: variantId (string), delta (int, nonzero), reason (enum: restock/sale/adjustment/return/damaged/correction), reasonDetail (string, optional, max 500)

### 0.3 — Fulfillment schemas
**Files:** `lib/validations/order.ts` (append)
- `createFulfillmentSchema`: items (array of {lineItemId, quantity}), trackingNumber (string, optional, max 200), carrier (string, optional, max 100)
- `createShipmentSchema`: shipmentId (string)

### 0.4 — Customer schemas
**Files:** `lib/validations/customer.ts` (new)
- `customerQuerySchema`: page, pageSize, search, sortBy, sortOrder
- `updateCustomerSchema`: notes (string, optional), flags (string[], optional — only "VIP" | "fraud-risk")
- `customerExportSchema`: no body params

### 0.5 — Media schemas
**Files:** `lib/validations/media.ts` (new)
- `mediaQuerySchema`: page, pageSize, search, tag, folder, dateFrom, dateTo, sortBy, sortOrder
- `updateMediaSchema`: altText (string, optional), tags (string[], optional), folder (string, optional)
- `mediaUploadSchema`: no body (multipart via formData)

### 0.6 — Webhook schemas
**Files:** `lib/validations/webhook.ts` (new)
- `webhookQuerySchema`: page, pageSize, status, provider, dateFrom, dateTo, sortBy, sortOrder
- `webhookRetrySchema`: id (string, from params)

---

## Track 1: Paystack PSP UI (independent)

### 1.1 — PSP connection form
**Files:** `components/dashboard/psp-form.tsx` (new)
- Dialog with: provider selector (currently Paystack only), secret key input (password type), label input, isDefault toggle, liveMode toggle, restrictedCurrencies multi-select, restrictedRegions multi-select
- On submit: `POST /api/psp/connections` with Zod-validated body
- Follow `product-form-dialog.tsx` pattern (react-hook-form + onSubmit async)

### 1.2 — PSP connections list page
**Files:** `app/dashboard/payments/page.tsx` (new)
- Fetch `GET /api/psp/connections`
- Display as glass cards: provider icon, label, status badge (enabled/disabled), default badge, live/sandbox badge
- "Add Connection" button opens PSP form dialog
- Each card has "Edit" and "Toggle Enable" actions
- Include `loading.tsx` and `error.tsx` siblings

### 1.3 — Update sidebar nav
**Files:** `components/app-sidebar.tsx`
- Change Customers URL: `"#"` → `"customers"`
- Change Payments URL: `"#"` → `"payments"`
- Change Gallery URL: `"#"` → `"gallery"`

---

## Track 2: Webhook Event Log (independent)

### 2.1 — GET /api/webhooks
**Files:** `app/api/webhooks/route.ts` (new)
- Paginated list with filters: status, provider, dateFrom, dateTo
- Permission: `"payments"`, `"view"`
- Returns: id, provider, eventType, pspEventId, status, errorMessage, createdAt, processedAt
- Order by createdAt desc

### 2.2 — POST /api/webhooks/[id]/retry
**Files:** `app/api/webhooks/[id]/retry/route.ts` (new)
- Look up webhook event by id
- Re-process by reading rawBody + headers, delegating to PSP adapter via factory
- Update status to "processed" on success or "failed" on error with errorMessage
- Permission: `"payments"`, `"edit"`

### 2.3 — Webhook events page
**Files:** `app/dashboard/payments/webhooks/page.tsx` (new)
- Table with columns: event type, provider, status (received/processed/failed/skipped with glow-dot style badges), date
- Filter toolbar: status dropdown, provider dropdown, date range picker
- Expandable row shows rawBody and headers as formatted JSON
- "Retry" button on failed rows → calls POST /api/webhooks/[id]/retry
- Include `loading.tsx` and `error.tsx` siblings

---

## Track 3: Product Variants (depends on 0.1)

### 3.1 — GET + POST /api/products/[id]/variants
**Files:** `app/api/products/[id]/variants/route.ts` (new)
- GET: list variants for a product, sorted by createdAt desc
  - Permission: `"products"`, `"view"`
  - Include: stock, priceDelta, isActive
- POST: create variant
  - Permission: `"products"`, `"create"`
  - Validate with `createVariantSchema`
  - Create AuditLogEntry (action: "variant.create", entityType: "ProductVariant")
  - Return created variant with 201

### 3.2 — PUT + DELETE /api/variants/[id]
**Files:** `app/api/variants/[id]/route.ts` (new)
- PUT: update variant with `updateVariantSchema`
  - Permission: `"products"`, `"edit"`
  - AuditLogEntry: "variant.update"
- DELETE: soft-delete (set isActive=false)
  - Permission: `"products"`, `"delete"`
  - AuditLogEntry: "variant.delete"
  - NOT a hard delete — preserves order line item references

### 3.3 — Variant management in product form
**Files:** `components/dashboard/product-form-dialog.tsx` (modify)
- Add "Variants" section below existing form fields (not a tab — keep it simple)
- Fetch existing variants from GET variants API when editing
- Display variant list: name, SKU, stock, price delta, isActive badge
- "Add Variant" button: expandable inline form (name, SKU, stock, priceDelta, lowStockThreshold)
- "Remove" button = set isActive=false (with confirmation dialog)
- Wire to variant API endpoints

### 3.4 — Per-variant stock in inventory table
**Files:** `components/dashboard/inventory-table.tsx` (modify)
- Currently shows product-level `stockQuantity`. Need to show variants.
- Add expandable row via `getRowCanExpand` + `renderSubComponent`
- Expanded row shows per-variant: name, SKU, stock badge, threshold, Adjust button
- The `Product` type changes from mock shape to API shape → update all references

### 3.5 — Variant detail dialog
**Files:** `components/dashboard/variant-detail-dialog.tsx` (new)
- Dialog showing: variant name, SKU, stock (with low-stock indicator), price delta, weight delta
- "Adjust Stock" button → opens inventory adjust dialog prefilled with this variant
- "View Ledger" button → opens stock ledger for this variant

---

## Track 4: Stock Ledger & Audit Trail (depends on Track 3)

### 4.1 — POST /api/stock/adjust
**Files:** `app/api/stock/adjust/route.ts` (new)
- Validate body with `stockAdjustSchema`
- Use `prisma.$transaction` to atomically:
  1. `findUnique` variant → get current stock
  2. Compute `beforeQuantity` (current), `afterQuantity` (current + delta)
  3. Reject if `afterQuantity < 0` → return 400 `{ error: "Insufficient stock", code: "INSUFFICIENT_STOCK" }`
  4. `update` variant stock to afterQuantity
  5. `create` StockLedgerEntry (beforeQuantity, afterQuantity, delta, reason, reasonDetail, actorId from session)
  6. `create` AuditLogEntry (action: "stock.adjust")
- Permission: `"inventory"`, `"edit"`

### 4.2 — GET /api/stock/ledger
**Files:** `app/api/stock/ledger/route.ts` (new)
- Query param: variantId (required)
- Paginated results sorted by timestamp desc
- Return: id, delta, reason, reasonDetail, beforeQuantity, afterQuantity, actor (name), timestamp
- Permission: `"inventory"`, `"view"`

### 4.3 — Reserved stock service
**Files:** `lib/services/stock.ts` (new)
- `reserveStock(orderId: string)`: Query OrderLineItems with variantId + quantity, decrement stock via `$transaction`, create StockLedgerEntries with reason="sale"
- `releaseStock(orderId: string)`: Reverse reservation — increment stock back, create StockLedgerEntries with reason="correction" and reasonDetail="Payment failed / Order cancelled"
- `adjustStock(variantId, delta, reason, reasonDetail, actorId)`: Shared helper used by 4.1

### 4.4 — Rewrite inventory adjust dialog
**Files:** `components/dashboard/inventory-adjust-dialog.tsx` (modify)
- Replace simple quantity input with:
  - Reason code selector (dropdown: Restock / Sale / Adjustment / Return / Damaged / Correction)
  - Delta input (integer, can be negative for reduction, positive for addition)
  - Reason detail textarea (optional)
  - Before/after preview showing current → new
- Call `POST /api/stock/adjust` on confirm
- Show toast on success, error on failure

### 4.5 — Stock ledger view component
**Files:** `components/dashboard/stock-ledger.tsx` (new)
- Table: date/time, delta (green for positive, red for negative with +/- prefix), before→after arrows (→), reason badge, reason detail tooltip, actor name
- Accepts `variantId` prop, fetches from `GET /api/stock/ledger`
- Paginated (10 per page)

### 4.6 — Rewrite inventory page to real API
**Files:** `app/dashboard/inventory/page.tsx` (modify)
- Replace `import { products as initialProducts } from "@/app/dashboard/_data/products"` with `fetch("/api/products?pageSize=100")`
- The API returns products with `variants[]` — map to a shape compatible with InventoryTable
- Remove mock data import — the old `_data/products.ts` will become unused

### 4.7 — Update LowStockAlert component
**Files:** `components/dashboard/low-stock-alert.tsx` (modify)
- Accept new API-shaped data (products with nested variants)
- Count low-stock/out-of-stock at variant level instead of product level
- Each product's variants array: check `stock <= lowStockThreshold` per variant
- Display: "X variants out of stock", "Y variants low on stock"

---

## Track 5: Order Fulfillment (depends on 4.3)

### 5.1 — POST /api/orders/[id]/fulfill
**Files:** `app/api/orders/[id]/fulfill/route.ts` (new)
- Validate body with `createFulfillmentSchema`
- Check order status is "paid" or "processing" (reject otherwise with INVALID_TRANSITION)
- Create `Shipment` record, then `ShipmentItem` records for each line item
- If all items in order are fulfilled, auto-transition order to "processing" (if "paid") via order status history
- Permission: `"orders"`, `"edit"`

### 5.2 — POST /api/orders/[id]/ship
**Files:** `app/api/orders/[id]/ship/route.ts` (new)
- Validate body with `createShipmentSchema`
- Update shipment: set `shippedAt` to now
- Check if all shipments for this order are shipped → transition order to "shipped"
- Create OrderStatusHistory entry
- Permission: `"orders"`, `"edit"`

### 5.3 — Fulfillment panel component
**Files:** `components/dashboard/fulfillment-panel.tsx` (new)
- Shown inside order detail dialog (or as standalone)
- Shows unfulfilled line items with checkboxes, quantity inputs
- "Create Shipment" button with tracking number + carrier inputs
- After creation, shows existing shipments with "Mark Shipped" action
- Wires to fulfill + ship APIs

### 5.4 — Shipment history in order detail
**Files:** `components/dashboard/order-detail-dialog.tsx` (modify)
- Extend `OrderDetail` type to include `shipments[]`
- Add "Shipments" section in the dialog: each shipment card shows tracking #, carrier, shippedAt status, items
- If unshipped shipments exist, show "Mark Shipped" button inline

---

## Track 6: Customers (independent after 0.4)

### 6.1 — GET /api/customers
**Files:** `app/api/customers/route.ts` (new)
- Paginated list with search (name, email ILIKE)
- Returns: id, name, email, phone, flags, orderCount (aggregate), totalSpent (aggregate), createdAt
- Permission: `"customers"`, `"view"`
- Order by createdAt desc default

### 6.2 — GET /api/customers/[id]
**Files:** `app/api/customers/[id]/route.ts` (new)
- Full profile: customer info, addresses, last 20 orders (id, status, total, createdAt), lifetime value (sum of order totals), customer notes with author name
- Permission: `"customers"`, `"view"`

### 6.3 — PUT /api/customers/[id]
**Files:** `app/api/customers/[id]/route.ts` (new, same file as 6.2)
- Only update internal fields: notes (string), flags (string[] — "VIP" | "fraud-risk")
- Reject if body contains name/email/phone changes → return 400 `{ error: "Cannot edit customer contact fields", code: "READONLY_FIELD" }`
- Permission: `"customers"`, `"edit"`

### 6.4 — DELETE /api/customers/[id]
**Files:** `app/api/customers/[id]/route.ts` (new, same file)
- GDPR anonymization: set name=null, email=null, phone=null, set flags to ["anonymized"]
- DO NOT delete order records — they remain with customerId referencing the anonymized record
- Permission: `"customers"`, `"delete"`

### 6.5 — GET /api/customers/[id]/export
**Files:** `app/api/customers/[id]/export/route.ts` (new)
- Returns full customer data as JSON download
- Includes: profile, all addresses, all orders (with items), payments, notes
- Sets `Content-Disposition: attachment; filename="customer-{id}.json"`
- Permission: `"customers"`, `"view"`

### 6.6 — Customers list page + table
**Files:** `app/dashboard/customers/page.tsx` + `components/dashboard/customer-table.tsx` (new)
- TanStack table: name, email, orders count, total spent, flags (badges), createdAt
- Click row → opens customer profile dialog
- Search bar (name/email), pagination
- Follow `product-table.tsx` pattern exactly

### 6.7 — Customer profile dialog
**Files:** `components/dashboard/customer-profile-dialog.tsx` (new)
- Tabs: Overview | Orders | Notes
- Overview: customer info card (name, email, phone, since date), address list, flags with toggle buttons (VIP/fraud-risk), LTV display
- Orders: last 20 orders table with status, total, date. Click → opens order detail dialog
- Notes: note list with author + timestamp, "Add Note" textarea
- Actions: "Export Data" (downloads JSON), "Anonymize" (with confirmation "This cannot be undone")
- Follow `order-detail-dialog.tsx` pattern

### 6.8 — Loading + error states
**Files:** `app/dashboard/customers/loading.tsx`, `app/dashboard/customers/error.tsx` (new)
- Skeleton: table row placeholders
- Error: message + retry button

---

## Track 7: Media Gallery (independent — largest)

### 7.1 — S3/R2 storage client
**Files:** `lib/storage/s3.ts` (new)
- `createS3Client()` → returns S3Client instance, reads from env vars: `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`
- `uploadFile(buffer, key, mimeType)` → puts object, returns `{ url, key }`
- `deleteFile(key)` → deletes object
- `getSignedUrl(key, expiresIn)` → presigned GET URL (optional, for private buckets)
- Throw clear errors if env vars missing

### 7.2 — Image derivative pipeline
**Files:** `lib/storage/image-processor.ts` (new)
- `processImage(buffer, mimeType, uploadFn)`:
  - Non-image → upload original, return `{ width:0, height:0, variants: null, type: "raw" }`
  - Image → get metadata, then:
    - For each of 4 sizes (thumbnail 150px, medium 600px, desktop 1200px, original full):
      - Generate 2 buffers: one WebP (`sharp(...).webp({ quality: 80 })`), one original format (`.jpeg()`/`.png()` as appropriate)
      - Upload both via `uploadFn` with suffixed keys: `{key}__{suffix}.webp` and `{key}__{suffix}.{ext}`
    - Skip resize if variant width >= original width (keep original dimensions)
  - Return: `{ width, height, variants: { thumbnail: { webp, original }, medium: { webp, original }, desktop: { webp, original }, original: { webp, original } }, type: "image" }`
- Use `Promise.all` for parallel uploads
- All-or-nothing: if any upload fails, attempt to delete already-uploaded variants, then throw

### 7.3 — POST /api/media/upload
**Files:** `app/api/media/upload/route.ts` (new)
- Accept `multipart/form-data` with field `file`
- Read file buffer + original filename + mime type
- Generate a unique key: `uploads/{uuid}-{sanitized-filename}`
- Upload to S3 via `s3.ts`
- Process via `image-processor.ts` if image
- Create `MediaAsset` record: url (original S3 URL), filename, mimeType, sizeBytes, variants (JSON), width, height, uploadedById (from session), tags[], folder (optional from form)
- Permission: `"gallery"`, `"create"`
- Return created MediaAsset with 201

### 7.4 — GET /api/media
**Files:** `app/api/media/route.ts` (new)
- Paginated list with filters: tag (has some), folder, dateFrom, dateTo, search (filename contains)
- Returns: id, url, filename, mimeType, sizeBytes, variants, altText, tags, folder, width, height, uploadedBy (name), createdAt
- Permission: `"gallery"`, `"view"`

### 7.5 — PUT + DELETE /api/media/[id]
**Files:** `app/api/media/[id]/route.ts` (new)
- PUT: update altText, tags, folder via `updateMediaSchema`. Permission: `"gallery"`, `"edit"`
- DELETE: check `ProductMedia` table for any rows referencing this asset. If found → return 409 `{ error: "Asset is linked to products", code: "IN_USE", references: [...] }`. If not in use → delete from S3 (all variants) + delete MediaAsset record. Permission: `"gallery"`, `"delete"`

### 7.6 — Media gallery page + component
**Files:** `app/dashboard/gallery/page.tsx` + `components/dashboard/media-gallery.tsx` (new)
- Grid view (CSS grid, 4-6 columns depending on container width) of media thumbnails
- Drag-and-drop upload zone at top (native HTML5, no library needed)
- Click to select, multi-select with shift-click
- Search bar + tag filter + folder filter
- Selected asset toolbar (appears when ≥1 selected): "Edit" (alt-text dialog), "Delete" (with confirmation, shows "In use" warning if applicable), "Download"
- Empty state: "No media yet. Upload your first image."
- Include `loading.tsx` and `error.tsx` siblings

### 7.7 — Image picker for product form
**Files:** `components/dashboard/image-picker.tsx` (new)
- Dialog modal showing gallery grid (reuses media-gallery grid styling)
- Single-select (or multi-select via prop)
- "Upload new" button opens upload flow inline
- On confirm, returns selected MediaAsset IDs via callback
- Used in product-form-dialog for attaching images

### 7.8 — Loading + error states
**Files:** `app/dashboard/gallery/loading.tsx`, `app/dashboard/gallery/error.tsx` (new)
- Loading: grid skeleton of 12 placeholder squares with pulse animation
- Error: icon + message + retry

---

## Track 8: Sidebar & Integration (do last)

### 8.1 — Sidebar URLs
**Files:** `components/app-sidebar.tsx` (verify)
- Customers: `"customers"` ✅
- Payments: `"payments"` ✅
- Gallery: `"gallery"` ✅

### 8.2 — Payment sub-navigation layout
**Files:** `app/dashboard/payments/layout.tsx` (new, if needed)
- If payments has both connections and webhooks pages, add sub-navigation tabs: "Connections" | "Webhooks"
- Use shadcn Tabs component

### 8.3 — End-to-end smoke test
- Navigate through all new pages
- Create a variant → verify inventory shows it
- Adjust stock → verify ledger entry appears
- Fulfill order → verify shipment created
- List customers → verify order counts show
- Upload image → verify thumbnail appears in gallery
- All links in sidebar work

---

## Dependency Graph

```
0.x (schemas) ──┬── 1.x (PSP UI)
                ├── 2.x (webhooks)
                ├── 3.x (variants) ──┬── 4.x (stock ledger)
                │                     │
                │                     └── 5.x (fulfillment)
                ├── 6.x (customers)
                └── 7.x (media gallery)

8.x (integration) ← do last
```

## Edge Case Reference

| Scenario | Handling |
|---|---|
| Variant stock adjust to negative | Reject with 400 INSUFFICIENT_STOCK |
| Race condition on stock | `$transaction` with serializable isolation |
| Media asset in use before delete | Return 409 with references list |
| Fulfill past available quantity | Reject — don't allow exceeding line item qty |
| Customer anonymization | Null PII fields, keep order records intact |
| Non-image upload | Store single file, variants=null |
| S3 env vars missing | Clear error at upload time, not at import |
| Image < target resize width | Skip resize, keep original dimensions |
| Alpha channel PNG | `sharp` preserves alpha in WebP automatically |
