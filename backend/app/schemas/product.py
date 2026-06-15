from enum import StrEnum

from pydantic import BaseModel, Field


class StockStatus(StrEnum):
    aman = "Aman"
    menipis = "Menipis"
    habis = "Habis"


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
