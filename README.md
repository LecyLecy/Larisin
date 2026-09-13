<div align="center">

<img src="./frontend/public/brand/larisin-icon.png" alt="Larisin logo" width="88" />

# Larisin

### Operational intelligence for Indonesian UMKM

Larisin helps small businesses record sales and inventory, then turns that operational data into practical signals for day-to-day decisions.

[Documentation](./docs/01-project-overview.md) · [Source Code](https://github.com/LecyLecy/Larisin)

</div>

## Overview

Larisin is a full-stack web application for Indonesian UMKM, cooperatives, and small retail operators. It addresses a common problem: sales, stock, and supplier details are often spread across notebooks, chat messages, and spreadsheets, making it difficult to identify profitable products or act before stock runs out.

The application provides one operational workflow: maintain products and suppliers, record a sale, update stock in the same database transaction, and read the resulting sales, profit, inventory, and restock signals in the Dashboard, Insight, and Reports pages.

The project deliberately starts with rule-based insights rather than machine learning. Reliable transaction and inventory data is a prerequisite for a credible forecasting or ML feature.

## Application Preview

![Larisin dashboard showing live sales KPIs, a seven-day trend, recommendations, low-stock products, and recent transactions.](./docs/images/dashboard-preview.png)

The Dashboard uses persisted operational data to show daily sales, gross profit, transaction count, low-stock products, a seven-day sales trend, and action-focused recommendations.

![Larisin reports page showing 30-day KPI cards, a daily sales chart, and product-performance data.](./docs/images/reports-preview.png)

The Reports page offers 7, 30, and 90-day views with sales, gross profit, transaction count, average transaction value, daily trend data, and product performance.

## Product Experience

- Record multi-product sales with payment method, per-item discount, and optional notes.
- Reduce stock atomically when a sale is saved, while preserving an inventory movement record.
- Maintain products, purchase prices, selling prices, stock thresholds, and active status.
- Receive stock from an optional saved supplier and retain supplier-labelled inventory history.
- Correct physical stock with an auditable positive or negative adjustment and a required reason.
- Review daily sales, gross profit, popular products, low-stock alerts, and rule-based recommendations.
- Compare sales and product performance over 7, 30, or 90 days.
- Update the default business name and category from the settings page.

## How It Works

```mermaid
flowchart LR
    UI["Next.js user interface"] -->|"HTTP / JSON"| API["FastAPI API"]
    API -->|"SQLAlchemy + Alembic"| DB[("PostgreSQL")]
    DB --> MARTS["SQL views for analytics"]
    MARTS --> UI
```

The UI calls the FastAPI API through `NEXT_PUBLIC_API_BASE_URL`. The API validates requests, applies business rules, and persists operations through SQLAlchemy. Alembic owns schema changes. PostgreSQL views provide the report layer in the intended production database, while the test suite exercises equivalent aggregation against SQLite.

### Sale and Inventory Flow

```mermaid
sequenceDiagram
    participant Staff as Staff UI
    participant API as FastAPI
    participant DB as Database

    Staff->>API: Submit product IDs, quantities, discounts, and payment method
    API->>DB: Lock selected product rows
    DB-->>API: Current stock and prices
    API->>API: Validate availability and calculate totals
    API->>DB: Create sale, price snapshots, and stock movements
    API->>DB: Reduce product stock and commit together
    DB-->>API: Saved transaction
    API-->>Staff: Updated transaction and totals
```

This single transaction protects inventory consistency under concurrent sales. Each sale item stores the selling and purchase prices at the time of sale, so later product-price edits do not rewrite historical report results.

## Technical Architecture

### Frontend

The Next.js frontend uses React, TypeScript, and Tailwind CSS. It provides responsive desktop sidebar and mobile navigation for Dashboard, Transaksi, Produk & Stok, Supplier, Insight, Laporan, and Pengaturan. API failures fall back to clear loading, empty, or error states where applicable.

### Backend and API

FastAPI exposes a versioned API under `/api/v1` for analytics, products, transactions, inventory, reports, suppliers, and the default business profile. Pydantic schemas validate request and response shapes. Local development accepts `localhost` and `127.0.0.1` origins through configured CORS middleware.

### Data Model and Reporting

The core operational tables are `businesses`, `products`, `suppliers`, `sales_transactions`, `sales_transaction_items`, and `inventory_movements`. The schema enforces non-negative product stock and prices, positive item quantities, and valid inventory movement balances. Products are soft-deactivated so historical sales can remain intact.

For PostgreSQL, Alembic migration `0003` creates two live SQL views:

- `mart_daily_sales_summary`, used for daily sales, profit, discount, and transaction aggregates.
- `mart_product_daily_performance`, used for product-level sales and gross-profit analysis.

These are ordinary views, not materialized views. That choice keeps reports current without introducing a refresh job before real usage has established a performance need.

## Technology

| Area | Tools |
| --- | --- |
| Interface | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | FastAPI, Pydantic, Uvicorn |
| Data and migrations | PostgreSQL, SQLAlchemy, Alembic |
| Local infrastructure | Docker Compose, PostgreSQL 16 |
| Testing and quality | pytest, httpx, ESLint, Next.js production build |
| Deployment direction | Vercel for the frontend, Railway for the FastAPI service and PostgreSQL |

## Repository Structure

```text
.
├── frontend/
│   ├── public/brand/          # Larisin logo asset
│   └── src/
│       ├── app/               # Next.js routes
│       ├── components/        # UI views and modal workflows
│       └── lib/               # API client, types, formatters
├── backend/
│   ├── alembic/               # Database migrations
│   ├── app/
│   │   ├── api/v1/            # FastAPI route modules
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic contracts
│   │   └── services/          # Transaction, inventory, report logic
│   └── tests/                 # API and business-rule tests
├── database/                  # Readable schema and analytics SQL references
├── docs/                      # Architecture, API, UI, and maintenance notes
├── scripts/seed_demo_data.py  # Non-destructive local demo-data seed script
└── compose.yaml               # Local PostgreSQL service
```

## Run Locally

### Prerequisites

- Node.js and npm.
- Python 3.11 or newer.
- Docker Desktop, for the local PostgreSQL service.

### 1. Start PostgreSQL

From the repository root:

```powershell
docker compose up -d postgres
docker compose ps
```

The local database listens on port `5433`.

### 2. Start the backend

```powershell
cd backend
Copy-Item .env.example .env
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m alembic upgrade head
uvicorn app.main:app --reload
```

The API health check is available at `http://localhost:8000/health`, and interactive API documentation is available at `http://localhost:8000/docs`.

### 3. Start the frontend

Open a second terminal from the repository root:

```powershell
cd frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

### Optional: Populate a fresh development database

From the repository root, the seed script creates deterministic suppliers, products, transactions, inventory movements, discount cases, and low-stock alerts. It exits without changing anything if the configured database already contains products.

```powershell
$env:DATABASE_URL = "postgresql+psycopg://larisin:larisin_local@localhost:5433/larisin"
.\backend\.venv\Scripts\python.exe .\scripts\seed_demo_data.py
```

Do not run this script against a real business database.

## Testing and Validation

The repository includes API and business-rule tests for health checks, local CORS, products, suppliers, stock-in, stock adjustments, transactions, inventory movements, analytics, and reports.

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest

cd ..\frontend
npm run lint
npm run build
```

The latest recorded project checks passed with 18 pytest tests, frontend linting, and a Next.js production build. Browser flows have also been checked against an isolated SQLite database for transactions, stock-in, reports, suppliers, product updates, settings, and Insight behavior.

## Limitations

- Authentication and Owner or Staff roles are not implemented.
- No real business dataset is included. The seed script is for development and demonstration only.
- ML forecasting is intentionally not implemented. Rule-based recommendations are the current baseline.
- Scheduled ETL or ELT jobs, imports, exports, purchase orders, and return workflows are not implemented.
- PostgreSQL analytics views are implemented, but the complete migration chain still needs local Docker PostgreSQL integration verification.
- Deployment settings are a direction, not a published production deployment.

## Future Improvements

1. Verify the full migration and analytics-view chain against local PostgreSQL, then deploy the API and database to Railway.
2. Add authentication and owner or staff permissions before connecting sensitive real business data.
3. Add import and export workflows after report formats and data-cleaning requirements are defined.
4. Introduce scheduled data transformations only when transaction volume and reporting needs justify them.
5. Build a simple demand-forecasting baseline only after collecting sufficient clean historical sales and stock data, then compare it against the existing rule-based approach.

## Data, Attribution, and License

No external dataset or ML model is bundled with this repository. `scripts/seed_demo_data.py` generates deterministic demo operational data for local development. The repository includes the Larisin logo asset under `frontend/public/brand/` and the UI screenshots used above under `docs/images/`.

No license file is currently present in the repository.
