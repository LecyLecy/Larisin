from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.constants import DEFAULT_BUSINESS_ID
from app.models.product import Product as ProductModel
from app.models.sales import InventoryMovement, SalesTransaction, SalesTransactionItem
from app.schemas.transaction import Transaction, TransactionCreate, TransactionItem


class ProductNotFoundError(Exception):
    pass


class InsufficientStockError(Exception):
    def __init__(self, product_name: str, available: int) -> None:
        self.product_name = product_name
        self.available = available


class InvalidDiscountError(Exception):
    def __init__(self, product_name: str) -> None:
        self.product_name = product_name


def to_transaction_schema(transaction: SalesTransaction) -> Transaction:
    items = [
        TransactionItem(
            id=str(item.id),
            product_id=str(item.product_id) if item.product_id else None,
            product_name=item.product_name_snapshot,
            quantity=item.quantity,
            selling_price=item.selling_price,
            purchase_price=item.purchase_price,
            discount=item.discount,
            line_total=item.line_total,
        )
        for item in transaction.items
    ]
    return Transaction(
        id=str(transaction.id),
        date=transaction.transaction_date,
        payment_method=transaction.payment_method,
        subtotal=transaction.subtotal,
        total_discount=transaction.total_discount,
        total_amount=transaction.total_amount,
        gross_profit=transaction.gross_profit,
        total_quantity=sum(item.quantity for item in items),
        notes=transaction.notes,
        items=items,
    )


def list_transactions(session: Session) -> list[Transaction]:
    statement = (
        select(SalesTransaction)
        .where(SalesTransaction.business_id == DEFAULT_BUSINESS_ID)
        .options(selectinload(SalesTransaction.items))
        .order_by(SalesTransaction.transaction_date.desc(), SalesTransaction.created_at.desc())
    )
    return [to_transaction_schema(transaction) for transaction in session.scalars(statement)]


def create_transaction(session: Session, payload: TransactionCreate) -> Transaction:
    product_ids = [item.product_id for item in payload.items]

    # Row locks keep concurrent sales from reducing the same stock below zero.
    with session.begin():
        product_statement = (
            select(ProductModel)
            .where(
                ProductModel.business_id == DEFAULT_BUSINESS_ID,
                ProductModel.id.in_(product_ids),
                ProductModel.is_active.is_(True),
            )
            .with_for_update()
        )
        products_by_id = {product.id: product for product in session.scalars(product_statement)}

        missing_product = next(
            (item.product_id for item in payload.items if item.product_id not in products_by_id),
            None,
        )
        if missing_product is not None:
            raise ProductNotFoundError

        for item in payload.items:
            product = products_by_id[item.product_id]
            if item.quantity > product.current_stock:
                raise InsufficientStockError(product.name, product.current_stock)
            if item.discount > product.selling_price * item.quantity:
                raise InvalidDiscountError(product.name)

        transaction = SalesTransaction(
            business_id=DEFAULT_BUSINESS_ID,
            payment_method=payload.payment_method,
            subtotal=0,
            total_discount=0,
            total_amount=0,
            gross_profit=0,
            notes=payload.notes,
        )
        session.add(transaction)
        session.flush()

        subtotal = 0
        total_discount = 0
        gross_profit = 0
        for item in payload.items:
            product = products_by_id[item.product_id]
            item_subtotal = product.selling_price * item.quantity
            line_total = item_subtotal - item.discount
            item_profit = (product.selling_price - product.purchase_price) * item.quantity - item.discount

            session.add(
                SalesTransactionItem(
                    transaction_id=transaction.id,
                    product_id=product.id,
                    product_name_snapshot=product.name,
                    quantity=item.quantity,
                    selling_price=product.selling_price,
                    purchase_price=product.purchase_price,
                    discount=item.discount,
                    line_total=line_total,
                )
            )

            product.current_stock -= item.quantity
            session.add(
                InventoryMovement(
                    business_id=DEFAULT_BUSINESS_ID,
                    product_id=product.id,
                    movement_type="sale",
                    quantity_delta=-item.quantity,
                    stock_after=product.current_stock,
                    reference_type="sales_transaction",
                    reference_id=transaction.id,
                    notes=payload.notes,
                )
            )
            subtotal += item_subtotal
            total_discount += item.discount
            gross_profit += item_profit

        transaction.subtotal = subtotal
        transaction.total_discount = total_discount
        transaction.total_amount = subtotal - total_discount
        transaction.gross_profit = gross_profit
        session.flush()

        return to_transaction_schema(transaction)
