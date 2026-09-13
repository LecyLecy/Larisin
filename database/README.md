# Database

This folder documents the planned PostgreSQL schema for Larisin.

Product, sales, inventory, supplier, and analytics-view persistence is implemented through Alembic migrations in `backend/alembic/`.
`initial_schema.sql` remains the broader planning direction; Alembic is the executable source of truth for tables already implemented.

Local PostgreSQL runs through `compose.yaml` on port `5433` to avoid conflicting with a default local PostgreSQL installation.

## Operational Tables

- `businesses`
- `users`
- `suppliers`
- `products`
- `sales_transactions`
- `sales_transaction_items`
- `inventory_movements`

Supplier is linked optionally to products and inventory movements. For the MVP, the UI assigns a
supplier during stock-in; purchase orders and supplier-price history are deferred.

## Future Analytics Direction

The first analytics views are implemented by Alembic migration `0003` and mirrored in
`analytics_views.sql` for review. They are ordinary PostgreSQL views, so reports see each
committed transaction without a scheduled refresh:

- `mart_daily_sales_summary`
- `mart_product_daily_performance`

Future views or marts:

- `dim_product`
- `dim_supplier`
- `dim_date`
- `fact_sales`
- `fact_inventory`
- `mart_low_stock_alerts`
- `mart_restock_recommendations`

## Notes

- Keep profit data protected when auth is added.
- Store all money values as integer Rupiah in the first version.
- Add migrations before production use.
