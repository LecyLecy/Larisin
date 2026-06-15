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
- `database/initial_schema.sql`: initial PostgreSQL schema direction.
- `docs/`: AI continuity and maintenance docs.

## Where To Modify

- UI labels/layout: `frontend/src/app/` and `frontend/src/components/`.
- API endpoints: `backend/app/api/v1/`.
- Backend response shapes: `backend/app/schemas/`.
- Sample backend data: `backend/app/services/sample_data.py`.
- Database schema: `database/initial_schema.sql`.

## Future LLM Inspection Guide

- For setup issues: read `README.md` and `docs/09-commands-tests-and-debugging.md`.
- For product intent: read `docs/01-project-overview.md`.
- For current state: read `docs/02-active-context.md` and `docs/03-latest-handoff.md`.
- For API changes: inspect `docs/07-api-and-data-contract.md`, then backend routers/schemas.
- For UI changes: inspect `docs/08-ui-routes-and-components.md`, then frontend routes/components.
