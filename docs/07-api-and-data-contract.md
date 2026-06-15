# API and Data Contract

## Current Endpoints

- `GET /health`
- `GET /api/v1/analytics/summary`
- `GET /api/v1/products`
- `GET /api/v1/transactions`

## Planned Endpoints

- `POST /api/v1/products`
- `POST /api/v1/transactions`
- `GET /api/v1/inventory/status`
- `GET /api/v1/insights/recommendations`
- Future auth endpoints for login/session management.

## Current Sample Shapes

Analytics summary:

```json
{
  "total_sales_today": 2450000,
  "gross_profit_today": 620000,
  "transaction_count_today": 38,
  "low_stock_count": 7,
  "top_products": [],
  "recommendations": []
}
```

Product:

```json
{
  "id": "prd-beras-5kg",
  "name": "Beras Ramos 5kg",
  "category": "Sembako",
  "unit": "karung",
  "purchase_price": 58000,
  "selling_price": 68000,
  "current_stock": 8,
  "minimum_stock": 10,
  "status": "Menipis"
}
```

Transaction:

```json
{
  "id": "trx-001",
  "date": "2026-06-16",
  "product_name": "Beras Ramos 5kg",
  "quantity": 2,
  "selling_price": 68000,
  "discount": 0,
  "payment_method": "Tunai",
  "notes": "Sample data"
}
```

## Data Model Direction

Operational tables:

- `businesses`
- `users`
- `suppliers`
- `products`
- `sales_transactions`
- `sales_transaction_items`
- `inventory_movements`
- `purchase_orders`, future

Analytics tables/views:

- `dim_product`
- `dim_supplier`
- `dim_date`
- `fact_sales`
- `fact_inventory`
- `mart_daily_sales_summary`
- `mart_product_performance`
- `mart_low_stock_alerts`
- `mart_restock_recommendations`

## Validation Rules

- Product stock cannot be negative unless admin override is added later.
- Purchase and selling prices must be greater than or equal to 0.
- Low stock when `current_stock <= minimum_stock`.
- Out of stock when `current_stock <= 0`.
- Gross profit is `(selling_price - purchase_price) * quantity`.
- Margin calculations must handle division by zero.

## Error Response Direction

Use standard FastAPI HTTP errors initially:

```json
{ "detail": "Readable Indonesian or technical-safe error message" }
```

Future APIs should use consistent error codes for frontend display.
