from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_products_endpoint_returns_sample_products() -> None:
    response = client.get("/api/v1/products")

    assert response.status_code == 200
    assert response.json()[0]["name"] == "Beras Ramos 5kg"


def test_summary_endpoint_returns_kpis() -> None:
    response = client.get("/api/v1/analytics/summary")

    assert response.status_code == 200
    payload = response.json()
    assert payload["total_sales_today"] == 2450000
    assert len(payload["recommendations"]) >= 1
