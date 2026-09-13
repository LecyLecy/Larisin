from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, Field, field_validator, model_validator


class PaymentMethod(StrEnum):
    tunai = "Tunai"
    qris = "QRIS"
    transfer = "Transfer"
    debit_kredit = "Debit/Kredit"


class TransactionItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(gt=0, le=10_000)
    discount: int = Field(default=0, ge=0)


class TransactionCreate(BaseModel):
    items: list[TransactionItemCreate] = Field(min_length=1, max_length=50)
    payment_method: PaymentMethod
    notes: str | None = Field(default=None, max_length=500)

    @field_validator("notes")
    @classmethod
    def normalize_notes(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None

    @model_validator(mode="after")
    def reject_duplicate_products(self) -> "TransactionCreate":
        product_ids = [item.product_id for item in self.items]
        if len(product_ids) != len(set(product_ids)):
            raise ValueError("Satu produk hanya boleh muncul sekali dalam transaksi.")
        return self


class TransactionItem(BaseModel):
    id: str
    product_id: str | None
    product_name: str
    quantity: int
    selling_price: int
    purchase_price: int
    discount: int
    line_total: int


class Transaction(BaseModel):
    id: str
    date: datetime
    payment_method: PaymentMethod
    subtotal: int
    total_discount: int
    total_amount: int
    gross_profit: int
    total_quantity: int
    notes: str | None
    items: list[TransactionItem]
