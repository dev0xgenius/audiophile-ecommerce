# Product Requirements Document: Audio Equipment Store — Admin Dashboard

**Status:** Updated Draft v1.1
**Owner:** TBD
**Last updated:** 2026-07-17

---

## 1. Overview

### 1.1 Purpose
This document defines the requirements for an internal admin dashboard that allows a store owner (and their staff) to manage all backend operations for an ecommerce store selling audio equipment (headphones, speakers, amplifiers, DACs, cables, studio monitors, microphones, etc.). The dashboard is the operational control center — it is not the customer-facing storefront.

### 1.2 Problem Statement
Running an audio equipment store involves managing SKUs with many variants (color, connector type, wattage, bundle configurations), fulfilling orders across multiple carriers, reconciling payments across one or more payment service providers (PSPs), controlling staff access, and maintaining a large, high-quality product image library. Without a unified dashboard, the owner is forced to juggle spreadsheets, PSP dashboards, and ad-hoc scripts, leading to stock errors, delayed order fulfillment, and inconsistent product presentation.

### 1.3 Goals
- Provide a single pane of glass for inventory, orders, users, payments, and media.
- Reduce time spent on manual reconciliation (stock counts, payment status, order status) by providing real-time, accurate data.
- Support role-based access so the owner can safely delegate tasks (e.g., a warehouse staff member fulfilling orders without seeing financial data).
- Be extensible enough to plug in additional PSPs, shipping carriers, or sales channels later without a rebuild.
- Deliver a premium, modern, dark-mode first design using high-fidelity glassmorphic cards, tables, menus, and subtle animations that align with a high-end audio hardware brand.

### 1.4 Non-Goals
- This PRD does not cover the customer-facing storefront (product browsing, cart, checkout UI) — only the admin/back-office system. The storefront and dashboard are tightly coupled within the same Next.js application, sharing the same database and API routes.
- No POS (in-person retail) functionality in v1.
- No multi-tenant/marketplace support (single store, single business entity) in v1.
- No headless/separate backend API — all routes live in the Next.js app and serve both dashboard and storefront consumers.

---

## 2. Target Users & Personas

| Persona | Role | Primary Needs |
|---|---|---|
| **Store Owner / Admin** | Full access | Full visibility: revenue, orders, inventory, payment reconciliation, user/staff management, PSP configuration |
| **Inventory Manager** | Manages stock | Add/edit products, adjust stock levels, manage suppliers, low-stock alerts |
| **Order Fulfillment Staff** | Warehouse/shipping | View and update order status, print packing slips/labels, manage returns |
| **Customer Support Agent** | Support | View order/customer details (read-mostly), issue refunds within limits, add order notes |
| **Marketing/Content Editor** | Content | Manage the image gallery, product descriptions, banners/collections |

### 2.1 Access Model
Role-Based Access Control (RBAC) with at minimum these roles: `Owner/SuperAdmin`, `Admin`, `Inventory Manager`, `Fulfillment Staff`, `Support Agent`, `Content Editor`. Permissions should be granular (per-module: view/create/edit/delete) so custom roles can be composed later.

---

## 3. Scope Summary

| Module | In Scope (v1) |
|---|---|
| Inventory Management | ✅ |
| Order Management | ✅ |
| User & Role Management | ✅ |
| Payment Service Provider (PSP) Management | ✅ |
| Store Image Gallery | ✅ |
| Dashboard/Analytics Overview | ✅ |
| Authentication & Security | ✅ |
| Customer-facing storefront | ❌ (separate system) |
| POS / in-person sales | ❌ (future) |
| Multi-store / multi-tenant | ❌ (future) |
| Marketing automation (email campaigns) | ❌ (future) |

---

## 4. Functional Requirements

### 4.1 Dashboard / Analytics Overview (Home)
The landing page after login. Provides an at-a-glance operational summary.

- **FR-4.1.1**: Display key metrics for a selectable date range (today, 7d, 30d, custom): total revenue, order count, average order value, new customers, refund amount.
- **FR-4.1.2**: Revenue and order trend charts (line/bar), with comparison to the previous period.
- **FR-4.1.3**: "Needs attention" widget: low-stock items, orders stuck in "pending/failed payment" state, unfulfilled orders older than X days, failed PSP webhook events.
- **FR-4.1.4**: Top-selling products and top categories (e.g., headphones vs. amplifiers) for the selected period.
- **FR-4.1.5**: Quick links to create a product, view latest orders, and view latest support flags.

