from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_BUSINESS_ID
from app.models.product import Product as ProductModel
from app.models.sales import InventoryMovement as InventoryMovementModel
from app.models.supplier import Supplier as SupplierModel
from app.schemas.product import (
    InventoryMovement,
    Product,
    StockAdjustmentCreate,
    StockInCreate,
    StockInResult,
)
from app.services.products import to_product_schema


class ProductNotFoundError(Exception):
    pass


class SupplierNotFoundError(Exception):
    pass


class InsufficientAdjustedStockError(Exception):
    def __init__(self, available: int) -> None:
        self.available = available


def add_stock(session: Session, product_id: UUID, payload: StockInCreate) -> StockInResult:
    with session.begin():
        product = session.scalar(
            select(ProductModel)
            .where(
                ProductModel.id == product_id,
                ProductModel.business_id == DEFAULT_BUSINESS_ID,
                ProductModel.is_active.is_(True),
            )
            .with_for_update()
        )
        if product is None:
            raise ProductNotFoundError

        supplier = None
        if payload.supplier_id is not None:
            supplier = session.scalar(
                select(SupplierModel).where(
                    SupplierModel.id == payload.supplier_id,
                    SupplierModel.business_id == DEFAULT_BUSINESS_ID,
                    SupplierModel.is_active.is_(True),
                )
            )
            if supplier is None:
                raise SupplierNotFoundError

        product.current_stock += payload.quantity
        movement = InventoryMovementModel(
            business_id=DEFAULT_BUSINESS_ID,
            product_id=product.id,
            movement_type="stock_in",
            quantity_delta=payload.quantity,
            stock_after=product.current_stock,
            reference_type="stock_in",
            supplier_id=supplier.id if supplier else None,
            notes=payload.notes,
        )
        session.add(movement)
        session.flush()

        return StockInResult(
            product=to_product_schema(product),
            movement=_to_inventory_movement(movement, product, supplier),
        )


def list_inventory_movements(session: Session, limit: int = 50) -> list[InventoryMovement]:
    statement = (
        select(InventoryMovementModel, ProductModel, SupplierModel)
        .join(ProductModel, InventoryMovementModel.product_id == ProductModel.id)
        .outerjoin(SupplierModel, InventoryMovementModel.supplier_id == SupplierModel.id)
        .where(InventoryMovementModel.business_id == DEFAULT_BUSINESS_ID)
        .order_by(InventoryMovementModel.created_at.desc(), InventoryMovementModel.id.desc())
        .limit(limit)
    )
    return [
        _to_inventory_movement(movement, product, supplier)
        for movement, product, supplier in session.execute(statement)
    ]


def adjust_stock(
    session: Session, product_id: UUID, payload: StockAdjustmentCreate
) -> StockInResult:
    with session.begin():
        product = session.scalar(
            select(ProductModel)
            .where(
                ProductModel.id == product_id,
                ProductModel.business_id == DEFAULT_BUSINESS_ID,
                ProductModel.is_active.is_(True),
            )
            .with_for_update()
        )
        if product is None:
            raise ProductNotFoundError
        stock_after = product.current_stock + payload.quantity_delta
        if stock_after < 0:
            raise InsufficientAdjustedStockError(product.current_stock)

        product.current_stock = stock_after
        movement = InventoryMovementModel(
            business_id=DEFAULT_BUSINESS_ID,
            product_id=product.id,
            movement_type="adjustment",
            quantity_delta=payload.quantity_delta,
            stock_after=stock_after,
            reference_type="stock_adjustment",
            notes=payload.notes,
        )
        session.add(movement)
        session.flush()
        return StockInResult(
            product=to_product_schema(product),
            movement=_to_inventory_movement(movement, product),
        )


def _to_inventory_movement(
    movement: InventoryMovementModel, product: ProductModel, supplier: SupplierModel | None = None
) -> InventoryMovement:
    return InventoryMovement(
        id=str(movement.id),
        product_id=str(product.id),
        product_name=product.name,
        product_unit=product.unit,
        supplier_name=supplier.name if supplier else None,
        movement_type=movement.movement_type,
        quantity_delta=movement.quantity_delta,
        stock_after=movement.stock_after,
        notes=movement.notes,
        created_at=movement.created_at,
    )
