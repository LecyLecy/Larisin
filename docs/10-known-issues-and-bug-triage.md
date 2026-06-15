# Known Issues and Bug Triage

## Known Incomplete Areas

- Auth and Owner/Staff roles are not implemented.
- Database connection is not implemented.
- Product and transaction CRUD are sample-only.
- Analytics and recommendations are sample-only.
- Supplier, reports, and settings are placeholders.
- PDF/Excel export is deferred.
- ML forecasting is deferred.
- The frontend uses a PostCSS npm override for audit cleanliness; revisit after future Next.js upgrades.

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
- Package install failure: remove partial `node_modules` only with approval if needed.
- Build failure: check TypeScript errors and imported route/component paths.
- Cold start: Railway service may respond slowly on free/low-tier plans.
