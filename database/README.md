# Database

This folder documents the planned PostgreSQL schema for Larisin.

The starter app does not require a database connection yet. `initial_schema.sql` is a safe planning/first-migration direction for Railway PostgreSQL when persistence begins.

## Operational Tables

- `businesses`
- `users`
- `suppliers`
- `products`
- `sales_transactions`
- `sales_transaction_items`
- `inventory_movements`

## Future Analytics Direction

After the operational tables stabilize, add SQL views or marts for:

- `dim_product`
- `dim_supplier`
- `dim_date`
- `fact_sales`
- `fact_inventory`
- `mart_daily_sales_summary`
- `mart_product_performance`
- `mart_low_stock_alerts`
- `mart_restock_recommendations`

## Notes

- Keep profit data protected when auth is added.
- Store all money values as integer Rupiah in the first version.
- Add migrations before production use.
