# UI Routes and Components

## Routes

- `/`: Dashboard.
- `/transactions`: Transaksi.
- `/products`: Produk & Stok.
- `/supplier`: Supplier placeholder.
- `/insight`: Insight placeholder.
- `/reports`: Laporan placeholder.
- `/settings`: Pengaturan placeholder.

## Main Components

- App shell with desktop sidebar and mobile bottom navigation.
- KPI cards.
- Section cards.
- Status badges for `Aman`, `Menipis`, and `Habis`.
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

## Label Guidance

- Use `Total Penjualan`, not `Revenue`.
- Use `Keuntungan Kotor`, not `Gross Profit`.
- Use `Stok Menipis`, not `Low Stock`.
- Use `Produk Terlaris`, not `Top Products`.
- Use `Saran Restock`, not `Restock Recommendation`.

## Logo/Branding Notes

- **Assumption:** The user will provide the real logo later.
- Expected path: `frontend/public/brand/larisin-icon.png`.
- Until then, use text branding and a simple CSS brand mark.