### 4.2 Inventory Management

#### 4.2.1 Products
- **FR-4.2.1**: CRUD for products with fields: name, SKU, brand, category/subcategory (e.g., Headphones > Over-Ear), description (rich text), specifications (structured key-value — e.g., impedance, frequency response, driver size, wattage, connector type), base price, cost price (for margin calc), tax class, weight/dimensions (for shipping), status (draft/active/archived).
- **FR-4.2.2**: Support **product variants** (e.g., color, cable length, bundle: "with case" / "without case"), each with its own SKU, price delta, stock, and images.
- **FR-4.2.3**: Support **bundles/kits** (e.g., "Studio Starter Pack" combining mic + audio interface + headphones) that are composed of other products and can optionally decrement component stock.
- **FR-4.2.4**: Bulk operations: bulk price update, bulk status change, bulk category reassignment, CSV import/export of the product catalog.
- **FR-4.2.5**: Category/collection management (create, nest, reorder, assign products).
- **FR-4.2.6**: Supplier/vendor records (name, contact, lead time) linkable to products for reorder purposes.

#### 4.2.2 Stock & Warehousing
- **FR-4.2.7**: Real-time stock level tracking per SKU/variant, optionally per warehouse/location if multi-location is enabled.
- **FR-4.2.8**: Manual stock adjustment with required reason code (received shipment, damaged, correction, returned-to-stock) and an audit trail of who changed what and when.
- **FR-4.2.9**: Low-stock threshold per product with configurable alerting (dashboard badge + optional email).
- **FR-4.2.10**: Reserved stock handling — stock is reserved when an order is placed and payment is pending, and released if payment fails/expires or the order is cancelled.
- **FR-4.2.11**: Stock movement history/ledger per SKU (sale, restock, adjustment, return) for auditability.
- **FR-4.2.12**: Backorder / preorder support (allow sale when stock is 0, with a defined expected-restock date shown to customer).

### 4.3 Order Management

- **FR-4.3.1**: Order list view with filters (status, date range, payment status, PSP used, fulfillment status, customer) and search (order ID, customer name/email, tracking number).
- **FR-4.3.2**: Order detail view: line items, pricing breakdown (subtotal, shipping, tax, discount, total), customer/shipping/billing info, payment transaction reference, internal notes/timeline, status history.
- **FR-4.3.3**: Order status lifecycle, e.g.: `Pending Payment` → `Paid` → `Processing` → `Shipped` → `Delivered` / `Cancelled` / `Refunded` / `Partially Refunded`. Status transitions should be explicit and logged (who/when).
- **FR-4.3.4**: Fulfillment actions: mark items as packed, generate/attach shipping label (carrier integration or manual tracking number entry), mark as shipped (triggers customer notification), partial shipment support (split an order across multiple shipments).
- **FR-4.3.5**: Returns & Refunds: initiate full/partial refund (routed through the correct PSP used for the original payment), restock returned items (optional), refund reason tracking.
- **FR-4.3.6**: Manual order creation/editing by staff (phone orders, adjustments) with an audit trail distinguishing staff-created vs. customer-placed orders.
- **FR-4.3.7**: Order export (CSV/PDF invoice and packing slip generation).
- **FR-4.3.8**: Automated customer email/notification triggers on status change (order confirmed, shipped, delivered, refunded) — configurable templates.

### 4.4 User & Role Management

#### 4.4.1 Staff/Admin Users
- **FR-4.4.1**: CRUD for internal dashboard users (staff), each assigned one or more roles.
- **FR-4.4.2**: Role & permission management screen — define custom roles from granular permissions (per module: view/create/edit/delete/export).
- **FR-4.4.3**: Staff activity/audit log: login history, key actions taken (price changes, refunds issued, stock adjustments, role changes).
- **FR-4.4.4**: Invite flow (email invite with expiring link) and deactivation/suspension of staff accounts without deleting their historical audit records.

#### 4.4.2 Customers
- **FR-4.4.5**: Customer list/search with profile view: contact info, order history, lifetime value, addresses, notes flagged by support.
- **FR-4.4.6**: Ability to manually adjust a customer record (merge duplicate accounts, add internal notes, flag as VIP/fraud-risk) — not to edit customer-authored content like reviews.
- **FR-4.4.7**: GDPR/privacy-oriented actions: export customer data, anonymize/delete customer data on request, respecting order-record retention requirements.

### 4.5 Payment Service Provider (PSP) Management

