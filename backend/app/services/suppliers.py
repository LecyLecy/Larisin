from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_BUSINESS_ID
from app.models.supplier import Supplier as SupplierModel
from app.schemas.supplier import Supplier, SupplierCreate


class DuplicateSupplierError(Exception):
    pass


def to_supplier_schema(supplier: SupplierModel) -> Supplier:
    return Supplier(
        id=str(supplier.id),
        name=supplier.name,
        contact=supplier.contact,
        product_category=supplier.product_category,
        average_delivery_days=supplier.average_delivery_days,
    )


def list_suppliers(session: Session) -> list[Supplier]:
    statement = (
        select(SupplierModel)
        .where(
            SupplierModel.business_id == DEFAULT_BUSINESS_ID,
            SupplierModel.is_active.is_(True),
        )
        .order_by(SupplierModel.name)
    )
    return [to_supplier_schema(supplier) for supplier in session.scalars(statement)]


def create_supplier(session: Session, payload: SupplierCreate) -> Supplier:
    duplicate_statement = select(SupplierModel.id).where(
        SupplierModel.business_id == DEFAULT_BUSINESS_ID,
        func.lower(SupplierModel.name) == payload.name.lower(),
        SupplierModel.is_active.is_(True),
    )
    if session.scalar(duplicate_statement) is not None:
        raise DuplicateSupplierError

    supplier = SupplierModel(business_id=DEFAULT_BUSINESS_ID, **payload.model_dump())
    session.add(supplier)
    try:
        session.commit()
    except IntegrityError as error:
        session.rollback()
        raise DuplicateSupplierError from error
    session.refresh(supplier)
    return to_supplier_schema(supplier)
