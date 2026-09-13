from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class StockStatus(StrEnum):
    aman = "Aman"
    menipis = "Menipis"
    habis = "Habis"


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=80)
    unit: str = Field(min_length=1, max_length=30)
    purchase_price: int = Field(ge=0)
    selling_price: int = Field(ge=0)
    current_stock: int = Field(ge=0)
    minimum_stock: int = Field(ge=0)

    @field_validator("name", "category", "unit")
    @classmethod
    def strip_text_fields(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Nilai tidak boleh kosong")
        return cleaned


class Product(BaseModel):
    id: str
    name: str
    category: str
    unit: str
    purchase_price: int = Field(ge=0)
    selling_price: int = Field(ge=0)
    current_stock: int = Field(ge=0)
    minimum_stock: int = Field(ge=0)
    status: StockStatus


class ProductUpdate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=80)
    unit: str = Field(min_length=1, max_length=30)
    purchase_price: int = Field(ge=0)
    selling_price: int = Field(ge=0)
    minimum_stock: int = Field(ge=0)

    @field_validator("name", "category", "unit")
    @classmethod
    def strip_text_fields(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Nilai tidak boleh kosong")
        return cleaned


class StockInCreate(BaseModel):
    quantity: int = Field(gt=0, le=10_000)
    supplier_id: UUID | None = None
    notes: str | None = Field(default=None, max_length=500)

    @field_validator("notes")
    @classmethod
    def normalize_notes(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None


class StockAdjustmentCreate(BaseModel):
    quantity_delta: int = Field(ge=-10_000, le=10_000)
    notes: str = Field(min_length=2, max_length=500)

    @field_validator("quantity_delta")
    @classmethod
    def reject_zero_delta(cls, value: int) -> int:
        if value == 0:
            raise ValueError("Perubahan stok tidak boleh nol")
        return value

    @field_validator("notes")
    @classmethod
    def normalize_notes(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise ValueError("Alasan penyesuaian harus diisi")
        return cleaned


class InventoryMovement(BaseModel):
    id: str
    product_id: str
    product_name: str
    product_unit: str
    supplier_name: str | None
    movement_type: str
    quantity_delta: int
    stock_after: int
    notes: str | None
    created_at: datetime


class StockInResult(BaseModel):
    product: Product
    movement: InventoryMovement
