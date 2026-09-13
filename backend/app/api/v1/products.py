from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.product import Product, ProductCreate, ProductUpdate
from app.services.products import (
    DuplicateProductError,
    ProductNotFoundError,
    create_product,
    deactivate_product,
    list_products,
    update_product,
)

router = APIRouter()


@router.get("", response_model=list[Product])
def read_products(session: Annotated[Session, Depends(get_db)]) -> list[Product]:
    return list_products(session)


@router.post("", response_model=Product, status_code=status.HTTP_201_CREATED)
def add_product(
    payload: ProductCreate,
    session: Annotated[Session, Depends(get_db)],
) -> Product:
    try:
        return create_product(session, payload)
    except DuplicateProductError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Produk dengan nama tersebut sudah ada.",
        ) from error


@router.patch("/{product_id}", response_model=Product)
def edit_product(
    product_id: UUID,
    payload: ProductUpdate,
    session: Annotated[Session, Depends(get_db)],
) -> Product:
    try:
        return update_product(session, product_id, payload)
    except ProductNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produk tidak ditemukan.") from error
    except DuplicateProductError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Produk dengan nama tersebut sudah ada.",
        ) from error


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_product_route(
    product_id: UUID,
    session: Annotated[Session, Depends(get_db)],
) -> None:
    try:
        deactivate_product(session, product_id)
    except ProductNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produk tidak ditemukan.") from error
