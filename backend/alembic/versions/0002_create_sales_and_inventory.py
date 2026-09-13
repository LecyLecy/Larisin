"""create sales and inventory tables

Revision ID: 0002
Revises: 0001
Create Date: 2026-09-13
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "sales_transactions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("business_id", sa.Uuid(), nullable=False),
        sa.Column("transaction_date", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("payment_method", sa.String(length=30), nullable=False),
        sa.Column("subtotal", sa.BigInteger(), nullable=False),
        sa.Column("total_discount", sa.BigInteger(), nullable=False),
        sa.Column("total_amount", sa.BigInteger(), nullable=False),
        sa.Column("gross_profit", sa.BigInteger(), nullable=False),
        sa.Column("notes", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("subtotal >= 0", name="ck_sales_transactions_subtotal_non_negative"),
        sa.CheckConstraint("total_amount >= 0", name="ck_sales_transactions_amount_non_negative"),
        sa.CheckConstraint("total_discount >= 0", name="ck_sales_transactions_discount_non_negative"),
        sa.ForeignKeyConstraint(["business_id"], ["businesses.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_sales_transactions_business_id", "sales_transactions", ["business_id"])
    op.create_index(
        "ix_sales_transactions_business_date",
        "sales_transactions",
        ["business_id", "transaction_date"],
    )

    op.create_table(
        "sales_transaction_items",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("transaction_id", sa.Uuid(), nullable=False),
        sa.Column("product_id", sa.Uuid(), nullable=True),
        sa.Column("product_name_snapshot", sa.String(length=120), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("selling_price", sa.BigInteger(), nullable=False),
        sa.Column("purchase_price", sa.BigInteger(), nullable=False),
        sa.Column("discount", sa.BigInteger(), nullable=False),
        sa.Column("line_total", sa.BigInteger(), nullable=False),
        sa.CheckConstraint("discount >= 0", name="ck_sales_transaction_items_discount_non_negative"),
        sa.CheckConstraint("line_total >= 0", name="ck_sales_transaction_items_total_non_negative"),
        sa.CheckConstraint("purchase_price >= 0", name="ck_sales_transaction_items_purchase_price_non_negative"),
        sa.CheckConstraint("quantity > 0", name="ck_sales_transaction_items_quantity_positive"),
        sa.CheckConstraint("selling_price >= 0", name="ck_sales_transaction_items_selling_price_non_negative"),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["transaction_id"], ["sales_transactions.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("transaction_id", "product_id", name="uq_sales_transaction_items_transaction_product"),
    )
    op.create_index(
        "ix_sales_transaction_items_transaction_id", "sales_transaction_items", ["transaction_id"]
    )

    op.create_table(
        "inventory_movements",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("business_id", sa.Uuid(), nullable=False),
        sa.Column("product_id", sa.Uuid(), nullable=False),
        sa.Column("movement_type", sa.String(length=30), nullable=False),
        sa.Column("quantity_delta", sa.Integer(), nullable=False),
        sa.Column("stock_after", sa.Integer(), nullable=False),
        sa.Column("reference_type", sa.String(length=30), nullable=True),
        sa.Column("reference_id", sa.Uuid(), nullable=True),
        sa.Column("notes", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("movement_type IN ('stock_in', 'sale', 'adjustment', 'return')", name="ck_inventory_movements_type"),
        sa.CheckConstraint("quantity_delta <> 0", name="ck_inventory_movements_quantity_not_zero"),
        sa.CheckConstraint("stock_after >= 0", name="ck_inventory_movements_stock_after_non_negative"),
        sa.ForeignKeyConstraint(["business_id"], ["businesses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_inventory_movements_business_id", "inventory_movements", ["business_id"])
    op.create_index("ix_inventory_movements_product_id", "inventory_movements", ["product_id"])
    op.create_index(
        "ix_inventory_movements_product_created",
        "inventory_movements",
        ["product_id", "created_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_inventory_movements_product_created", table_name="inventory_movements")
    op.drop_index("ix_inventory_movements_product_id", table_name="inventory_movements")
    op.drop_index("ix_inventory_movements_business_id", table_name="inventory_movements")
    op.drop_table("inventory_movements")
    op.drop_index("ix_sales_transaction_items_transaction_id", table_name="sales_transaction_items")
    op.drop_table("sales_transaction_items")
    op.drop_index("ix_sales_transactions_business_date", table_name="sales_transactions")
    op.drop_index("ix_sales_transactions_business_id", table_name="sales_transactions")
    op.drop_table("sales_transactions")
