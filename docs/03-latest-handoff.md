# Latest Handoff

## Concise Handoff

Larisin is a new full-stack starter project for an Indonesian UMKM intelligence platform. Current work is on `codex/larisin-mvp`; do not merge or force anything without user approval.

## What Exists

- `frontend/`: Next.js 16.3.5 TypeScript app with Tailwind styling, app shell, dashboard, transactions, products, supplier, insight, reports, and settings routes.
- `backend/`: FastAPI app; products, sales transactions, and dashboard analytics are database-backed.
- `compose.yaml`: isolated local PostgreSQL on port `5433`.
- `database/`: readable initial schema direction for core operational tables.
- `docs/`: exactly 10 memory docs for AI continuity.
- `AGENTS.md`: safety and workflow instructions.
- `scripts/seed_demo_data.py`: deterministic local demo data generator that exits without writes when products already exist.
- `README.md`: portfolio-facing project overview, local setup, limitations, test evidence, Mermaid architecture, and verified UI previews.
- `docs/images/`: Dashboard and Reports screenshots used by the README.

## What Works

- Frontend dependencies are installed. `npm run lint`, `npm run build`, and `npm audit --audit-level=moderate` pass.
- Backend dependencies are installed in `backend/.venv`. `python -m pytest` passes with 18 tests.
- Frontend should run with `npm run dev` from `frontend/`.
- Backend should run with `.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload` from `backend/`.
- API endpoints are available under `/api/v1`.
- `GET/POST /api/v1/products` persist products and calculate stock status.
- Add Product UI is functional and browser-verified.
- `GET/POST /api/v1/transactions` persist sales, snapshot prices, atomically reduce stock, and write inventory movements.
- Add Transaction UI is functional and browser-verified with an isolated temporary database.
- Dashboard aggregates current operational data into live KPIs, trend, stock status, recent sales, and recommendations.
- `GET /api/v1/inventory/movements` returns the latest movement history.
- `POST /api/v1/inventory/products/{product_id}/stock-in` atomically increases stock and creates a movement record; the Products UI is browser-verified for this flow.
- `GET /api/v1/reports/overview?days=7|30|90` returns date-range KPIs, daily trend, and product performance using transaction price snapshots. The Reports route is browser-verified.
- Alembic `0003` creates `mart_daily_sales_summary` and `mart_product_daily_performance`. On PostgreSQL, reports read these views; SQLite tests exercise an equivalent aggregation path.
- `GET/POST /api/v1/suppliers` persist supplier details. A stock-in can reference a supplier, and the movement history displays its name.
- `PATCH/DELETE /api/v1/products/{id}` edit or soft-deactivate a product. `POST /api/v1/inventory/products/{id}/adjustment` requires an audit reason, locks the product, and writes an adjustment movement without permitting negative stock.
- `GET/PATCH /api/v1/business/profile` persists the business name and category. The settings form refreshes the app shell so its header uses the saved name; Insight is a live analytics-derived screen.
- The active local demo dataset contains 5 suppliers, 22 products, 209 sales transactions over 46 days, and 4 intentional low-stock items. It is database-backed rather than frontend-only mock data.

## Not Implemented Yet

- Auth and roles.
- ML forecasting.
- PDF/Excel export.
- Production deployment settings.

## Next Recommended Actions

1. Start Docker Desktop, run `python -m alembic upgrade head`, and verify analytics views on local PostgreSQL.
2. Add auth after the core data flow is stable and before using sensitive real data.
3. Add export only after deciding the report formats users genuinely need.

## What To Ask User For Next

- Preferred first real business category/sample dataset when analytics work begins.
- Whether to push the completed vertical slice to the configured remote.

## Current Local Blocker

- Docker Desktop was launched but its daemon did not become reachable. Unit tests and browser verification pass against the persistent SQLite fallback at `C:\Users\<user>\AppData\Local\Larisin\larisin-local.db`; run `docker compose up -d postgres` followed by `python -m alembic upgrade head` after Docker is healthy to apply migrations through `0004` and verify the analytics views locally.

## Local Demo Command

With `DATABASE_URL` set to an empty development database, run from the repository root:

```powershell
.\backend\.venv\Scripts\python.exe .\scripts\seed_demo_data.py
```

The script is intentionally non-destructive: it detects existing products and exits without modifying the database.
