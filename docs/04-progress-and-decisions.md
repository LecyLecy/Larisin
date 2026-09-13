# Progress and Decisions

## Decision Log

- Initialized monorepo-style project with `frontend/`, `backend/`, `database/`, `docs/`, and `scripts/`.
- Chose custom Tailwind components instead of shadcn setup for the smallest safe runnable start.
- Used sample data in both frontend fallback and backend services.
- Deferred auth, ML, ETL, exports, and full CRUD.
- Used npm overrides for patched PostCSS and Sharp releases so the Next.js install passes `npm audit`; the Sharp override was accepted only after a successful production build.
- Chose PostgreSQL via Docker Compose for reproducible local development, on port `5433` to avoid host conflicts.
- Chose Alembic migrations instead of creating tables at application startup.
- Implemented product persistence as the first vertical slice before transaction/inventory complexity.
- Stock status is derived from stock values rather than stored, preventing inconsistent state.
- Implemented sales as an atomic database transaction: lock product rows, validate stock, snapshot prices, insert the sale and items, reduce stock, and write inventory movements together.
- Kept gross profit allowed to be negative because discounts or clearance sales can create a valid business loss.
- Added Mermaid architecture, data-model, and UI-flow diagrams to keep the product and data-engineering design visible.
- Replaced dashboard mock KPIs with direct operational aggregation before adding marts or ML, so every dashboard figure is traceable to a sale or current stock level.
- Reused the existing inventory movement ledger for stock-in instead of adding a separate restock table. The stock balance update and its `stock_in` movement are committed in one database transaction.
- Implemented Reports from transaction snapshots before creating marts. This gives a verified user-facing baseline whose results can later be compared against the SQL-view implementation.
- Added ordinary PostgreSQL views, rather than materialized views, for the first marts. At current scale this preserves live reports without refresh scheduling; materialization should be reconsidered only after measuring a meaningful dataset.
- Modelled suppliers as their own entity and linked them to a stock-in movement, rather than storing free-text supplier names. This keeps the restock history suitable for later supplier analysis.
- Kept edits to product metadata separate from stock changes. Physical-count corrections use a mandatory-reason adjustment movement so stock history remains auditable.
- Reused the default business row as the first settings profile. This avoids premature multi-tenant configuration while making branding data persistent and ready for later authentication.
- Added a deterministic database seed script rather than more frontend-only mock state. Its sample suppliers, products, sales, stock movements, discount cases, and low-stock alerts make the same operational data flow visible across dashboard, transactions, inventory, insight, and reports. It refuses to run against a database that already has products.

## Why Vercel + Railway

Vercel gives a simple deployment path for Next.js. Railway can host the FastAPI backend and PostgreSQL database with minimal infrastructure overhead.

## Why FastAPI

FastAPI is Python-native, typed with Pydantic, fast to develop, and keeps a clear path toward future analytics and data engineering work.

## Why Next.js

Next.js gives a production-friendly React structure, TypeScript support, routing, and an easy Vercel deployment path.

## Why No ML Initially

The initial product needs clean sales, stock, and product data first. Rule-based recommendations are a better first step until enough real transaction history exists.

## Why Auth Is Deferred

Auth adds security and product complexity. The starter implementation focuses on making the core data flow and UI direction runnable first.

## Why Sample Data

Sample data makes the dashboard useful early while keeping the backend and database integration simple and safe.
