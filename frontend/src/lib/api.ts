import { fallbackProducts, fallbackSummary, fallbackTransactions } from "@/lib/sample-data";
import type {
  AnalyticsSummary,
  BusinessProfile,
  BusinessProfileUpdate,
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  ReportOverview,
  InventoryMovement,
  StockInInput,
  StockInResult,
  StockAdjustmentInput,
  Supplier,
  SupplierCreateInput,
  Transaction,
  TransactionCreateInput
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type DataResult<T> = {
  data: T;
  source: "api" | "fallback";
};

async function fetchJson<T>(
  path: string,
  fallback: T,
  revalidateSeconds = 30
): Promise<DataResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...(revalidateSeconds === 0
        ? { cache: "no-store" as const }
        : { next: { revalidate: revalidateSeconds } })
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return { data: (await response.json()) as T, source: "api" };
  } catch {
    return { data: fallback, source: "fallback" };
  }
}

export function getSummary() {
  return fetchJson<AnalyticsSummary>("/api/v1/analytics/summary", fallbackSummary, 0);
}

export function getProducts() {
  return fetchJson<Product[]>("/api/v1/products", fallbackProducts, 0);
}

export function getTransactions() {
  return fetchJson<Transaction[]>("/api/v1/transactions", fallbackTransactions, 0);
}

export function getInventoryMovements() {
  return fetchJson<InventoryMovement[]>("/api/v1/inventory/movements", [], 0);
}

export function getSuppliers() {
  return fetchJson<Supplier[]>("/api/v1/suppliers", [], 0);
}

const fallbackBusinessProfile: BusinessProfile = {
  name: "Toko Rina Jaya",
  business_category: "Toko Kelontong",
  currency_code: "IDR"
};

export function getBusinessProfile() {
  return fetchJson<BusinessProfile>("/api/v1/business/profile", fallbackBusinessProfile, 0);
}

export function getReportOverview(days: number) {
  const today = new Date();
  const periodStart = new Date(today);
  periodStart.setDate(today.getDate() - days + 1);
  const fallback: ReportOverview = {
    period_start: periodStart.toISOString().slice(0, 10),
    period_end: today.toISOString().slice(0, 10),
    total_sales: 0,
    gross_profit: 0,
    transaction_count: 0,
    total_quantity: 0,
    average_transaction_value: 0,
    daily_sales: [],
    product_performance: []
  };
  return fetchJson<ReportOverview>(`/api/v1/reports/overview?days=${days}`, fallback, 0);
}

export async function createProduct(payload: ProductCreateInput): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { detail?: string | Array<{ msg?: string }> }
      | null;
    const detail = body?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail) && detail[0]?.msg
          ? detail[0].msg
          : "Produk belum dapat disimpan. Coba lagi.";
    throw new Error(message);
  }

  return (await response.json()) as Product;
}

export async function updateProduct(productId: string, payload: ProductUpdateInput): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? "Produk belum dapat diperbarui. Coba lagi.");
  }
  return (await response.json()) as Product;
}

export async function deactivateProduct(productId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, { method: "DELETE" });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? "Produk belum dapat dinonaktifkan. Coba lagi.");
  }
}

export async function createTransaction(payload: TransactionCreateInput): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { detail?: string | Array<{ msg?: string }> }
      | null;
    const detail = body?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail) && detail[0]?.msg
          ? detail[0].msg
          : "Transaksi belum dapat disimpan. Coba lagi.";
    throw new Error(message);
  }

  return (await response.json()) as Transaction;
}

export async function addStock(productId: string, payload: StockInInput): Promise<StockInResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/inventory/products/${productId}/stock-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? "Stok belum dapat ditambahkan. Coba lagi.");
  }

  return (await response.json()) as StockInResult;
}

export async function adjustStock(productId: string, payload: StockAdjustmentInput): Promise<StockInResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/inventory/products/${productId}/adjustment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? "Stok belum dapat disesuaikan. Coba lagi.");
  }
  return (await response.json()) as StockInResult;
}

export async function createSupplier(payload: SupplierCreateInput): Promise<Supplier> {
  const response = await fetch(`${API_BASE_URL}/api/v1/suppliers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? "Supplier belum dapat disimpan. Coba lagi.");
  }

  return (await response.json()) as Supplier;
}

export async function updateBusinessProfile(
  payload: BusinessProfileUpdate
): Promise<BusinessProfile> {
  const response = await fetch(`${API_BASE_URL}/api/v1/business/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? "Profil usaha belum dapat disimpan. Coba lagi.");
  }
  return (await response.json()) as BusinessProfile;
}
