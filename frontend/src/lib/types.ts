export type StockStatus = "Aman" | "Menipis" | "Habis";

export type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  purchase_price: number;
  selling_price: number;
  current_stock: number;
  minimum_stock: number;
  status: StockStatus;
};

export type ProductCreateInput = Omit<Product, "id" | "status">;

export type ProductUpdateInput = Omit<Product, "id" | "status" | "current_stock">;

export type InventoryMovement = {
  id: string;
  product_id: string;
  product_name: string;
  product_unit: string;
  supplier_name: string | null;
  movement_type: "stock_in" | "sale" | "adjustment" | "return";
  quantity_delta: number;
  stock_after: number;
  notes?: string;
  created_at: string;
};

export type StockInInput = {
  quantity: number;
  supplier_id?: string;
  notes?: string;
};

export type StockAdjustmentInput = {
  quantity_delta: number;
  notes: string;
};

export type StockInResult = {
  product: Product;
  movement: InventoryMovement;
};

export type Supplier = {
  id: string;
  name: string;
  contact: string | null;
  product_category: string | null;
  average_delivery_days: number | null;
};

export type SupplierCreateInput = Omit<Supplier, "id">;

export type BusinessProfile = {
  name: string;
  business_category: string | null;
  currency_code: string;
};

export type BusinessProfileUpdate = Pick<BusinessProfile, "name" | "business_category">;

export type Transaction = {
  id: string;
  date: string;
  payment_method: "Tunai" | "QRIS" | "Transfer" | "Debit/Kredit";
  subtotal: number;
  total_discount: number;
  total_amount: number;
  gross_profit: number;
  total_quantity: number;
  notes?: string;
  items: TransactionItem[];
};

export type TransactionItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  selling_price: number;
  purchase_price: number;
  discount: number;
  line_total: number;
};

export type TransactionCreateInput = {
  payment_method: Transaction["payment_method"];
  notes?: string;
  items: Array<{
    product_id: string;
    quantity: number;
    discount: number;
  }>;
};

export type Recommendation = {
  title: string;
  description: string;
  action: string;
};

export type SalesTrendPoint = {
  label: string;
  value: number;
};

export type AnalyticsSummary = {
  total_sales_today: number;
  gross_profit_today: number;
  transaction_count_today: number;
  low_stock_count: number;
  sales_trend: SalesTrendPoint[];
  top_products: Product[];
  low_stock_products: Product[];
  recent_transactions: Transaction[];
  recommendations: Recommendation[];
};

export type DailySalesPoint = {
  date: string;
  total_sales: number;
  gross_profit: number;
  transaction_count: number;
};

export type ProductPerformance = {
  product_name: string;
  category: string | null;
  unit: string | null;
  quantity_sold: number;
  transaction_count: number;
  net_sales: number;
  gross_profit: number;
};

export type ReportOverview = {
  period_start: string;
  period_end: string;
  total_sales: number;
  gross_profit: number;
  transaction_count: number;
  total_quantity: number;
  average_transaction_value: number;
  daily_sales: DailySalesPoint[];
  product_performance: ProductPerformance[];
};
