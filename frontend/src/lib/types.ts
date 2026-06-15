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

export type Transaction = {
  id: string;
  date: string;
  product_name: string;
  quantity: number;
  selling_price: number;
  discount: number;
  payment_method: string;
  notes?: string;
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
