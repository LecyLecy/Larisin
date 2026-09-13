from pydantic import BaseModel, Field, field_validator


class BusinessProfile(BaseModel):
    name: str
    business_category: str | None
    currency_code: str


class BusinessProfileUpdate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    business_category: str | None = Field(default=None, max_length=80)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Nama usaha tidak boleh kosong")
        return cleaned

    @field_validator("business_category")
    @classmethod
    def normalize_category(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return value.strip() or None
