# Active Context

## Current Setup Status

Initial repository setup is completed on `dev`. The project started nearly empty with only `README.md` and Git metadata.

## Current Branch

`dev`

## Initialized

- Root documentation and safety files.
- Next.js 16.2.9 frontend in `frontend/`.
- FastAPI backend in `backend/`.
- Database planning folder in `database/`.
- Scripts folder in `scripts/`.
- Required 10 memory docs in `docs/`.

## Verification Results

- Frontend dependencies installed with npm.
- Backend dependencies installed in `backend/.venv` using Python 3.11.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm audit --audit-level=moderate`: passed with 0 vulnerabilities after a PostCSS override.
- `python -m pytest`: passed, 3 tests.

## Current Next Priority

Connect the frontend to real backend persistence by adding PostgreSQL migrations and replacing sample data with database-backed services.

## Important User Decisions

- App name: Larisin.
- Deployment: Vercel + Railway.
- Backend: FastAPI.
- Frontend: Next.js.
- Database: Railway PostgreSQL assumption.
- Logo: user already created a circular logo and will provide it later.

## Assumptions

- **Assumption:** Authentication is deferred until after the sample-data MVP is running.
- **Assumption:** npm is the frontend package manager.
- **Assumption:** pip + `requirements.txt` is enough for backend dependency management.
- **Assumption:** The PostCSS npm override should be kept until Next no longer needs it for audit cleanliness.
