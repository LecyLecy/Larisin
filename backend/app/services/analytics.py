from collections import defaultdict
from datetime import date, datetime, time, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.core.constants import DEFAULT_BUSINESS_ID
from app.models.sales import SalesTransaction, SalesTransactionItem
from app.schemas.analytics import AnalyticsSummary, Recommendation, SalesTrendPoint
from app.schemas.product import Product, StockStatus
from app.services.products import list_products
from app.services.transactions import list_transactions

DAY_LABELS = ("Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min")


def get_analytics_summary(session: Session) -> AnalyticsSummary:
    today = datetime.now(timezone.utc).date()
    range_start = datetime.combine(today - timedelta(days=6), time.min, tzinfo=timezone.utc)
    tomorrow_start = datetime.combine(today + timedelta(days=1), time.min, tzinfo=timezone.utc)

    transactions = list(
        session.scalars(
            select(SalesTransaction)
            .where(
                SalesTransaction.business_id == DEFAULT_BUSINESS_ID,
                SalesTransaction.transaction_date >= range_start,
                SalesTransaction.transaction_date < tomorrow_start,
            )
            .options(selectinload(SalesTransaction.items))
        )
    )
    today_transactions = [
        transaction for transaction in transactions if _transaction_day(transaction.transaction_date) == today
    ]
    products = list_products(session)
    top_products = _get_top_products(session, range_start, tomorrow_start, products)
    low_stock_products = [
        product for product in products if product.status in (StockStatus.menipis, StockStatus.habis)
    ]

    return AnalyticsSummary(
        total_sales_today=sum(transaction.total_amount for transaction in today_transactions),
        gross_profit_today=sum(transaction.gross_profit for transaction in today_transactions),
        transaction_count_today=len(today_transactions),
        low_stock_count=len(low_stock_products),
        sales_trend=_build_sales_trend(transactions, today),
        top_products=top_products,
        low_stock_products=low_stock_products,
        recent_transactions=list_transactions(session)[:5],
        recommendations=_build_recommendations(top_products, low_stock_products, today_transactions),
    )


def _get_top_products(
    session: Session,
    range_start: datetime,
    range_end: datetime,
    products: list[Product],
) -> list[Product]:
    statement = (
        select(
            SalesTransactionItem.product_id,
            func.sum(SalesTransactionItem.quantity).label("quantity_sold"),
        )
        .join(SalesTransaction, SalesTransactionItem.transaction_id == SalesTransaction.id)
        .where(
            SalesTransaction.business_id == DEFAULT_BUSINESS_ID,
            SalesTransaction.transaction_date >= range_start,
            SalesTransaction.transaction_date < range_end,
            SalesTransactionItem.product_id.is_not(None),
        )
        .group_by(SalesTransactionItem.product_id)
        .order_by(func.sum(SalesTransactionItem.quantity).desc())
        .limit(5)
    )
    product_by_id = {product.id: product for product in products}
    return [
        product_by_id[str(product_id)]
        for product_id, _ in session.execute(statement)
        if str(product_id) in product_by_id
    ]


def _build_sales_trend(
    transactions: list[SalesTransaction], today: date
) -> list[SalesTrendPoint]:
    sales_by_day: defaultdict[date, int] = defaultdict(int)
    for transaction in transactions:
        sales_by_day[_transaction_day(transaction.transaction_date)] += transaction.total_amount

    days = [today - timedelta(days=offset) for offset in range(6, -1, -1)]
    return [
        SalesTrendPoint(label=DAY_LABELS[day.weekday()], value=sales_by_day[day]) for day in days
    ]


def _build_recommendations(
    top_products: list[Product],
    low_stock_products: list[Product],
    today_transactions: list[SalesTransaction],
) -> list[Recommendation]:
    recommendations: list[Recommendation] = []

    if not today_transactions:
        recommendations.append(
            Recommendation(
                title="Belum ada transaksi hari ini",
                description="Dashboard akan menjadi lebih informatif setelah penjualan pertama dicatat.",
                action="Catat transaksi penjualan untuk mulai membangun insight.",
            )
        )

    if top_products:
        product = top_products[0]
        recommendations.append(
            Recommendation(
                title=f"{product.name} paling laris",
                description="Produk ini memiliki jumlah unit terjual tertinggi dalam 7 hari terakhir.",
                action="Pastikan stok dan harga beli produk ini tetap terkendali.",
            )
        )

    for product in low_stock_products[:2]:
        if product.status == StockStatus.habis:
            description = "Stok sudah habis sehingga produk tidak dapat dijual."
        else:
            description = (
                f"Stok tersisa {product.current_stock} {product.unit}, "
                f"dengan batas minimum {product.minimum_stock}."
            )
        recommendations.append(
            Recommendation(
                title=f"Cek stok {product.name}",
                description=description,
                action="Siapkan restock atau sesuaikan stok melalui pencatatan persediaan.",
            )
        )

    return recommendations[:3]


def _transaction_day(value: datetime) -> date:
    if value.tzinfo is None:
        return value.date()
    return value.astimezone(timezone.utc).date()