- **FR-4.5.1**: Support connecting multiple PSPs (e.g., Stripe, PayPal, Paystack, Flutterwave, local/regional providers) via API key/OAuth credentials, stored encrypted.
- **FR-4.5.2**: Enable/disable a PSP per store, set a default/priority order, and optionally restrict PSPs by currency or customer region.
- **FR-4.5.3**: Transaction log view: list of payment attempts/transactions per PSP with status (succeeded, failed, pending, disputed/chargeback), amount, currency, linked order.
- **FR-4.5.4**: Webhook handling and a webhook event log (for debugging failed/duplicate events), with manual "retry/reconcile" action for stuck webhook events.
- **FR-4.5.5**: Refund initiation routed to the correct PSP API, with refund status tracked back to the order.
- **FR-4.5.6**: Payout/settlement visibility — surface PSP payout schedule/summary if the PSP API supports it (informational, not a full accounting system).
- **FR-4.5.7**: Dispute/chargeback tracking with status and linked order/customer for follow-up.
- **FR-4.5.8**: PCI-conscious design: the dashboard never stores raw card data; all card handling is delegated to the PSP (tokenization/hosted fields/redirect flows).

### 4.6 Store Image Gallery Management

- **FR-4.6.1**: Central media library for all store images (product photos, lifestyle/marketing images, banners, category images), independent of any single product so images can be reused.
- **FR-4.6.2**: Upload (drag-and-drop, multi-file), with automatic generation of responsive image sizes/thumbnails and format optimization (e.g., WebP/AVIF derivatives).
- **FR-4.6.3**: Organize via folders/tags/albums (e.g., "Headphones – Model X", "Homepage Banners") and search/filter by tag, product association, or upload date.
- **FR-4.6.4**: Attach one or more images to a product/variant, define display order, and mark a primary/cover image.
- **FR-4.6.5**: Basic in-browser editing: crop, rotate, alt-text/SEO metadata entry (important for accessibility and search).
- **FR-4.6.6**: Storage via object storage (e.g., S3-compatible/Cloudflare R2) with CDN delivery; the dashboard shows storage usage and allows deletion with a check for "used in active product" before hard delete (soft-delete/orphan protection).
- **FR-4.6.7**: Bulk actions: bulk tag, bulk delete, bulk download.

---

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Dashboard pages should load key data within 2s under normal load; paginated/virtualized tables for large order/product lists. |
| **Availability** | Target 99.5%+ uptime for the admin backend (customer storefront checkout availability is even more critical and should be architected separately/decoupled). |
| **Security** | Auth via BetterAuth with Prisma adapter and email/password authentication; RBAC enforced server-side (not just UI hiding); all PSP credentials encrypted at rest; audit logs immutable; MFA optional (v1+); session timeout configurable. |
| **Data Integrity** | Stock and payment state changes must be transactional/idempotent (avoid double-decrement on webhook retries, avoid overselling). |
| **Compliance** | PCI DSS scope minimized by delegating card handling to PSPs; GDPR/CCPA-aware customer data handling. |
| **Scalability** | Should handle <500 SKUs and <200 orders/month at launch without issues; architecture remains clean and extensible (PSPs, carriers, warehouse locations) without over-engineering for v1 scale. |
| **Auditability** | Every mutating action on stock, price, orders, refunds, and user roles is logged with actor, timestamp, before/after values. |
| **Accessibility** | Accessible dark theme with AA-compliant text contrast on all interactive and information-bearing elements (keyboard nav, alt text on images, screen-reader readable tables). Decorative glassmorphism elements are supplementary and not relied upon for information conveyance. |
| **Internationalization** | Multi-currency display support at minimum (even if store initially sells in one currency), since audio gear stores often have international customers. |

---

## 6. User Interface & Theme System (Design & Aesthetics)

To reflect a premium, state-of-the-art brand aesthetic matching high-end audio gear, the dashboard implements a modern dark-mode first design system. Ad-hoc styling is avoided in favor of the tokens defined below.

### 6.1 Theme Palette & Visual Layering
- **Core Theme (Dark-mode first)**: The visual frame uses a multi-layered, low-contrast gradient backdrop rather than solid black.
  - **Background Gradient**: Composed of radial gradients overlaid on a dark base:
    - Primary accent glow: `rgba(216, 125, 74, 0.06)` radial ellipse top-center.
    - Hover glow accent: `rgba(251, 175, 133, 0.04)` radial ellipse top-right.
    - Dark linear gradient: `linear-gradient(180deg, #0a0a0a 0%, #101010 50%, #0d0d0d 100%)`.
