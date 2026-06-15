from datetime import date

from pydantic import BaseModel, Field


class Transaction(BaseModel):
    id: str
    date: date
    product_name: str
    quantity: int = Field(gt=0)
    selling_price: int = Field(ge=0)
    discount: int = Field(default=0, ge=0)
    payment_method: str
    notes: str | None = None
