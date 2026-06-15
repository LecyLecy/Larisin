import { fallbackProducts, fallbackSummary, fallbackTransactions } from "@/lib/sample-data";
import type { AnalyticsSummary, Product, Transaction } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type DataResult<T> = {
  data: T;
  source: "api" | "fallback";
};

async function fetchJson<T>(path: string, fallback: T): Promise<DataResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 30 }
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
  return fetchJson<AnalyticsSummary>("/api/v1/analytics/summary", fallbackSummary);
}

export function getProducts() {
  return fetchJson<Product[]>("/api/v1/products", fallbackProducts);
}

export function getTransactions() {
  return fetchJson<Transaction[]>("/api/v1/transactions", fallbackTransactions);
}