- **Primary / Accent Color**: `#D87D4A` (orange accent), representing the premium copper and warm wood tones of luxury audio hardware. Hover states transition to `#FBAF85` (light orange).

### 6.2 Glassmorphic Elements (Matte Glass)
Data density is displayed using glass container styles to prevent visual fatigue and create a unified layering depth.
- **Glass Cards (`.glass-card`)**:
  - Background: `rgba(255, 255, 255, 0.05)`
  - Backdrop Blur: `blur(12px)`
  - Borders: `1px solid rgba(255, 255, 255, 0.08)`
  - Shadow: Subtle shadow offset `rgba(0, 0, 0, 0.06)`
- **Glass Tables (`.glass-table`)**:
  - Background: `rgba(255, 255, 255, 0.03)`
  - Backdrop Blur: `blur(8px)`
  - Borders: `1px solid rgba(255, 255, 255, 0.05)`
  - Border-radius: `0.75rem` (12px)
- **Glass Sidebar & Header**:
  - Sidebar: Frosted dark backdrop `rgba(16, 16, 16, 0.97)` to keep navigation distinct.
  - Header: Frosted blur `rgba(16, 16, 16, 0.75)` with a backdrop blur of `20px` and a bottom border `1px solid rgba(255, 255, 255, 0.06)`.

### 6.3 Luminous Accent Lines & Glow Cues
- **Card Accents (`.card-accent`)**: Cards highlight their upper border with a glowing linear gradient (`linear-gradient(90deg, rgba(216, 125, 74, 0.5), rgba(251, 175, 133, 0.2))`) to guide user eyes across distinct cards.
- **Glow Dots (`.glow-dot`)**: Standard status badges are augmented or replaced with high-contrast glowing indicators for real-time states (e.g. green for active, amber for warning/low-stock, red for failed webhook or out-of-stock) styled with a `box-shadow` spread of `6px` to represent active signals.
- **Gradient Typography**: Key performance numbers and page titles utilize text gradients (`.gradient-text`) blending `#D87D4A` and `#FBAF85`.

### 6.4 Micro-Animations & Transitions
- Cards, table rows, and button interactions must use transition classes (`transition: all 0.2s ease` on hover/active states) to animate border color opacity, card brightness overlays, and depth shadows.
- Interactive charts (e.g. `recharts` area models) use dual vertical gradients for area fills (`fillDesktop` / `fillMobile`) blending from `1.0`/`0.8` opacity to `0.1` opacity to reflect visual audio frequency wave patterns.

### 6.5 Container Queries (Context-Aware Layouts)
Components must adapt to the size of their immediate layout grid container rather than only reacting to the overall viewport width:
- **Stat Cards**: Render compactly or expand details depending on container width (using classes like `@[250px]/card`).
- **Interactive Charts**: Toggle control interfaces (e.g., between Select dropdowns and Toggle groups) dynamically based on container query thresholds (e.g., `@[767px]/card`).

---

## 7. Suggested Data Model (High-Level)

Core entities and key relationships (not exhaustive — for alignment, not final schema):

### Auth & Access
- `User` (staff) — NextAuth-compatible fields (id, name, email, emailVerified, image, hashedPassword) — `Role[]` — `Permission[]`
- `Account` / `Session` / `VerificationToken` — NextAuth Prisma adapter tables (for session management, OAuth support)
- `Role` — name, description, guard name
- `Permission` — resource (module), action (view/create/edit/delete/export)
- `RolePermission` — many-to-many join
- `UserRole` — many-to-many join
- `AuditLogEntry` (actor_id, action, entity_type, entity_id, before [JSON], after [JSON], ip_address, timestamp)

### Customers
- `Customer` — name, email, phone, notes (internal), flags (VIP, fraud-risk), createdAt
- `Address` — customer_id, type (billing/shipping), line1/2, city, state, postal_code, country, is_default
- `CustomerNote` — customer_id, author_id (staff), note, createdAt

