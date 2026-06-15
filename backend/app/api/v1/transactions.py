from fastapi import APIRouter

from app.schemas.transaction import Transaction
from app.services.sample_data import get_transactions

router = APIRouter()


@router.get("", response_model=list[Transaction])
def list_transactions() -> list[Transaction]:
    return get_transactions()
