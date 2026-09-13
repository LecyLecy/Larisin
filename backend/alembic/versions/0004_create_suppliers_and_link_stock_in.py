"""create suppliers and link stock movements

Revision ID: 0004
Revises: 0003
Create Date: 2026-09-13
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0004"
down_revision: str | None = "0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "suppliers",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("business_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("contact", sa.String(length=120), nullable=True),
        sa.Column("product_category", sa.String(length=80), nullable=True),
        sa.Column("average_delivery_days", sa.Integer(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint(
            "average_delivery_days IS NULL OR average_delivery_days >= 0",
            name="ck_suppliers_average_delivery_days_non_negative",
        ),
        sa.ForeignKeyConstraint(["business_id"], ["businesses.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("business_id", "name", name="uq_suppliers_business_name"),
    )
    op.create_index("ix_suppliers_business_id", "suppliers", ["business_id"])
    op.add_column("products", sa.Column("supplier_id", sa.Uuid(), nullable=True))
    op.create_foreign_key(
        "fk_products_supplier_id_suppliers", "products", "suppliers", ["supplier_id"], ["id"], ondelete="SET NULL"
    )
    op.create_index("ix_products_supplier_id", "products", ["supplier_id"])
    op.add_column("inventory_movements", sa.Column("supplier_id", sa.Uuid(), nullable=True))
    op.create_foreign_key(
        "fk_inventory_movements_supplier_id_suppliers", "inventory_movements", "suppliers", ["supplier_id"], ["id"], ondelete="SET NULL"
    )
    op.create_index("ix_inventory_movements_supplier_id", "inventory_movements", ["supplier_id"])


def downgrade() -> None:
    op.drop_index("ix_inventory_movements_supplier_id", table_name="inventory_movements")
    op.drop_constraint("fk_inventory_movements_supplier_id_suppliers", "inventory_movements", type_="foreignkey")
    op.drop_column("inventory_movements", "supplier_id")
    op.drop_index("ix_products_supplier_id", table_name="products")
    op.drop_constraint("fk_products_supplier_id_suppliers", "products", type_="foreignkey")
    op.drop_column("products", "supplier_id")
    op.drop_index("ix_suppliers_business_id", table_name="suppliers")
    op.drop_table("suppliers")
