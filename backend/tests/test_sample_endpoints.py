from fastapi.testclient import TestClient

from app.db.session import SessionLocal
from app.main import app
from app.models import InventoryMovement


client = TestClient(app)


def test_products_endpoint_starts_empty() -> None:
    response = client.get("/api/v1/products")

    assert response.status_code == 200
    assert response.json() == []


def test_create_product_persists_and_calculates_status() -> None:
    payload = {
        "name": "Beras Ramos 5kg",
        "category": "Sembako",
        "unit": "karung",
        "purchase_price": 58000,
        "selling_price": 68000,
        "current_stock": 8,
        "minimum_stock": 10,
    }

    create_response = client.post("/api/v1/products", json=payload)

    assert create_response.status_code == 201
    assert create_response.json()["status"] == "Menipis"

    list_response = client.get("/api/v1/products")
    assert list_response.status_code == 200
    assert [product["name"] for product in list_response.json()] == ["Beras Ramos 5kg"]


def test_create_product_rejects_duplicate_name_case_insensitively() -> None:
    payload = {
        "name": "Minyak Goreng 1L",
        "category": "Sembako",
        "unit": "botol",
        "purchase_price": 14500,
        "selling_price": 17000,
        "current_stock": 5,
        "minimum_stock": 6,
    }
    client.post("/api/v1/products", json=payload)

    duplicate_response = client.post(
        "/api/v1/products",
        json={**payload, "name": "minyak goreng 1l"},
    )

    assert duplicate_response.status_code == 409
    assert duplicate_response.json()["detail"] == "Produk dengan nama tersebut sudah ada."


def test_create_product_rejects_negative_stock() -> None:
    response = client.post(
        "/api/v1/products",
        json={
            "name": "Gula Pasir 1kg",
            "category": "Sembako",
            "unit": "bungkus",
            "purchase_price": 15000,
            "selling_price": 17500,
            "current_stock": -1,
            "minimum_stock": 5,
        },
    )

    assert response.status_code == 422


def test_edit_and_deactivate_product() -> None:
    product = client.post(
        "/api/v1/products",
        json={
            "name": "Beras Premium",
            "category": "Sembako",
            "unit": "karung",
            "purchase_price": 60000,
            "selling_price": 70000,
            "current_stock": 4,
            "minimum_stock": 2,
        },
    ).json()

    edit_response = client.patch(
        f"/api/v1/products/{product['id']}",
        json={
            "name": "Beras Premium 5kg",
            "category": "Sembako",
            "unit": "karung",
            "purchase_price": 62000,
            "selling_price": 73000,
            "minimum_stock": 3,
        },
    )

    assert edit_response.status_code == 200
    assert edit_response.json()["name"] == "Beras Premium 5kg"
    assert edit_response.json()["current_stock"] == 4
    deactivate_response = client.delete(f"/api/v1/products/{product['id']}")
    assert deactivate_response.status_code == 204
    assert client.get("/api/v1/products").json() == []


def test_stock_adjustment_records_reason_and_rejects_negative_stock() -> None:
    product = client.post(
        "/api/v1/products",
        json={
            "name": "Telur Ayam",
            "category": "Sembako",
            "unit": "pcs",
            "purchase_price": 1800,
            "selling_price": 2300,
            "current_stock": 5,
            "minimum_stock": 2,
        },
    ).json()

    response = client.post(
        f"/api/v1/inventory/products/{product['id']}/adjustment",
        json={"quantity_delta": -2, "notes": "Barang rusak"},
    )

    assert response.status_code == 201
    assert response.json()["product"]["current_stock"] == 3
    assert response.json()["movement"]["movement_type"] == "adjustment"
    assert response.json()["movement"]["notes"] == "Barang rusak"
    rejected = client.post(
        f"/api/v1/inventory/products/{product['id']}/adjustment",
        json={"quantity_delta": -4, "notes": "Hitung ulang"},
    )
    assert rejected.status_code == 409
    assert client.get("/api/v1/products").json()[0]["current_stock"] == 3


