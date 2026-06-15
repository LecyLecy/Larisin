from fastapi import APIRouter

from app.schemas.product import Product
from app.services.sample_data import get_products

router = APIRouter()


@router.get("", response_model=list[Product])
def list_products() -> list[Product]:
    return get_products()
