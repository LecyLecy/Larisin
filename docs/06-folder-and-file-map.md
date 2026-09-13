# Folder and File Map

## Map

```text
.
|-- AGENTS.md
|-- README.md
|-- .env.example
|-- docs/
|-- frontend/
|   |-- package.json
|   |-- src/app/
|   |-- src/components/
|   `-- src/lib/
|-- backend/
|   |-- requirements.txt
|   |-- alembic/
|   |-- app/main.py
|   |-- app/api/v1/
|   |-- app/schemas/
|   `-- app/services/
|-- database/
|   |-- README.md
|   `-- initial_schema.sql
`-- scripts/
```

## Major Purposes

- `frontend/src/app/`: Next.js routes and layout.
- `frontend/src/components/`: reusable UI components.
- `frontend/src/lib/`: API client, sample data, formatting helpers.
- `backend/app/main.py`: FastAPI app setup and CORS.
- `backend/app/api/v1/`: route modules.
- `backend/app/schemas/`: Pydantic response/request models.
- `backend/app/services/`: sample services and future business logic.
- `backend/app/services/inventory.py`: atomic stock-in and inventory movement queries.
- `backend/app/services/reports.py`: date-range report aggregation from transaction snapshots.
- `backend/app/services/suppliers.py`: supplier list/create rules.
- `backend/app/services/business.py`: default business profile read/write rules.
- `frontend/src/components/product-edit-modal.tsx`: product metadata update and soft-deactivation confirmation.
- `frontend/src/components/stock-adjustment-modal.tsx`: audited physical-stock adjustment UI.
- `backend/alembic/`: executable database migrations.
- `backend/app/models/`: SQLAlchemy database models.
- `backend/app/models/sales.py`: sales, sale-item snapshots, and inventory-movement models.
- `backend/app/db/`: engine and session dependency.
- `database/initial_schema.sql`: initial PostgreSQL schema direction.
- `scripts/seed_demo_data.py`: fills an empty development database with deterministic, realistic demo operational data; it does not overwrite existing product data.
- `docs/`: AI continuity and maintenance docs.
- `docs/images/`: verified Dashboard and Reports screenshots used in the repository README.

## Where To Modify

- UI labels/layout: `frontend/src/app/` and `frontend/src/components/`.
- API endpoints: `backend/app/api/v1/`.
- Backend response shapes: `backend/app/schemas/`.
- Transaction rules: `backend/app/services/transactions.py`.
- Stock-in rules: `backend/app/services/inventory.py`.
- Report metrics: `backend/app/services/reports.py` and `frontend/src/components/reports-view.tsx`.
- Supplier UI: `frontend/src/components/supplier-view.tsx`; stock-in supplier validation: `backend/app/services/inventory.py`.
- Product metadata and soft deactivation: `backend/app/services/products.py`; stock correction: `backend/app/services/inventory.py`.
- Business profile: `backend/app/services/business.py` and `frontend/src/components/settings-view.tsx`; decisions UI: `frontend/src/components/insight-view.tsx`.
- Sample backend data: `backend/app/services/sample_data.py`.
- Database schema: `database/initial_schema.sql`.

## Future LLM Inspection Guide

- For setup issues: read `README.md` and `docs/09-commands-tests-and-debugging.md`.
- For product intent: read `docs/01-project-overview.md`.
- For current state: read `docs/02-active-context.md` and `docs/03-latest-handoff.md`.
- For API changes: inspect `docs/07-api-and-data-contract.md`, then backend routers/schemas.
- For UI changes: inspect `docs/08-ui-routes-and-components.md`, then frontend routes/components.
