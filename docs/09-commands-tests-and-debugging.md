# Commands, Tests, and Debugging

## Setup Commands

Frontend:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Backend:

```bash
copy backend\.env.example backend\.env
docker compose up -d postgres
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m alembic upgrade head
uvicorn app.main:app --reload
```

Database lifecycle from the repository root:

```bash
docker compose up -d postgres
docker compose ps
docker compose stop postgres
```

On this machine, use Python 3.11 through the launcher if default `python` points to 3.8:

```bash
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pytest
```

## Frontend Commands

```bash
npm run dev
npm run lint
npm run build
npm audit --audit-level=moderate
```

## Backend Commands

```bash
uvicorn app.main:app --reload
python -m pytest
```

## Populate Local Demo Data

Use this only with a fresh empty development database. The script checks for existing products first and exits without altering data when it finds any.

```powershell
$env:DATABASE_URL = "sqlite+pysqlite:///C:/Users/$env:USERNAME/AppData/Local/Larisin/larisin-local.db"
.\backend\.venv\Scripts\python.exe .\scripts\seed_demo_data.py
```

For PostgreSQL, set `DATABASE_URL` to the local Compose connection before running the same command. Do not run the seed script against a real business database.

Current verified results:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm audit --audit-level=moderate`: passed with 0 vulnerabilities.
 - `.\.venv\Scripts\python.exe -m pytest`: passed, 18 tests.

## Common Debugging Steps

- Check `NEXT_PUBLIC_API_BASE_URL` in frontend env.
- Check `CORS_ORIGINS` in backend env. Local development also accepts any `localhost` or `127.0.0.1` port so Next.js can use its available port.
- Visit `/health` before debugging frontend API calls.
- Read browser console and Next.js terminal logs.
- Read FastAPI terminal logs for request errors.
- Confirm Railway backend URL is public and reachable from Vercel.
- Confirm PostgreSQL `DATABASE_URL` only exists in backend/Railway env.

## Vercel/Railway Notes

- Vercel needs `NEXT_PUBLIC_API_BASE_URL` set to the Railway backend URL.
- Railway backend needs `CORS_ORIGINS` including the Vercel frontend URL.
- Railway PostgreSQL should provide `DATABASE_URL` to the backend only.

## What To Ask User For

- Screenshot of browser error.
- Browser console output.
- Frontend terminal log.
- Backend terminal log.
- Vercel deployment log.
- Railway deployment log.
- Current `.env.example` names, not real secret values.
