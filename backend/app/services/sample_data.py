from datetime import datetime, timezone

from app.schemas.analytics import AnalyticsSummary, Recommendation, SalesTrendPoint
from app.schemas.product import Product, StockStatus
from app.schemas.transaction import Transaction, TransactionItem


def get_products() -> list[Product]:
    return [
        Product(
            id="prd-beras-5kg",
            name="Beras Ramos 5kg",
            category="Sembako",
            unit="karung",
            purchase_price=58000,
            selling_price=68000,
            current_stock=8,
            minimum_stock=10,
            status=StockStatus.menipis,
        ),
        Product(
            id="prd-minuman-sachet",
            name="Minuman Sachet",
            category="Minuman",
            unit="renceng",
            purchase_price=9200,
            selling_price=10000,
            current_stock=32,
            minimum_stock=12,
            status=StockStatus.aman,
        ),
        Product(
            id="prd-minyak-1l",
            name="Minyak Goreng 1L",
            category="Sembako",
            unit="botol",
            purchase_price=14500,
            selling_price=17000,
            current_stock=0,
            minimum_stock=6,
            status=StockStatus.habis,
        ),
    ]


def get_transactions() -> list[Transaction]:
    return [
        Transaction(
            id="trx-001",
            date=datetime(2026, 6, 16, 9, 15, tzinfo=timezone.utc),
            payment_method="Tunai",
            subtotal=136000,
            total_discount=0,
            total_amount=136000,
            gross_profit=20000,
            notes="Sample data",
            total_quantity=2,
            items=[
                TransactionItem(
                    id="trx-item-001",
                    product_id="prd-beras-5kg",
                    product_name="Beras Ramos 5kg",
                    quantity=2,
                    selling_price=68000,
                    purchase_price=58000,
                    discount=0,
                    line_total=136000,
                )
            ],
        ),
        Transaction(
            id="trx-002",
            date=datetime(2026, 6, 16, 10, 30, tzinfo=timezone.utc),
            payment_method="QRIS",
            subtotal=50000,
            total_discount=0,
            total_amount=50000,
            gross_profit=4000,
            notes="Sample data",
            total_quantity=5,
            items=[
                TransactionItem(
                    id="trx-item-002",
                    product_id="prd-minuman-sachet",
                    product_name="Minuman Sachet",
                    quantity=5,
                    selling_price=10000,
                    purchase_price=9200,
                    discount=0,
                    line_total=50000,
                )
            ],
        ),
    ]


def get_analytics_summary() -> AnalyticsSummary:
    products = get_products()
    transactions = get_transactions()

    return AnalyticsSummary(
        total_sales_today=2450000,
        gross_profit_today=620000,
        transaction_count_today=38,
        low_stock_count=7,
        sales_trend=[
            SalesTrendPoint(label="Sen", value=1800000),
            SalesTrendPoint(label="Sel", value=2100000),
            SalesTrendPoint(label="Rab", value=1950000),
            SalesTrendPoint(label="Kam", value=2300000),
            SalesTrendPoint(label="Jum", value=2750000),
            SalesTrendPoint(label="Sab", value=3200000),
            SalesTrendPoint(label="Min", value=2450000),
        ],
        top_products=products[:2],
        low_stock_products=[product for product in products if product.status != StockStatus.aman],
        recent_transactions=transactions,
        recommendations=[
            Recommendation(
                title="Beras 5kg hampir habis",
                description="Stok Beras 5kg diperkirakan habis dalam 3 hari jika penjualan stabil.",
                action="Siapkan restock sebelum akhir pekan.",
            ),
            Recommendation(
                title="Margin minuman sachet kecil",
                description="Minuman Sachet laku tinggi, tapi margin hanya sekitar 8%.",
                action="Cek harga beli atau paket bundling.",
            ),
            Recommendation(
                title="Supplier Sinar Jaya menarik",
                description="Supplier Sinar Jaya memberi harga lebih rendah untuk kategori sembako.",
                action="Bandingkan untuk restock berikutnya.",
            ),
        ],
    )
