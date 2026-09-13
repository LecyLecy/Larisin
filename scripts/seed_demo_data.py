"""Populate an empty Larisin development database with realistic demo data.

Run from ``backend`` with ``DATABASE_URL`` configured. The script exits without
changing anything when products already exist, protecting manually entered data.
"""

from datetime import datetime, timedelta, timezone
from pathlib import Path
from random import Random
import sys

from sqlalchemy import func, select

# Allow the script to run from the repository root or any other working directory.
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from app.core.constants import DEFAULT_BUSINESS_ID
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import Business, InventoryMovement, Product, SalesTransaction, SalesTransactionItem, Supplier

RANDOM = Random(20260913)

SUPPLIERS = [
    ("CV Sumber Makmur", "0812-3456-7890", "Sembako", 2),
    ("PT Nusantara Pangan", "0813-2020-4848", "Makanan", 3),
    ("UD Segar Bersama", "0811-9000-7711", "Minuman", 1),
    ("Koperasi Harapan", "0821-7755-1100", "Perawatan", 2),
    ("Toko Grosir Sentosa", "0852-4488-6600", "Lainnya", 4),
]

PRODUCTS = [
    ("Beras Ramos 5kg", "Sembako", "karung", 62000, 72000, 20),
    ("Minyak Goreng 1L", "Sembako", "botol", 15000, 17500, 24),
    ("Gula Pasir 1kg", "Sembako", "bungkus", 14500, 17000, 18),
    ("Tepung Terigu 1kg", "Sembako", "bungkus", 10500, 13000, 16),
    ("Telur Ayam", "Sembako", "pcs", 1800, 2300, 30),
    ("Mi Instan Goreng", "Makanan", "pcs", 2600, 3500, 36),
    ("Biskuit Cokelat", "Makanan", "bungkus", 4800, 6500, 20),
    ("Keripik Singkong", "Makanan", "bungkus", 5500, 8000, 18),
    ("Sarden Kaleng", "Makanan", "kaleng", 11000, 14500, 12),
    ("Kopi Bubuk 200g", "Minuman", "bungkus", 15000, 22000, 16),
    ("Teh Celup", "Minuman", "kotak", 7000, 10000, 14),
    ("Susu UHT 1L", "Minuman", "kotak", 13500, 18000, 16),
    ("Air Mineral 600ml", "Minuman", "botol", 2200, 3500, 48),
    ("Sirup Cocopandan", "Minuman", "botol", 16000, 22000, 10),
    ("Sabun Cuci Piring", "Perawatan", "botol", 9000, 12500, 14),
    ("Deterjen Sachet", "Perawatan", "bungkus", 1800, 2800, 30),
    ("Sabun Mandi", "Perawatan", "pcs", 3200, 5000, 22),
    ("Pasta Gigi", "Perawatan", "pcs", 7000, 10500, 14),
    ("Tisu Wajah", "Lainnya", "bungkus", 6500, 9000, 16),
    ("Baterai AA", "Lainnya", "pcs", 3500, 5500, 12),
    ("Rokok Filter", "Lainnya", "bungkus", 16000, 19000, 24),
    ("Kantong Plastik", "Lainnya", "pak", 6000, 9000, 18),
]


