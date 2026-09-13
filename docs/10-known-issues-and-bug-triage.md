# Known Issues and Bug Triage

## Known Incomplete Areas

- Auth and Owner/Staff roles are not implemented.
- Products support create, list, edit, and soft deactivation; a product cannot yet be assigned or changed to a default supplier in the UI.
- Sales and dashboard analytics are persistent; scheduled marts/ETL are not implemented.
- Analytics views require a live PostgreSQL database for integration verification; local Docker Desktop is currently unavailable.
- Stock-in, sale, and audit adjustment movements are recorded; return UI is not implemented yet.
- Analytics and recommendations are sample-only.
- Supplier supports list/create and optional restock attribution; edit/deactivate, purchase orders, price history, and delivery measurement are not implemented.
- Settings supports the single default business profile; multi-business settings and role management are not implemented.
- PDF/Excel export is deferred.
- ML forecasting is deferred.
- The frontend overrides PostCSS and Sharp for patched security releases. Revisit the overrides whenever Next.js is upgraded.

## Deferred Features

- Multi-tenant business management.
- Payment system.
- File upload/import.
- Advanced permissions.
- Native mobile app.
- Push notifications.

## Bug Triage Process

1. Confirm the failing command or route.
2. Check env variable names and values without exposing secrets.
3. Reproduce locally if possible.
4. Inspect the smallest relevant file.
5. Fix narrowly.
6. Run the closest available check.
7. Update docs if commands, contracts, or assumptions changed.

## Common Issue Checklist

- Frontend env missing: `NEXT_PUBLIC_API_BASE_URL` not set.
- Backend CORS: frontend origin missing from `CORS_ORIGINS`.
- Railway backend URL: Vercel points to localhost or wrong URL.
- DB connection: `DATABASE_URL` missing or invalid after database work begins.
- Local Postgres: Docker Desktop must be running before `docker compose up -d postgres`.
- Local Docker service: `com.docker.service` may require an elevated Windows session to start.
- Package install failure: remove partial `node_modules` only with approval if needed.
- Build failure: check TypeScript errors and imported route/component paths.
- Cold start: Railway service may respond slowly on free/low-tier plans.
