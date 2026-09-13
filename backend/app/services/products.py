from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_BUSINESS_ID
from app.models.product import Product as ProductModel
from app.schemas.product import Product, ProductCreate, ProductUpdate, StockStatus


class DuplicateProductError(Exception):
    pass


class ProductNotFoundError(Exception):
    pass


def calculate_stock_status(current_stock: int, minimum_stock: int) -> StockStatus:
    if current_stock <= 0:
        return StockStatus.habis
    if current_stock <= minimum_stock:
        return StockStatus.menipis
    return StockStatus.aman


def to_product_schema(product: ProductModel) -> Product:
    return Product(
        id=str(product.id),
        name=product.name,
        category=product.category,
        unit=product.unit,
        purchase_price=product.purchase_price,
        selling_price=product.selling_price,
        current_stock=product.current_stock,
        minimum_stock=product.minimum_stock,
        status=calculate_stock_status(product.current_stock, product.minimum_stock),
    )


def list_products(session: Session) -> list[Product]:
    statement = (
        select(ProductModel)
        .where(
            ProductModel.business_id == DEFAULT_BUSINESS_ID,
            ProductModel.is_active.is_(True),
        )
        .order_by(ProductModel.name)
    )
    return [to_product_schema(product) for product in session.scalars(statement)]


def create_product(session: Session, payload: ProductCreate) -> Product:
    duplicate_statement = select(ProductModel.id).where(
        ProductModel.business_id == DEFAULT_BUSINESS_ID,
        func.lower(ProductModel.name) == payload.name.lower(),
        ProductModel.is_active.is_(True),
    )
    if session.scalar(duplicate_statement) is not None:
        raise DuplicateProductError

    product = ProductModel(
        business_id=DEFAULT_BUSINESS_ID,
        name=payload.name,
        category=payload.category,
        unit=payload.unit,
        purchase_price=payload.purchase_price,
        selling_price=payload.selling_price,
        current_stock=payload.current_stock,
        minimum_stock=payload.minimum_stock,
    )
    session.add(product)

    try:
        session.commit()
    except IntegrityError as error:
        session.rollback()
        raise DuplicateProductError from error

    session.refresh(product)
    return to_product_schema(product)


def update_product(session: Session, product_id: UUID, payload: ProductUpdate) -> Product:
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

        duplicate = session.scalar(
            select(ProductModel.id).where(
                ProductModel.business_id == DEFAULT_BUSINESS_ID,
                func.lower(ProductModel.name) == payload.name.lower(),
                ProductModel.id != product.id,
                ProductModel.is_active.is_(True),
            )
        )
        if duplicate is not None:
            raise DuplicateProductError

        for field, value in payload.model_dump().items():
            setattr(product, field, value)
        session.flush()
        return to_product_schema(product)


def deactivate_product(session: Session, product_id: UUID) -> None:
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
        product.is_active = False