### Catalog
- `Category` — name, slug, description, parent_id (self-referencing), sort_order, image_url
- `Product` — name, slug, SKU (parent), brand, description (rich text), specifications (JSON: structured key-value), base_price, cost_price, tax_class_id, weight, dimensions (JSON), status (draft/active/archived), category_id, supplier_id, addedAt, updatedAt
- `ProductVariant` — product_id, SKU (unique), name (e.g., "Black, 1.2m cable"), price_delta, stock, low_stock_threshold, weight_delta, is_active, image_ids
- `Bundle` — product_id (the bundle kit), components (JSON: array of {product_variant_id, quantity}), decrement_component_stock (boolean)
- `Supplier` — name, contact_name, email, phone, lead_time_days, notes
- `MediaAsset` — url, filename, mime_type, size_bytes, variants (JSON: {thumbnail, medium, desktop, original} → urls), alt_text, tags[], folder, width, height, uploaded_by (staff_id), createdAt
- `ProductMedia` — product_id / variant_id, media_asset_id, display_order, is_primary, purpose (default/gallery/featured)

### Stock & Warehouse
- `StockLedgerEntry` — product_variant_id, delta (positive = restock, negative = sale/adjustment), reason (restock/sale/adjustment/return/damaged/correction), reason_detail (free text), actor_id (staff), reference_type (order/adjustment/return), reference_id, before_quantity, after_quantity, timestamp

### Orders & Fulfillment
- `Order` — id, customer_id, status (enum: pending_payment/paid/processing/shipped/delivered/cancelled/refunded/partially_refunded), subtotal, shipping_cost, tax_amount, discount_amount, total, currency, notes (internal), source (customer/staff — staff for phone orders), staff_creator_id, created_by_customer (boolean), createdAt, updatedAt
- `OrderLineItem` — order_id, product_variant_id, quantity, unit_price, line_total, is_gift_wrapped
- `OrderStatusHistory` — order_id, from_status, to_status, actor_id, note, timestamp
- `Shipment` — order_id, tracking_number, carrier, shipped_at, delivered_at
- `ShipmentItem` — shipment_id, order_line_item_id, quantity
- `Return` — order_id, reason, status (requested/approved/rejected/restocked), refund_amount, restocked (boolean), actor_id, createdAt

### Payments
- `PSPConnection` — id, provider (stripe/paystack), label, credentials (encrypted JSON: api_key, webhook_secret, etc.), is_enabled, is_default, priority_order, restricted_currencies[], restricted_regions[], live_mode (boolean), createdAt, updatedAt
- `Payment` — id, order_id, psp_connection_id, provider, psp_payment_intent_id, amount, currency, status (succeeded/failed/pending/disputed/chargeback), metadata (JSON), createdAt, updatedAt
- `Refund` — id, payment_id, psp_refund_id, amount, currency, reason, status (pending/succeeded/failed), initiated_by (staff_id), createdAt
- `WebhookEvent` — id, psp_connection_id, provider, event_type, psp_event_id, raw_body (JSON), headers (JSON), status (received/processed/failed/skipped), error_message, processed_at, created_at

### Cart (Storefront)
- `Cart` / `CartItem` — managed by the storefront; dashboard is read-only view
- (Exact schema depends on storefront requirements, not detailed here)

---

## 8. Suggested Technical Approach

- **Frontend**: React 19, Next.js 16 App Router with shadcn/ui (New York style), TanStack Table for paginated data tables, Recharts for interactive analytics, and Radix UI primitives for accessible components.
- **Styling**: Tailwind CSS v4 with inline `@theme` declarations in `app/globals.css` (no legacy `tailwind.config.js`). Dark-mode-first glassmorphic design system with custom CSS utilities in `app/dashboard/dashboard.css`. Font: Inter via `next/font/google`.
- **State Management**: Redux Toolkit for client-side dashboard state (form state, UI state, optimistic updates). Server data fetched via Next.js Server Components and Prisma directly; client-side refetching via API routes where needed.
- **Auth**: BetterAuth with Prisma adapter. Email/password authentication. Role-based access control enforced server-side via middleware and route handlers.
- **Backend**: PostgreSQL database via Prisma ORM. All API routes live in the Next.js app (tightly coupled — no separate backend service). Routes serve both dashboard and storefront.
- **PSP Integration**: Common adapter pattern (interface per provider) for Stripe and Paystack at launch. Credentials stored encrypted via Prisma JSON field with application-level encryption.
- **Asset Storage**: S3-compatible object storage (Cloudflare R2 or AWS S3) with CDN delivery. Image derivatives (mobile/tablet/desktop) generated on upload via server-side processing pipeline.

---

## 9. Phasing / Milestones

