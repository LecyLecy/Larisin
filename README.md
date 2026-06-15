# Larisin

Larisin is a UMKM/Koperasi intelligence platform for Indonesian small businesses. It helps shop owners record sales and stock, then turns those records into practical insight: best-selling products, gross profit, low-stock warnings, and restock recommendations.

## Problem

Many Indonesian UMKM, warungs, food sellers, small cooperatives, and resellers still use notebooks, WhatsApp, Excel, or scattered notes. This makes it hard to know which products sell well, which products are profitable, which stock is running low, and what should be restocked next.

## Target Users

- UMKM owners and small shop owners.
- Koperasi staff.
- Food sellers, resellers, and small retail operators.
- Store staff who input transactions.
- Owners/admins who review sales, profit, stock, and reports.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, npm.
- Backend: FastAPI, Python 3.11+, Uvicorn, Pydantic.
- Database direction: PostgreSQL on Railway.
- Deployment direction: Vercel for frontend, Railway for backend and PostgreSQL.

## Current MVP Status

This repository contains a runnable starter MVP:

- Frontend app shell with Dashboard, Transaksi, Produk & Stok, Supplier, Insight, Laporan, and Pengaturan routes.
- Dashboard UI with Indonesian sample data and graceful API fallback.
- FastAPI backend with `/health`, `/api/v1/analytics/summary`, `/api/v1/products`, and `/api/v1/transactions`.
- Database planning SQL for core operational tables.
- AI continuity docs in `docs/`.

Auth, real database persistence, full CRUD, ML forecasting, exports, payments, and production analytics are intentionally deferred.

## Local Setup

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

### Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Open `http://localhost:8000/health`.

## Environment Variables

Root `.env.example` documents the shared deployment assumptions. Each app also has its own example:

- `frontend/.env.example`
- `backend/.env.example`

No real secrets are committed.

## Project Structure

```text
.
|-- AGENTS.md
|-- README.md
|-- docs/
|-- frontend/
|-- backend/
|-- database/
`-- scripts/
```

See `docs/06-folder-and-file-map.md` for the detailed map.

## Current Limitations

- Sample data only.
- No real authentication or roles yet.
- No database connection is required for the starter app.
- No production BI/ETL pipeline yet.
- Logo image is expected later at `frontend/public/brand/larisin-icon.png`.

## Next Steps

1. Add PostgreSQL connection and migrations.
2. Implement product and transaction persistence.
3. Add auth with Owner/Staff role rules.
4. Convert dashboard sample data into SQL-backed analytics.
5. Add import/export and reporting after core data is stable.

**Assumption:** Railway PostgreSQL will be used for the first production database.
