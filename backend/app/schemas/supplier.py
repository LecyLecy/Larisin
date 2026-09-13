from pydantic import BaseModel, Field, field_validator


class SupplierCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    contact: str | None = Field(default=None, max_length=120)
    product_category: str | None = Field(default=None, max_length=80)
    average_delivery_days: int | None = Field(default=None, ge=0, le=365)

    @field_validator("contact", "product_category")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Nama supplier tidak boleh kosong")
        return cleaned


class Supplier(BaseModel):
    id: str
    name: str
    contact: str | None
    product_category: str | None
    average_delivery_days: int | None
