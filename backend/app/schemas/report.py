from datetime import date

from pydantic import BaseModel, Field


class DailySalesPoint(BaseModel):
    date: date
    total_sales: int = Field(ge=0)
    gross_profit: int
    transaction_count: int = Field(ge=0)


class ProductPerformance(BaseModel):
    product_name: str
    category: str | None = None
    unit: str | None = None
    quantity_sold: int = Field(ge=0)
    transaction_count: int = Field(ge=0)
    net_sales: int = Field(ge=0)
    gross_profit: int


class ReportOverview(BaseModel):
    period_start: date
    period_end: date
    total_sales: int = Field(ge=0)
    gross_profit: int
    transaction_count: int = Field(ge=0)
    total_quantity: int = Field(ge=0)
    average_transaction_value: int = Field(ge=0)
    daily_sales: list[DailySalesPoint]
    product_performance: list[ProductPerformance]
