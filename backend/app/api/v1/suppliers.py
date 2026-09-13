from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.supplier import Supplier, SupplierCreate
from app.services.suppliers import DuplicateSupplierError, create_supplier, list_suppliers

router = APIRouter()


@router.get("", response_model=list[Supplier])
def read_suppliers(session: Annotated[Session, Depends(get_db)]) -> list[Supplier]:
    return list_suppliers(session)


@router.post("", response_model=Supplier, status_code=status.HTTP_201_CREATED)
def create_supplier_route(
    payload: SupplierCreate,
    session: Annotated[Session, Depends(get_db)],
) -> Supplier:
    try:
        return create_supplier(session, payload)
    except DuplicateSupplierError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Supplier dengan nama tersebut sudah ada.",
        ) from error
