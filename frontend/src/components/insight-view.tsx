import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ProductTable } from "@/components/product-table";
import { RecommendationCard } from "@/components/recommendation-card";
import type { AnalyticsSummary } from "@/lib/types";

export function InsightView({
  summary,
  dataSource
}: {
  summary: AnalyticsSummary;
  dataSource: "api" | "fallback";
}) {
  return (
    <main className="space-y-6">
      <PageHeader title="Insight" description="Prioritas tindakan yang dibaca langsung dari transaksi dan stok saat ini." />
      {dataSource === "fallback" ? <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Backend belum tersambung. Insight contoh lokal sedang ditampilkan.</p> : null}
      <section className="grid gap-4 xl:grid-cols-3">
        {summary.recommendations.length > 0 ? summary.recommendations.map((item) => <RecommendationCard key={item.title} item={item} />) : <div className="xl:col-span-3"><EmptyState text="Belum ada insight. Catat penjualan untuk membangun rekomendasi." /></div>}
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <ProductTable products={summary.top_products} compact title="Produk Terlaris" emptyTitle="Belum ada produk terlaris" emptyDescription="Data akan muncul setelah transaksi tercatat." />
        <ProductTable products={summary.low_stock_products} compact title="Stok Perlu Dicek" emptyTitle="Semua stok aman" emptyDescription="Belum ada produk yang mencapai batas minimum." />
      </section>
    </main>
  );
}
