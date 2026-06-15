from fastapi import APIRouter

from app.api.v1 import analytics, products, transactions

api_router = APIRouter()
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
