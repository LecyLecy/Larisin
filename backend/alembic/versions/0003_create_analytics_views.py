"""create analytics views

Revision ID: 0003
Revises: 0002
Create Date: 2026-09-13
"""

from collections.abc import Sequence

from alembic import op

revision: str = "0003"
down_revision: str | None = "0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        """
        CREATE VIEW mart_daily_sales_summary AS
        SELECT
            business_id,
            (transaction_date AT TIME ZONE 'UTC')::date AS sales_date,
            COUNT(*)::bigint AS transaction_count,
            COALESCE(SUM(total_amount), 0)::bigint AS total_sales,
            COALESCE(SUM(gross_profit), 0)::bigint AS gross_profit,
            COALESCE(SUM(total_discount), 0)::bigint AS total_discount
        FROM sales_transactions
        GROUP BY business_id, (transaction_date AT TIME ZONE 'UTC')::date
        """
    )
    op.execute(
        """
        CREATE VIEW mart_product_daily_performance AS
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
            products.unit
        """
    )


def downgrade() -> None:
    op.execute("DROP VIEW IF EXISTS mart_product_daily_performance")
    op.execute("DROP VIEW IF EXISTS mart_daily_sales_summary")
