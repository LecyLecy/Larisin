from collections import defaultdict
from datetime import date, datetime, time, timedelta, timezone

from sqlalchemy import select, text
from sqlalchemy.orm import Session, selectinload

from app.core.constants import DEFAULT_BUSINESS_ID
from app.models.product import Product as ProductModel
from app.models.sales import SalesTransaction
from app.schemas.report import DailySalesPoint, ProductPerformance, ReportOverview


def get_report_overview(session: Session, days: int) -> ReportOverview:
    if session.get_bind().dialect.name == "postgresql":
        return _get_report_from_views(session, days)
    return _get_report_from_operational_tables(session, days)


def _get_report_from_operational_tables(session: Session, days: int) -> ReportOverview:
    period_end = datetime.now(timezone.utc).date()
    period_start = period_end - timedelta(days=days - 1)
    range_start = datetime.combine(period_start, time.min, tzinfo=timezone.utc)
    range_end = datetime.combine(period_end + timedelta(days=1), time.min, tzinfo=timezone.utc)
    transactions = list(
        session.scalars(
            select(SalesTransaction)
            .where(
                SalesTransaction.business_id == DEFAULT_BUSINESS_ID,
                SalesTransaction.transaction_date >= range_start,
                SalesTransaction.transaction_date < range_end,
            )
            .options(selectinload(SalesTransaction.items))
        )
    )
    product_metadata = {
        str(product.id): (product.category, product.unit)
        for product in session.scalars(
            select(ProductModel).where(ProductModel.business_id == DEFAULT_BUSINESS_ID)
        )
    }

    daily_sales: defaultdict[date, dict[str, int]] = defaultdict(
        lambda: {"total_sales": 0, "gross_profit": 0, "transaction_count": 0}
    )
    product_performance: dict[str, dict[str, int | str | None]] = {}
    total_quantity = 0

    for transaction in transactions:
        transaction_day = _transaction_day(transaction.transaction_date)
        daily_sales[transaction_day]["total_sales"] += transaction.total_amount
        daily_sales[transaction_day]["gross_profit"] += transaction.gross_profit
        daily_sales[transaction_day]["transaction_count"] += 1

        for item in transaction.items:
            product_key = str(item.product_id) if item.product_id else item.product_name_snapshot
            category, unit = product_metadata.get(str(item.product_id), (None, None))
            row = product_performance.setdefault(
                product_key,
                {
                    "product_name": item.product_name_snapshot,
                    "category": category,
                    "unit": unit,
                    "quantity_sold": 0,
                    "transaction_count": 0,
                    "net_sales": 0,
                    "gross_profit": 0,
                },
            )
            row["quantity_sold"] = int(row["quantity_sold"]) + item.quantity
            row["transaction_count"] = int(row["transaction_count"]) + 1
            row["net_sales"] = int(row["net_sales"]) + item.line_total
            row["gross_profit"] = int(row["gross_profit"]) + (
                item.line_total - item.purchase_price * item.quantity
            )
            total_quantity += item.quantity

    dates = [period_start + timedelta(days=offset) for offset in range(days)]
    trend = [
        DailySalesPoint(date=current_date, **daily_sales[current_date]) for current_date in dates
    ]
    performance = [ProductPerformance(**row) for row in product_performance.values()]
    performance.sort(key=lambda row: (-row.net_sales, -row.gross_profit, row.product_name))
    total_sales = sum(transaction.total_amount for transaction in transactions)

    return ReportOverview(
        period_start=period_start,
        period_end=period_end,
        total_sales=total_sales,
        gross_profit=sum(transaction.gross_profit for transaction in transactions),
        transaction_count=len(transactions),
        total_quantity=total_quantity,
        average_transaction_value=total_sales // len(transactions) if transactions else 0,
        daily_sales=trend,
        product_performance=performance,
    )


def _get_report_from_views(session: Session, days: int) -> ReportOverview:
    period_end = datetime.now(timezone.utc).date()
    period_start = period_end - timedelta(days=days - 1)
    params = {
        "business_id": DEFAULT_BUSINESS_ID,
        "period_start": period_start,
        "period_end": period_end,
    }
    daily_rows = session.execute(
        text(
            """
            SELECT sales_date, transaction_count, total_sales, gross_profit
            FROM mart_daily_sales_summary
            WHERE business_id = :business_id
              AND sales_date BETWEEN :period_start AND :period_end
            ORDER BY sales_date
            """
        ),
        params,
    ).mappings()
    daily_by_date = {row["sales_date"]: row for row in daily_rows}
    trend = [
        DailySalesPoint(
            date=current_date,
            total_sales=int(daily_by_date.get(current_date, {}).get("total_sales", 0)),
            gross_profit=int(daily_by_date.get(current_date, {}).get("gross_profit", 0)),
            transaction_count=int(
                daily_by_date.get(current_date, {}).get("transaction_count", 0)
            ),
        )
        for current_date in (period_start + timedelta(days=offset) for offset in range(days))
    ]
    product_rows = session.execute(
        text(
            """
            SELECT
                product_name_snapshot AS product_name,
                category,
                unit,
                SUM(quantity_sold)::bigint AS quantity_sold,
                SUM(transaction_count)::bigint AS transaction_count,
                SUM(net_sales)::bigint AS net_sales,
                SUM(gross_profit)::bigint AS gross_profit
            FROM mart_product_daily_performance
            WHERE business_id = :business_id
              AND sales_date BETWEEN :period_start AND :period_end
            GROUP BY product_name_snapshot, category, unit
            ORDER BY net_sales DESC, gross_profit DESC, product_name_snapshot
            """
        ),
        params,
    ).mappings()
    performance = [
        ProductPerformance(
            product_name=row["product_name"],
            category=row["category"],
            unit=row["unit"],
            quantity_sold=int(row["quantity_sold"]),
            transaction_count=int(row["transaction_count"]),
            net_sales=int(row["net_sales"]),
            gross_profit=int(row["gross_profit"]),
        )
        for row in product_rows
    ]
    total_sales = sum(point.total_sales for point in trend)
    transaction_count = sum(point.transaction_count for point in trend)

    return ReportOverview(
        period_start=period_start,
        period_end=period_end,
        total_sales=total_sales,
        gross_profit=sum(point.gross_profit for point in trend),
        transaction_count=transaction_count,
        total_quantity=sum(product.quantity_sold for product in performance),
        average_transaction_value=total_sales // transaction_count if transaction_count else 0,
        daily_sales=trend,
        product_performance=performance,
    )


def _transaction_day(value: datetime) -> date:
    if value.tzinfo is None:
        return value.date()
    return value.astimezone(timezone.utc).date()