def test_business_profile_can_be_updated() -> None:
    response = client.patch(
        "/api/v1/business/profile",
        json={"name": "Warung Ceria", "business_category": "Warung Makan"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "name": "Warung Ceria",
        "business_category": "Warung Makan",
        "currency_code": "IDR",
    }
    assert client.get("/api/v1/business/profile").json()["name"] == "Warung Ceria"


def test_stock_in_updates_product_and_records_inventory_movement() -> None:
    product = client.post(
        "/api/v1/products",
        json={
            "name": "Biskuit Cokelat",
            "category": "Makanan",
            "unit": "bungkus",
            "purchase_price": 4000,
            "selling_price": 6000,
            "current_stock": 2,
            "minimum_stock": 3,
        },
    ).json()

    response = client.post(
        f"/api/v1/inventory/products/{product['id']}/stock-in",
        json={"quantity": 10, "notes": "Restock dari pemasok"},
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload["product"]["current_stock"] == 12
    assert payload["product"]["status"] == "Aman"
    assert payload["movement"]["movement_type"] == "stock_in"
    assert payload["movement"]["quantity_delta"] == 10
    assert payload["movement"]["stock_after"] == 12

    movements = client.get("/api/v1/inventory/movements")
    assert movements.status_code == 200
    assert movements.json()[0]["product_name"] == "Biskuit Cokelat"
    assert movements.json()[0]["notes"] == "Restock dari pemasok"


def test_stock_in_rejects_unknown_product() -> None:
    response = client.post(
        "/api/v1/inventory/products/00000000-0000-0000-0000-000000000099/stock-in",
        json={"quantity": 2},
    )

    assert response.status_code == 404


def test_create_supplier_persists_and_rejects_duplicate_name() -> None:
    payload = {
        "name": "CV Sumber Makmur",
        "contact": "0812-3456-7890",
        "product_category": "Makanan",
        "average_delivery_days": 2,
    }

    response = client.post("/api/v1/suppliers", json=payload)

    assert response.status_code == 201
    assert response.json()["name"] == "CV Sumber Makmur"
    assert client.get("/api/v1/suppliers").json()[0]["contact"] == "0812-3456-7890"
    duplicate = client.post("/api/v1/suppliers", json={**payload, "name": "cv sumber makmur"})
    assert duplicate.status_code == 409


def test_stock_in_records_selected_supplier() -> None:
    supplier = client.post("/api/v1/suppliers", json={"name": "PT Pasok Lancar"}).json()
    product = client.post(
        "/api/v1/products",
        json={
            "name": "Saus Sambal",
            "category": "Makanan",
            "unit": "botol",
            "purchase_price": 7000,
            "selling_price": 10000,
            "current_stock": 2,
            "minimum_stock": 1,
        },
    ).json()

    response = client.post(
        f"/api/v1/inventory/products/{product['id']}/stock-in",
        json={"quantity": 6, "supplier_id": supplier["id"]},
    )

    assert response.status_code == 201
    assert response.json()["movement"]["supplier_name"] == "PT Pasok Lancar"
    assert client.get("/api/v1/inventory/movements").json()[0]["supplier_name"] == "PT Pasok Lancar"


def test_create_transaction_persists_sale_and_reduces_stock() -> None:
    coffee = client.post(
        "/api/v1/products",
        json={
            "name": "Kopi Arabika",
            "category": "Minuman",
            "unit": "bungkus",
            "purchase_price": 18000,
            "selling_price": 25000,
            "current_stock": 10,
            "minimum_stock": 3,
        },
    ).json()
    tea = client.post(
        "/api/v1/products",
        json={
            "name": "Teh Melati",
            "category": "Minuman",
            "unit": "kotak",
            "purchase_price": 7000,
            "selling_price": 10000,
            "current_stock": 6,
            "minimum_stock": 2,
        },
    ).json()

    response = client.post(
        "/api/v1/transactions",
        json={
            "payment_method": "QRIS",
            "notes": "Pesanan meja depan",
            "items": [
                {"product_id": coffee["id"], "quantity": 2, "discount": 1000},
                {"product_id": tea["id"], "quantity": 3, "discount": 0},
            ],
        },
    )

    assert response.status_code == 201
    transaction = response.json()
    assert transaction["subtotal"] == 80000
    assert transaction["total_discount"] == 1000
    assert transaction["total_amount"] == 79000
    assert transaction["gross_profit"] == 22000
    assert transaction["total_quantity"] == 5
    assert [item["product_name"] for item in transaction["items"]] == [
        "Kopi Arabika",
        "Teh Melati",
    ]

    products = client.get("/api/v1/products").json()
    assert {product["name"]: product["current_stock"] for product in products} == {
        "Kopi Arabika": 8,
        "Teh Melati": 3,
    }

    with SessionLocal() as session:
        movements = session.query(InventoryMovement).order_by(InventoryMovement.created_at).all()
        assert [(movement.quantity_delta, movement.stock_after) for movement in movements] == [
            (-2, 8),
            (-3, 3),
        ]

    list_response = client.get("/api/v1/transactions")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1


def test_insufficient_stock_rolls_back_entire_transaction() -> None:
    available = client.post(
        "/api/v1/products",
        json={
            "name": "Gula Pasir 1kg",
            "category": "Sembako",
            "unit": "bungkus",
            "purchase_price": 15000,
            "selling_price": 17500,
            "current_stock": 5,
            "minimum_stock": 2,
        },
    ).json()
    limited = client.post(
        "/api/v1/products",
        json={
            "name": "Susu Kental",
            "category": "Minuman",
            "unit": "kaleng",
            "purchase_price": 8000,
            "selling_price": 10000,
            "current_stock": 1,
            "minimum_stock": 1,
        },
    ).json()

    response = client.post(
        "/api/v1/transactions",
        json={
            "payment_method": "Tunai",
            "items": [
                {"product_id": available["id"], "quantity": 2},
                {"product_id": limited["id"], "quantity": 2},
            ],
        },
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Stok Susu Kental tidak cukup. Tersedia 1."
    products = client.get("/api/v1/products").json()
    assert {product["name"]: product["current_stock"] for product in products} == {
        "Gula Pasir 1kg": 5,
        "Susu Kental": 1,
    }
    assert client.get("/api/v1/transactions").json() == []

    with SessionLocal() as session:
        assert session.query(InventoryMovement).count() == 0


def test_transaction_allows_a_discounted_sale_at_a_loss() -> None:
    product = client.post(
        "/api/v1/products",
        json={
            "name": "Roti Cokelat",
            "category": "Makanan",
            "unit": "pcs",
            "purchase_price": 9000,
            "selling_price": 10000,
            "current_stock": 3,
            "minimum_stock": 1,
        },
    ).json()

    response = client.post(
        "/api/v1/transactions",
        json={
            "payment_method": "Tunai",
            "items": [{"product_id": product["id"], "quantity": 1, "discount": 3000}],
        },
    )

    assert response.status_code == 201
    assert response.json()["gross_profit"] == -2000


def test_summary_endpoint_calculates_kpis_from_persisted_sales() -> None:
    product = client.post(
        "/api/v1/products",
        json={
            "name": "Mi Instan Goreng",
            "category": "Makanan",
            "unit": "pcs",
            "purchase_price": 2500,
            "selling_price": 3500,
            "current_stock": 4,
            "minimum_stock": 2,
        },
    ).json()
    transaction = client.post(
        "/api/v1/transactions",
        json={
            "payment_method": "Tunai",
            "items": [{"product_id": product["id"], "quantity": 2, "discount": 500}],
        },
    )
    assert transaction.status_code == 201

    response = client.get("/api/v1/analytics/summary")

    assert response.status_code == 200
    payload = response.json()
    assert payload["total_sales_today"] == 6500
    assert payload["gross_profit_today"] == 1500
    assert payload["transaction_count_today"] == 1
    assert payload["low_stock_count"] == 1
    assert len(payload["sales_trend"]) == 7
    assert payload["top_products"][0]["name"] == "Mi Instan Goreng"
    assert payload["low_stock_products"][0]["name"] == "Mi Instan Goreng"
    assert payload["recent_transactions"][0]["id"] == transaction.json()["id"]


def test_report_overview_uses_transaction_price_snapshots() -> None:
    product = client.post(
        "/api/v1/products",
        json={
            "name": "Keripik Singkong",
            "category": "Makanan",
            "unit": "bungkus",
            "purchase_price": 5000,
            "selling_price": 9000,
            "current_stock": 5,
            "minimum_stock": 1,
        },
    ).json()
    transaction = client.post(
        "/api/v1/transactions",
        json={
            "payment_method": "Tunai",
            "items": [{"product_id": product["id"], "quantity": 2, "discount": 1000}],
        },
    )
    assert transaction.status_code == 201

    response = client.get("/api/v1/reports/overview?days=7")

    assert response.status_code == 200
    payload = response.json()
    assert payload["total_sales"] == 17000
    assert payload["gross_profit"] == 7000
    assert payload["transaction_count"] == 1
    assert payload["total_quantity"] == 2
    assert payload["average_transaction_value"] == 17000
    assert len(payload["daily_sales"]) == 7
    assert payload["product_performance"] == [
        {
            "product_name": "Keripik Singkong",
            "category": "Makanan",
            "unit": "bungkus",
            "quantity_sold": 2,
            "transaction_count": 1,
            "net_sales": 17000,
            "gross_profit": 7000,
        }
    ]
