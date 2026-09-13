# UI Routes and Components

## Routes

- `/`: Dashboard.
- `/transactions`: Transaksi.
- `/products`: Produk & Stok.
- `/supplier`: Supplier list and creation.
- `/insight`: Live recommendations and action-focused product lists.
- `/reports`: Range sales report and product performance.
- `/settings`: Persistent business profile settings.

## Main Components

- App shell with desktop sidebar and mobile bottom navigation.
- KPI cards.
- Live dashboard KPI cards, seven-day sales trend, and rule-based operational recommendations.
- Section cards.
- Status badges for `Aman`, `Menipis`, and `Habis`.
- Add Product modal with native and backend validation.
- Add Transaction modal with product selection, cart, per-item quantity/discount, payment method, and calculated total.
- Responsive product table on desktop and complete product rows on mobile.
- Stock-in modal and inventory movement history on Produk & Stok.
- Reports view with 7/30/90-day range control, KPI cards, daily sales chart, and product-performance table.
- Supplier list and creation modal; stock-in optionally selects a saved supplier.
- Product metadata edit, confirmed soft deactivation, and stock adjustment modal with mandatory reason.
- Business profile settings form that refreshes the app shell header; data-backed Insight screen.
- Empty state.
- Error state.
- Recommendation cards.

## Design Rules

- Indonesian labels in user-facing UI.
- Light theme.
- Green/teal primary color direction.
- Orange/amber for warning and recommendations.
- Red only for critical status.
- Simple, practical, non-enterprise dashboard feel.
- Avoid technical jargon.

## Responsive Behavior

- Desktop uses a left sidebar.
- Mobile stacks cards vertically and uses bottom navigation.
- Main actions stay visible and readable on small screens.

## Transaction UI Flow

```mermaid
flowchart TD
    A["Open Transaksi"] --> B["Tambah Transaksi"]
    B --> C["Select product and quantity"]
    C --> D["Add to cart"]
    D --> E{"More products?"}
    E -- "Yes" --> C
    E -- "No" --> F["Choose payment and optional note"]
    F --> G["Review subtotal, discount, total"]
    G --> H["Save Transaction"]
    H --> I["Success message and updated transaction list"]
```

## Stock-In UI Flow

```mermaid
flowchart TD
    A["Open Produk & Stok"] --> B["Tambah stok for a product"]
    B --> C["Enter quantity and optional note"]
    C --> D["Simpan Restock"]
    D --> E["Updated product stock"]
    E --> F["New inventory movement at top of history"]
```

## Reports UI Flow

```mermaid
flowchart TD
    A["Open Laporan"] --> B["Choose 7, 30, or 90 days"]
    B --> C["Load report overview"]
    C --> D["Read KPI cards"]
    C --> E["Inspect daily sales chart"]
    C --> F["Compare product performance"]
```

## Supplier-to-Stock UI Flow

```mermaid
flowchart TD
    A["Open Supplier"] --> B["Tambah Supplier"]
    B --> C["Save supplier profile"]
    C --> D["Open Produk & Stok"]
    D --> E["Tambah stok"]
    E --> F["Select supplier optionally"]
    F --> G["Save restock and supplier-labelled movement"]
```

## Stock Adjustment UI Flow

```mermaid
flowchart TD
    A["Open Produk & Stok"] --> B["Choose Sesuaikan"]
    B --> C["Enter positive or negative quantity"]
    C --> D["Record reason"]
    D --> E["Save adjustment"]
    E --> F["Updated balance and dated adjustment history"]
```

## Business Profile UI Flow

```mermaid
flowchart TD
    A["Open Pengaturan"] --> B["Edit business name and category"]
    B --> C["Save profile"]
    C --> D["Refresh app shell"]
    D --> E["Updated business name in header"]
```

## Label Guidance

- Use `Total Penjualan`, not `Revenue`.
- Use `Keuntungan Kotor`, not `Gross Profit`.
- Use `Stok Menipis`, not `Low Stock`.
- Use `Produk Terlaris`, not `Top Products`.
- Use `Saran Restock`, not `Restock Recommendation`.

## Logo/Branding Notes

- The app shell uses the provided logo from `/brand/larisin-icon.png`.
- Expected path: `frontend/public/brand/larisin-icon.png`.
