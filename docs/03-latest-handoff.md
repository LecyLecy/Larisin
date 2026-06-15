# Latest Handoff

## Concise Handoff

Larisin is a new full-stack starter project for an Indonesian UMKM intelligence platform. Work is on `dev`; do not push, merge, or force anything without user approval.

## What Exists

- `frontend/`: Next.js 16.2.9 TypeScript app with Tailwind styling, app shell, dashboard, transactions, products, supplier, insight, reports, and settings routes.
- `backend/`: FastAPI app with health, analytics summary, products, and transactions endpoints using typed sample data.
- `database/`: readable initial schema direction for core operational tables.
- `docs/`: exactly 10 memory docs for AI continuity.
- `AGENTS.md`: safety and workflow instructions.

## What Works

- Frontend dependencies are installed. `npm run lint`, `npm run build`, and `npm audit --audit-level=moderate` pass.
- Backend dependencies are installed in `backend/.venv`. `python -m pytest` passes with 3 tests.
- Frontend should run with `npm run dev` from `frontend/`.
- Backend should run with `.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload` from `backend/`.
- API sample endpoints are available under `/api/v1`.

## Not Implemented Yet

- Auth and roles.
- PostgreSQL connection.
- Real CRUD persistence.
- ETL/analytics marts.
- ML forecasting.
- PDF/Excel export.
- Production deployment settings.

## Next Recommended Actions

1. Add database migrations after choosing migration tooling.
2. Implement products and transactions persistence.
3. Add auth after core data flow is stable.
4. Ask the user whether to push `dev` to `origin`.

## What To Ask User For Next

- Logo file for `frontend/public/brand/larisin-icon.png`.
- Preferred first real business category/sample dataset.
- Whether to push the initial commit to the configured remote.
