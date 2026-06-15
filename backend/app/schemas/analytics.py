from pydantic import BaseModel, Field

from app.schemas.product import Product
from app.schemas.transaction import Transaction


class SalesTrendPoint(BaseModel):
    label: str
    value: int = Field(ge=0)


class Recommendation(BaseModel):
    title: str
    description: str
    action: str


class AnalyticsSummary(BaseModel):
    total_sales_today: int = Field(ge=0)
    gross_profit_today: int
    transaction_count_today: int = Field(ge=0)
    low_stock_count: int = Field(ge=0)
    sales_trend: list[SalesTrendPoint]
    top_products: list[Product]
    low_stock_products: list[Product]
    recent_transactions: list[Transaction]
    recommendations: list[Recommendation]
