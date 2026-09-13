# System Architecture

## Diagram

```mermaid
flowchart LR
    UI["Next.js UI\nVercel"] -->|"HTTP / JSON"| API["FastAPI\nRailway"]
    API -->|"SQLAlchemy + Alembic"| DB[("PostgreSQL\nRailway")]
    DB --> MARTS["SQL views and analytics marts\nFuture data engineering layer"]
    MARTS --> UI
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
- Current: product persistence, transaction creation, stock locks, inventory history, and SQL-backed dashboard aggregation.
- Later: auth, role checks, and richer business rules.

## Database Responsibilities

- Current: store the default business, products, sales transactions, transaction items, and inventory movements through Alembic-managed tables; derive dashboard aggregates directly from them.
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

## Sales Transaction Flow

```mermaid
sequenceDiagram
    participant Staff as "Staff UI"
    participant API as "FastAPI"
    participant DB as "PostgreSQL"

    Staff->>API: POST transaction with product IDs and quantities
    API->>DB: Lock selected product rows
    DB-->>API: Current stock and current prices
    API->>API: Validate stock, calculate totals, snapshot prices
    API->>DB: Create sale, sale items, stock movements
    API->>DB: Reduce product stock
    DB-->>API: Commit all changes together
    API-->>Staff: Saved transaction and totals
```

## Dashboard Data Flow

```mermaid
flowchart LR
    SALES["sales_transactions\nand sales_transaction_items"] --> KPIS["Today's sales, profit,\nand transaction count"]
    MOVES["products\nand inventory_movements"] --> STOCK["Low-stock status"]
    SALES --> TREND["Seven-day sales trend"]
    TREND --> REC["Rule-based recommendations"]
    KPIS --> DASH["Dashboard"]
    STOCK --> DASH
    TREND --> DASH
    REC --> DASH
```

## Stock-In Data Flow

```mermaid
sequenceDiagram
    participant Staff as "Staff UI"
    participant API as "FastAPI"
    participant DB as "PostgreSQL"

    Staff->>API: POST stock-in with quantity, optional supplier, and note
    API->>DB: Lock target product row
    API->>DB: Validate optional supplier belongs to the business
    API->>DB: Increase current stock
    API->>DB: Insert stock_in inventory movement
    DB-->>API: Commit both writes together
    API-->>Staff: Updated product and movement record
```

## Supplier Relationship

```mermaid
erDiagram
    BUSINESSES ||--o{ SUPPLIERS : owns
    SUPPLIERS ||--o{ PRODUCTS : default_source
    SUPPLIERS ||--o{ INVENTORY_MOVEMENTS : supplies_stock_in
    PRODUCTS ||--o{ INVENTORY_MOVEMENTS : changes
```

## Stock Adjustment Flow

```mermaid
sequenceDiagram
    participant Staff as "Staff UI"
    participant API as "FastAPI"
    participant DB as "PostgreSQL"

    Staff->>API: POST adjustment with signed delta and reason
    API->>DB: Lock active product row
    API->>API: Reject a negative ending balance
    API->>DB: Update stock and insert adjustment movement
    DB-->>API: Commit both writes together
    API-->>Staff: Updated balance and audit movement
```

## Business Profile Flow

```mermaid
flowchart LR
    SETTINGS["Pengaturan UI"] -->|"PATCH profile"| API["FastAPI"]
    API --> BUSINESS["businesses default row"]
    BUSINESS -->|"GET profile"| SHELL["Next.js app shell header"]
```

## Reports Data Flow

```mermaid
flowchart LR
    SALES["sales_transactions"] --> DAILY["mart_daily_sales_summary"]
    ITEMS["sales_transaction_items\nprice snapshots"] --> PRODUCT_MART["mart_product_daily_performance"]
    DAILY --> REPORT["Range report service"]
    PRODUCT_MART --> REPORT
    REPORT --> KPI["Sales, profit, count, average"]
    REPORT --> TREND["Daily sales trend"]
    REPORT --> PRODUCT["Product performance"]
    KPI --> UI["Reports UI"]
    TREND --> UI
    PRODUCT --> UI
```

## Technical Risks

- Railway cold starts or low-tier resource constraints.
- Incorrect Vercel backend URL.
- CORS misconfiguration.
- Secrets accidentally exposed to frontend.
- Schema changes after user validation.
- Messy real UMKM data.
- Auth is required before real sensitive profit data is used by staff.