def main() -> None:
    Base.metadata.create_all(engine)
    now = datetime.now(timezone.utc).replace(microsecond=0)

    with SessionLocal.begin() as session:
        existing_count = session.scalar(
            select(func.count()).select_from(Product).where(Product.business_id == DEFAULT_BUSINESS_ID)
        )
        if existing_count:
            print("Demo data was not added because this database already contains products.")
            return

        business = session.get(Business, DEFAULT_BUSINESS_ID)
        if business is None:
            session.add(
                Business(
                    id=DEFAULT_BUSINESS_ID,
                    name="Toko Rina Jaya",
                    business_category="Toko Kelontong",
                    currency_code="IDR",
                )
            )

        suppliers = [
            Supplier(
                business_id=DEFAULT_BUSINESS_ID,
                name=name,
                contact=contact,
                product_category=category,
                average_delivery_days=delivery_days,
            )
            for name, contact, category, delivery_days in SUPPLIERS
        ]
        session.add_all(suppliers)
        session.flush()

        products: list[Product] = []
        initial_stock = 360
        opening_date = now - timedelta(days=51)
        for index, (name, category, unit, purchase_price, selling_price, minimum_stock) in enumerate(PRODUCTS):
            supplier = suppliers[index % len(suppliers)]
            product = Product(
                business_id=DEFAULT_BUSINESS_ID,
                supplier_id=supplier.id,
                name=name,
                category=category,
                unit=unit,
                purchase_price=purchase_price,
                selling_price=selling_price,
                current_stock=initial_stock,
                minimum_stock=minimum_stock,
            )
            products.append(product)
            session.add(product)
        session.flush()

        for product in products:
            session.add(
                InventoryMovement(
                    business_id=DEFAULT_BUSINESS_ID,
                    product_id=product.id,
                    supplier_id=product.supplier_id,
                    movement_type="stock_in",
                    quantity_delta=initial_stock,
                    stock_after=initial_stock,
                    reference_type="demo_opening_stock",
                    notes="Stok awal data demo",
                    created_at=opening_date,
                )
            )

        popular_products = products[:14] + [products[5], products[9], products[12], products[20]]
        payment_methods = ("Tunai", "QRIS", "Transfer", "Debit/Kredit")
        transaction_count = 0
        for days_ago in range(45, -1, -1):
            transaction_date = now - timedelta(days=days_ago)
            for transaction_index in range(RANDOM.randint(3, 6)):
                timestamp = transaction_date.replace(
                    hour=RANDOM.randint(8, 20), minute=RANDOM.choice((0, 10, 20, 30, 40, 50))
                )
                item_count = RANDOM.randint(1, 3)
                selected: list[Product] = []
                while len(selected) < item_count:
                    candidate = RANDOM.choice(popular_products)
                    if candidate not in selected:
                        selected.append(candidate)
                transaction = SalesTransaction(
                    business_id=DEFAULT_BUSINESS_ID,
                    transaction_date=timestamp,
                    payment_method=RANDOM.choice(payment_methods),
                    subtotal=0,
                    total_discount=0,
                    total_amount=0,
                    gross_profit=0,
                    notes="Transaksi demo" if transaction_index == 0 else None,
                    created_at=timestamp,
                )
                session.add(transaction)
                session.flush()

                subtotal = 0
                total_discount = 0
                gross_profit = 0
                for product in selected:
                    quantity = RANDOM.randint(1, 4)
                    item_subtotal = product.selling_price * quantity
                    discount = 500 if RANDOM.random() < 0.12 else 0
                    line_total = item_subtotal - discount
                    item_profit = (product.selling_price - product.purchase_price) * quantity - discount
                    session.add(
                        SalesTransactionItem(
                            transaction_id=transaction.id,
                            product_id=product.id,
                            product_name_snapshot=product.name,
                            quantity=quantity,
                            selling_price=product.selling_price,
                            purchase_price=product.purchase_price,
                            discount=discount,
                            line_total=line_total,
                        )
                    )
                    product.current_stock -= quantity
                    session.add(
                        InventoryMovement(
                            business_id=DEFAULT_BUSINESS_ID,
                            product_id=product.id,
                            movement_type="sale",
                            quantity_delta=-quantity,
                            stock_after=product.current_stock,
                            reference_type="sales_transaction",
                            reference_id=transaction.id,
                            notes=transaction.notes,
                            created_at=timestamp,
                        )
                    )
                    subtotal += item_subtotal
                    total_discount += discount
                    gross_profit += item_profit

                transaction.subtotal = subtotal
                transaction.total_discount = total_discount
                transaction.total_amount = subtotal - total_discount
                transaction.gross_profit = gross_profit
                transaction_count += 1

        low_stock_targets = {
            "Minyak Goreng 1L": 9,
            "Telur Ayam": 6,
            "Sirup Cocopandan": 0,
            "Baterai AA": 7,
        }
        for product in products:
            target = low_stock_targets.get(product.name)
            if target is None or product.current_stock == target:
                continue
            adjustment = target - product.current_stock
            product.current_stock = target
            session.add(
                InventoryMovement(
                    business_id=DEFAULT_BUSINESS_ID,
                    product_id=product.id,
                    movement_type="adjustment",
                    quantity_delta=adjustment,
                    stock_after=target,
                    reference_type="demo_stock_audit",
                    notes="Penyesuaian akhir data demo",
                    created_at=now - timedelta(hours=2),
                )
            )

    print(f"Seeded {len(SUPPLIERS)} suppliers, {len(PRODUCTS)} products, and {transaction_count} transactions.")


if __name__ == "__main__":
    main()
