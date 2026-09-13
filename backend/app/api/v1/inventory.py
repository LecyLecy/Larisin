from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.product import InventoryMovement, StockAdjustmentCreate, StockInCreate, StockInResult
from app.services.inventory import (
    InsufficientAdjustedStockError,
    ProductNotFoundError,
    SupplierNotFoundError,
    add_stock,
    adjust_stock,
    list_inventory_movements,
)

router = APIRouter()


@router.get("/movements", response_model=list[InventoryMovement])
def read_inventory_movements(
    session: Annotated[Session, Depends(get_db)],
) -> list[InventoryMovement]:
    return list_inventory_movements(session)


@router.post("/products/{product_id}/stock-in", response_model=StockInResult, status_code=status.HTTP_201_CREATED)
def create_stock_in(
    product_id: UUID,
    payload: StockInCreate,
    session: Annotated[Session, Depends(get_db)],
) -> StockInResult:
    try:
        return add_stock(session, product_id, payload)
    except ProductNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produk tidak ditemukan.") from error
    except SupplierNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier tidak ditemukan.") from error


@router.post("/products/{product_id}/adjustment", response_model=StockInResult, status_code=status.HTTP_201_CREATED)
def create_stock_adjustment(
    product_id: UUID,
    payload: StockAdjustmentCreate,
    session: Annotated[Session, Depends(get_db)],
) -> StockInResult:
    try:
        return adjust_stock(session, product_id, payload)
    except ProductNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produk tidak ditemukan.") from error
    except InsufficientAdjustedStockError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Penyesuaian membuat stok negatif. Stok tersedia {error.available}.",
        ) from error
