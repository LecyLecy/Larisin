# Project Overview

## Summary

Larisin is a UMKM/Koperasi intelligence platform for Indonesian small businesses. It turns daily sales and inventory records into practical business insight.

## Target Users

- UMKM owners.
- Small shop and warung owners.
- Koperasi staff.
- Food sellers and resellers.
- Store staff who input sales and stock updates.
- Owners/admins who review sales, profit, stock, and reports.

## Problem

Many target users still record sales and inventory in notebooks, WhatsApp, Excel, or scattered notes. They often do not know which products sell most, which generate profit, which stock is low, or what to restock next.

## Value Proposition

Catat transaksi dan stok dengan mudah, lalu Larisin bantu tunjukkan produk terlaris, keuntungan, stok menipis, dan saran restock.

## MVP Scope

- Landing/basic app shell.
- Dashboard with sample business summary data.
- Products and stock page.
- Transactions page.
- Backend health check.
- Backend API structure for products, transactions, inventory, and analytics.
- Database schema direction.
- Environment configuration.
- Documentation and AI memory docs.
- Safe Git workflow using `main` and `dev`.

## Out of Scope

- Full authentication.
- Payment system.
- Full multi-tenant organizations.
- ML forecasting.
- Complex supplier optimization.
- Production file import/export.
- Complete CRUD for every entity.
- Real BI engine.
- Advanced role permissions.
- Native mobile app.
- Push notifications.

## Success Criteria

- Frontend/backend structure is clear.
- Frontend runs locally and shows initial Larisin UI.
- Backend runs locally and exposes `/health`.
- README and env examples exist.
- `AGENTS.md` exists.
- Required 10 docs exist.
- No secrets are committed.

## Assumptions

- **Assumption:** Railway PostgreSQL will be used for production database.
- **Assumption:** Auth will be backend-managed JWT/session auth later.
- **Assumption:** The user will provide the logo file later at `frontend/public/brand/larisin-icon.png`.
- **Assumption:** Initial implementation uses sample data only.
