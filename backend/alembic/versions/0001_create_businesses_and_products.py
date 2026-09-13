"""create businesses and products

Revision ID: 0001
Revises:
Create Date: 2026-08-03
"""

from collections.abc import Sequence
from uuid import UUID

from alembic import op
import sqlalchemy as sa

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

DEFAULT_BUSINESS_ID = UUID("00000000-0000-0000-0000-000000000001")


def upgrade() -> None:
    businesses = op.create_table(
        "businesses",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("business_category", sa.String(length=80), nullable=True),
        sa.Column("currency_code", sa.String(length=3), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "products",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("business_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("category", sa.String(length=80), nullable=False),
        sa.Column("unit", sa.String(length=30), nullable=False),
        sa.Column("purchase_price", sa.BigInteger(), nullable=False),
        sa.Column("selling_price", sa.BigInteger(), nullable=False),
        sa.Column("current_stock", sa.Integer(), nullable=False),
        sa.Column("minimum_stock", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.CheckConstraint(
            "current_stock >= 0", name="ck_products_current_stock_non_negative"
        ),
        sa.CheckConstraint(
            "minimum_stock >= 0", name="ck_products_minimum_stock_non_negative"
        ),
        sa.CheckConstraint(
            "purchase_price >= 0", name="ck_products_purchase_price_non_negative"
        ),
        sa.CheckConstraint(
            "selling_price >= 0", name="ck_products_selling_price_non_negative"
        ),
        sa.ForeignKeyConstraint(["business_id"], ["businesses.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("business_id", "name", name="uq_products_business_name"),
    )
    op.create_index("ix_products_business_id", "products", ["business_id"])
    op.create_index(
        "ix_products_business_category", "products", ["business_id", "category"]
    )

    op.bulk_insert(
        businesses,
        [
            {
                "id": DEFAULT_BUSINESS_ID,
                "name": "Toko Rina Jaya",
                "business_category": "Toko Kelontong",
                "currency_code": "IDR",
            }
        ],
    )


def downgrade() -> None:
    op.drop_index("ix_products_business_category", table_name="products")
    op.drop_index("ix_products_business_id", table_name="products")
    op.drop_table("products")
    op.drop_table("businesses")
