# System Architecture

## Diagram

```text
[Vercel: Next.js Frontend]
        |
        | HTTP/JSON
        v
[Railway: FastAPI Backend]
        |
        | SQL, future
        v
[Railway: PostgreSQL Database]
        |
        | future ETL/views
        v
[Analytics Tables / Marts]
```

## Frontend Responsibilities

- App shell and navigation.
- Indonesian UI labels.
- Dashboard, transaction, product, insight, report, supplier, and settings pages.
- Fetch data from FastAPI using `NEXT_PUBLIC_API_BASE_URL`.
- Show graceful empty/error/loading states.

## Backend Responsibilities

- API contract and validation.
- Health check.
- Products, transactions, inventory, analytics, and insights route structure.
- Later: persistence, auth, role checks, and business rules.

## Database Responsibilities

- Store businesses, users, products, suppliers, sales transactions, transaction items, and inventory movements.
- Later: analytics views/marts for daily sales summary, product performance, low stock alerts, and restock recommendations.

## Deployment Direction

- Frontend: Vercel.
- Backend: Railway FastAPI service.
- Database: Railway PostgreSQL.

## Future Analytics/Data Engineering

- SQL views or marts for KPI dashboards.
- Scheduled ETL/ELT jobs after transactional tables stabilize.
- Supplier performance analysis.
- Rule-based restock recommendations before forecasting.

## Technical Risks

- Railway cold starts or low-tier resource constraints.
- Incorrect Vercel backend URL.
- CORS misconfiguration.
- Secrets accidentally exposed to frontend.
- Schema changes after user validation.
- Messy real UMKM data.
- Auth is required before real sensitive profit data is used by staff.
