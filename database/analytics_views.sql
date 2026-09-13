-- Larisin PostgreSQL analytics views.
-- Executable source: backend/alembic/versions/0003_create_analytics_views.py
-- These ordinary views keep metrics current without a scheduler or ETL job.

CREATE OR REPLACE VIEW mart_daily_sales_summary AS
SELECT
    business_id,
    (transaction_date AT TIME ZONE 'UTC')::date AS sales_date,
    COUNT(*)::bigint AS transaction_count,
    COALESCE(SUM(total_amount), 0)::bigint AS total_sales,
    COALESCE(SUM(gross_profit), 0)::bigint AS gross_profit,
    COALESCE(SUM(total_discount), 0)::bigint AS total_discount
FROM sales_transactions
GROUP BY business_id, (transaction_date AT TIME ZONE 'UTC')::date;

CREATE OR REPLACE VIEW mart_product_daily_performance AS
SELECT
    transactions.business_id,
    (transactions.transaction_date AT TIME ZONE 'UTC')::date AS sales_date,
    items.product_id,
    items.product_name_snapshot,
    products.category,
    products.unit,
    COUNT(DISTINCT transactions.id)::bigint AS transaction_count,
    COALESCE(SUM(items.quantity), 0)::bigint AS quantity_sold,
    COALESCE(SUM(items.line_total), 0)::bigint AS net_sales,
    COALESCE(SUM(items.line_total - items.purchase_price * items.quantity), 0)::bigint AS gross_profit
FROM sales_transactions AS transactions
INNER JOIN sales_transaction_items AS items ON items.transaction_id = transactions.id
LEFT JOIN products ON products.id = items.product_id
GROUP BY
    transactions.business_id,
    (transactions.transaction_date AT TIME ZONE 'UTC')::date,
    items.product_id,
    items.product_name_snapshot,
    products.category,
    products.unit;
