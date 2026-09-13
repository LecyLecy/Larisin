from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.transaction import Transaction, TransactionCreate
from app.services.transactions import (
    InsufficientStockError,
    InvalidDiscountError,
    ProductNotFoundError,
    create_transaction,
    list_transactions,
)

router = APIRouter()


@router.get("", response_model=list[Transaction])
def read_transactions(session: Annotated[Session, Depends(get_db)]) -> list[Transaction]:
    return list_transactions(session)


@router.post("", response_model=Transaction, status_code=status.HTTP_201_CREATED)
def add_transaction(
    payload: TransactionCreate,
    session: Annotated[Session, Depends(get_db)],
) -> Transaction:
    try:
        return create_transaction(session, payload)
    except ProductNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produk tidak ditemukan.") from error
    except InsufficientStockError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Stok {error.product_name} tidak cukup. Tersedia {error.available}.",
        ) from error
    except InvalidDiscountError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Diskon {error.product_name} melebihi nilai barang.",
        ) from error
