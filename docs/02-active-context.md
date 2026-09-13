# Active Context

## Current Setup Status

Initial repository setup is completed on `dev`. The project started nearly empty with only `README.md` and Git metadata.

## Current Branch

`main`

## Initialized

- Root documentation and safety files.
- Next.js 16.3.5 frontend in `frontend/`.
- FastAPI backend in `backend/`.
- Database planning folder in `database/`.
- Scripts folder in `scripts/`.
- Required 10 memory docs in `docs/`.
- PostgreSQL Compose service, SQLAlchemy models, and Alembic migrations for products, sales, and inventory movements.
- Database-backed `GET/POST /api/v1/products`.
- Functional Add Product modal with validation and responsive product list.
- Database-backed `GET/POST /api/v1/transactions` with stock locking, price snapshots, and inventory movement records.
- Functional multi-product sales cart with payment method, discount, and transaction history UI.
- Database-backed dashboard KPIs, sales trend, low-stock list, recent transactions, and rule-based recommendations.
- Database-backed stock-in endpoint, product restock modal, and inventory movement history.
- Database-backed reports for 7, 30, or 90 days: KPIs, daily sales trend, and product performance.
- Alembic migration `0003` with PostgreSQL views for daily sales and daily product performance; report aggregation uses these views on PostgreSQL and an equivalent SQLite path in automated tests.
- Database-backed suppliers with optional supplier attribution on stock-in movements.
- Product update/soft deactivate and stock-adjustment flows; adjustments require a reason and are recorded in the inventory ledger.
- Database-backed business profile settings and Insight view based on live dashboard analytics.
- Deterministic development seed script at `scripts/seed_demo_data.py`; it fills only an empty database and preserves manually entered data.
- Portfolio-ready English README with verified Dashboard and Reports screenshots in `docs/images/`, plus implementation-backed Mermaid diagrams.

## Verification Results

- Frontend dependencies installed with npm.
- Backend dependencies installed in `backend/.venv` using Python 3.11.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm audit --audit-level=moderate`: passed with 0 vulnerabilities after PostCSS and Sharp security overrides.
- `python -m pytest`: passed, 18 tests.
- `python -m alembic history --verbose`: passed; `0004` is the head revision.
- Product, transaction, and dashboard implementation verification: frontend lint/build passed.
- Browser flow verified on desktop/mobile; WCAG A/AA audit reported 0 violations after contrast fix.
- Transaction browser flow verified against an isolated temporary SQLite database: save, success state, sale history, stock reduction, and inventory movement all succeeded.
- Dashboard browser flow verified against the same temporary database with actual sales, profit, trend, recommendation, and stock values.
- Stock-in browser flow verified against the same temporary database: restock changed `Kopi Uji` from 6 to 18 units and wrote a dated movement record.
- Reports browser flow verified against the same temporary database: all 7-day KPI, trend, and product-performance values matched the saved sale.
- Supplier browser flow verified against a new isolated temporary SQLite database: supplier creation, supplier selection during restock, stock update, and supplier-labelled movement history succeeded.
- Product browser flow verified against the same temporary database: a `-3` audited stock adjustment changed 10 to 7 and wrote a movement, then a product price edit updated the table without changing stock.
- Settings browser flow verified: saving profile changed both the form state and header name to `Warung Larisin Uji`; Insight browser flow verified its recommendation and empty states with no console errors.
- Local development server check passed: frontend at `http://localhost:3000` is connected to FastAPI at `http://localhost:8000` using the persistent SQLite fallback database. The seeded dashboard shows 5 suppliers, 22 products, 209 transactions across 46 days, and 4 deliberate low-stock alerts; browser console was clean.

## Current Next Priority

Start Docker Desktop and verify the complete migration chain on PostgreSQL, then add authentication before real sensitive data is used. The local SQLite demo dataset can be regenerated only after choosing or creating a fresh empty database.

## Important User Decisions

- App name: Larisin.
- Deployment: Vercel + Railway.
- Backend: FastAPI.
- Frontend: Next.js.
- Database: Railway PostgreSQL assumption.
- Logo: the circular Larisin logo is available at `frontend/public/brand/larisin-icon.png` and is used by the app shell.

## Assumptions

- **Assumption:** Authentication is deferred until after the sample-data MVP is running.
- **Assumption:** npm is the frontend package manager.
- **Assumption:** pip + `requirements.txt` is enough for backend dependency management.
- **Assumption:** The PostCSS and Sharp npm overrides should be kept until Next no longer needs them for audit cleanliness.
- **Known local blocker:** Docker Desktop's service must be started by an elevated Windows session before migrations `0001` through `0004` can be applied to local PostgreSQL and the analytics views can be integration-tested.
