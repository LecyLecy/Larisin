from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SalesTransaction(Base):
    __tablename__ = "sales_transactions"
    __table_args__ = (
        CheckConstraint("subtotal >= 0", name="ck_sales_transactions_subtotal_non_negative"),
        CheckConstraint("total_discount >= 0", name="ck_sales_transactions_discount_non_negative"),
        CheckConstraint("total_amount >= 0", name="ck_sales_transactions_amount_non_negative"),
        Index("ix_sales_transactions_business_date", "business_id", "transaction_date"),
    )

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    business_id: Mapped[UUID] = mapped_column(
        ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True
    )
    transaction_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    payment_method: Mapped[str] = mapped_column(String(30), nullable=False)
    subtotal: Mapped[int] = mapped_column(BigInteger, nullable=False)
    total_discount: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0)
    total_amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    gross_profit: Mapped[int] = mapped_column(BigInteger, nullable=False)
    notes: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    business: Mapped["Business"] = relationship(back_populates="sales_transactions")
    items: Mapped[list["SalesTransactionItem"]] = relationship(
        back_populates="transaction", cascade="all, delete-orphan"
    )


class SalesTransactionItem(Base):
    __tablename__ = "sales_transaction_items"
    __table_args__ = (
        UniqueConstraint(
            "transaction_id", "product_id", name="uq_sales_transaction_items_transaction_product"
        ),
        CheckConstraint("quantity > 0", name="ck_sales_transaction_items_quantity_positive"),
        CheckConstraint("selling_price >= 0", name="ck_sales_transaction_items_selling_price_non_negative"),
        CheckConstraint("purchase_price >= 0", name="ck_sales_transaction_items_purchase_price_non_negative"),
        CheckConstraint("discount >= 0", name="ck_sales_transaction_items_discount_non_negative"),
        CheckConstraint("line_total >= 0", name="ck_sales_transaction_items_total_non_negative"),
        Index("ix_sales_transaction_items_transaction_id", "transaction_id"),
    )

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    transaction_id: Mapped[UUID] = mapped_column(
        ForeignKey("sales_transactions.id", ondelete="CASCADE"), nullable=False
    )
    product_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("products.id", ondelete="SET NULL"), nullable=True
    )
    product_name_snapshot: Mapped[str] = mapped_column(String(120), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    selling_price: Mapped[int] = mapped_column(BigInteger, nullable=False)
    purchase_price: Mapped[int] = mapped_column(BigInteger, nullable=False)
    discount: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0)
    line_total: Mapped[int] = mapped_column(BigInteger, nullable=False)

    transaction: Mapped[SalesTransaction] = relationship(back_populates="items")
    product: Mapped["Product | None"] = relationship(back_populates="sales_items")


class InventoryMovement(Base):
    __tablename__ = "inventory_movements"
    __table_args__ = (
        CheckConstraint(
            "movement_type IN ('stock_in', 'sale', 'adjustment', 'return')",
            name="ck_inventory_movements_type",
        ),
        CheckConstraint("quantity_delta <> 0", name="ck_inventory_movements_quantity_not_zero"),
        CheckConstraint("stock_after >= 0", name="ck_inventory_movements_stock_after_non_negative"),
        Index("ix_inventory_movements_product_created", "product_id", "created_at"),
    )

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    business_id: Mapped[UUID] = mapped_column(
        ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    supplier_id: Mapped[UUID | None] = mapped_column(ForeignKey("suppliers.id", ondelete="SET NULL"))
    movement_type: Mapped[str] = mapped_column(String(30), nullable=False)
    quantity_delta: Mapped[int] = mapped_column(Integer, nullable=False)
    stock_after: Mapped[int] = mapped_column(Integer, nullable=False)
    reference_type: Mapped[str | None] = mapped_column(String(30))
    reference_id: Mapped[UUID | None] = mapped_column(nullable=True)
    notes: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    business: Mapped["Business"] = relationship(back_populates="inventory_movements")
    product: Mapped["Product"] = relationship(back_populates="inventory_movements")
    supplier: Mapped["Supplier | None"] = relationship(back_populates="inventory_movements")