| Phase | Scope |
|---|---|
| **Phase 1 — Foundation** | BetterAuth (email/password), Prisma schema expansion (User, Role, Permission, PSPConnection, MediaAsset, expanded Product/Order), RBAC middleware, base product CRUD (no variants), basic order list with status transitions, Stripe PSP integration, system font + dark glassmorphic theme setup, Redux Toolkit store scaffolding, loading/error states |
| **Phase 2 — Core Operations** | Product variants + stock per variant, stock ledger with audit trail, order fulfillment workflow (packing/shipping), Paystack PSP integration, webhook event log, media gallery upload (S3/R2), responsive image derivatives, customer list + profile view |
| **Phase 3 — Analytics & Management** | Dashboard analytics with real data (revenue charts, period comparison, "needs attention" widget), top products/categories, bundles/kits, supplier records, order export (CSV/PDF), low-stock email alerts, staff audit log UI |
| **Phase 4 — Scale & Polish** | Backorder/preorder support, bulk imports (CSV), bulk operations (price/status/category), multi-PSP with fallback priority, accessible dark theme audit, performance optimization, edge cases (disputes, chargebacks, partial refunds) |

---

## 10. Resolved Decisions

| Question | Decision |
|---|---|
| PSPs at launch | **Stripe + Paystack.** Two adapters — Stripe for international cards, Paystack for local Nigerian payments. |
| Storefront architecture | **Tightly coupled.** Storefront and dashboard share the same Next.js app, database, and API routes. No separate headless backend. The storefront already exists in the same project. |
| Multi-location stock | **No — single location only** for v1. Schema stays simple. |
| Shipping carriers | **Manual tracking only.** Staff enters tracking number + carrier name. No carrier API integration in v1. |
| Catalog & order volume | **Small scale.** <500 SKUs, <200 orders/month at launch. Server-side pagination sufficient; virtualized tables deferred. |
| Brand / design system | **Fully open.** Dashboard design uses a dark-mode-first glassmorphic theme with orange accent (#D87D4A) aligned with the Audiophile brand. No existing design system to inherit. |

---

## 11. Success Metrics

- Time to fulfill an order (order placed → marked shipped) reduced by X% post-launch.
- Stock discrepancies (system vs. physical count) reduced to near-zero via the audit ledger.
- Reduction in manual PSP dashboard cross-referencing (measured qualitatively via owner feedback, or quantitatively via reduced support-ticket resolution time).
- Zero double-charge/double-refund incidents due to idempotent payment/webhook handling.

---

## 12. Loading & Error States

### 12.1 Loading States
- Every dashboard page must have a `loading.tsx` skeleton that renders the page shell (sidebar, header, card outlines) with animated pulse placeholders.
- Data tables show skeleton rows during initial load.
- Interactive charts show a skeleton chart outline (grayed-out placeholder shape).
- Dialog/modal forms show a spinner or skeleton overlay within the dialog body while data is being saved/fetched.

### 12.2 Error States
- Dashboard layout must include an `error.tsx` boundary at the root dashboard level and per-route segment where feasible.
- API route errors return structured JSON: `{ error: string, code: string, details?: any }` with appropriate HTTP status codes.
- Server component errors are caught by the nearest `error.tsx` boundary, showing: error icon, human-readable message, "Try again" button (calls `reset()`), and "Go to Dashboard" fallback link.
- Network/504 errors during client-side data fetching display an inline banner: "Could not load data. [Retry]".
- Form submission errors surface inline per-field (via `react-hook-form` + Zod validation) and at the form level as a toast (via `sonner`).
- Empty states: tables with zero rows display an `<Empty>` component with illustration, "No [items] yet" message, and a CTA button (e.g., "Add your first product").

### 12.3 404 / Not Found
- Invalid dashboard routes (e.g., `/dashboard/nonexistent`) show a "Page not found" view within the dashboard layout — not the global 404 page.
- Invalid entity IDs in URL params (e.g., `/dashboard/products/not-a-real-id`) show an inline empty state with "Product not found" message.

---

## 13. Future Considerations (Post-v1)

- Multi-warehouse/multi-location stock management.
- Additional PSPs beyond Stripe + Paystack (Flutterwave, PayPal, regional providers).
- Direct shipping carrier API integrations (label generation, rate comparison, tracking webhooks).
- Marketing automation (email campaigns, abandoned cart recovery).
- Advanced analytics (cohort analysis, LTV projections, inventory turnover).
- POS / in-person retail integration.
- Multi-store / multi-tenant support.
- SSO / SAML / enterprise auth integration.
- Mobile app for order fulfillment scanning.
