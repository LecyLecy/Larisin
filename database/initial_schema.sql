-- Larisin initial PostgreSQL schema direction.
-- Safe starter DDL for future migration tooling; not required for local sample app.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS businesses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    business_category text,
    currency_code text NOT NULL DEFAULT 'IDR',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id),
    full_name text NOT NULL,
    email text,
    role text NOT NULL CHECK (role IN ('owner', 'staff')),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suppliers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id),
    name text NOT NULL,
    contact text,
    product_category text,
    average_delivery_days integer CHECK (average_delivery_days IS NULL OR average_delivery_days >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id),
    supplier_id uuid REFERENCES suppliers(id),
    name text NOT NULL,
    category text NOT NULL,
    unit text NOT NULL,
    purchase_price integer NOT NULL CHECK (purchase_price >= 0),
    selling_price integer NOT NULL CHECK (selling_price >= 0),
    current_stock integer NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    minimum_stock integer NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_business_id ON products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

CREATE TABLE IF NOT EXISTS sales_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id),
    transaction_date timestamptz NOT NULL DEFAULT now(),
    payment_method text NOT NULL,
    total_amount integer NOT NULL CHECK (total_amount >= 0),
    total_discount integer NOT NULL DEFAULT 0 CHECK (total_discount >= 0),
    notes text,
    created_by uuid REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sales_transactions_business_date
    ON sales_transactions(business_id, transaction_date);

CREATE TABLE IF NOT EXISTS sales_transaction_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id uuid NOT NULL REFERENCES sales_transactions(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id),
    product_name_snapshot text NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    selling_price integer NOT NULL CHECK (selling_price >= 0),
    purchase_price_snapshot integer CHECK (purchase_price_snapshot IS NULL OR purchase_price_snapshot >= 0),
    discount integer NOT NULL DEFAULT 0 CHECK (discount >= 0),
    line_total integer NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_sales_transaction_items_transaction_id
    ON sales_transaction_items(transaction_id);

CREATE TABLE IF NOT EXISTS inventory_movements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id),
    product_id uuid NOT NULL REFERENCES products(id),
    movement_type text NOT NULL CHECK (movement_type IN ('stock_in', 'sale', 'adjustment', 'return')),
    quantity_delta integer NOT NULL,
    stock_after integer NOT NULL CHECK (stock_after >= 0),
    reference_type text,
    reference_id uuid,
    notes text,
    created_by uuid REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_created
    ON inventory_movements(product_id, created_at);

-- Future analytics tables/views:
-- dim_product, dim_supplier, dim_date
-- fact_sales, fact_inventory
-- mart_daily_sales_summary
-- mart_product_performance
-- mart_low_stock_alerts
-- mart_restock_recommendations
