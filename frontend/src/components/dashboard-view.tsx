import { EmptyState } from "@/components/empty-state";
import { ProductTable } from "@/components/product-table";
import { RecommendationCard } from "@/components/recommendation-card";
import { TransactionList } from "@/components/transaction-list";
import { formatNumber, formatRupiah } from "@/lib/format";
import type { AnalyticsSummary } from "@/lib/types";

export function DashboardView({
  summary,
  dataSource
}: {
  summary: AnalyticsSummary;
  dataSource: "api" | "fallback";
}) {
  const kpis = [
    {
      label: "Total Penjualan Hari Ini",
      value: formatRupiah(summary.total_sales_today),
      helper: "+12% dari kemarin"
    },
    {
      label: "Keuntungan Kotor",
      value: formatRupiah(summary.gross_profit_today),
      helper: "Margin sehat untuk sembako"
    },
    {
      label: "Jumlah Transaksi",
      value: formatNumber(summary.transaction_count_today),
      helper: "Transaksi tercatat hari ini"
    },
    {
      label: "Produk Stok Menipis",
      value: formatNumber(summary.low_stock_count),
      helper: "Perlu dicek sebelum tutup toko"
    }
  ];

  return (
    <main className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-brand-700">Dashboard</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">
            Ringkasan usaha hari ini
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Lihat penjualan, keuntungan, stok menipis, dan saran tindakan yang paling dekat.
          </p>
        </div>
        {dataSource === "fallback" ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Backend belum tersambung. Data contoh lokal sedang ditampilkan.
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
            <p className="mt-3 text-2xl font-black text-slate-950">{kpi.value}</p>
            <p className="mt-2 text-sm text-slate-500">{kpi.helper}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-950">Tren Penjualan</h2>
              <p className="text-sm text-slate-500">7 hari terakhir</p>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              Contoh
            </span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-3">
            {summary.sales_trend.map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-brand-600"
                  style={{ height: `${Math.max(18, point.value / 45000)}px` }}
                  title={`${point.label}: ${formatRupiah(point.value)}`}
                />
                <span className="text-xs text-slate-500">{point.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {summary.recommendations.length > 0 ? (
            summary.recommendations.map((item) => <RecommendationCard key={item.title} item={item} />)
          ) : (
            <EmptyState text="Belum ada rekomendasi. Data transaksi akan membantu Larisin memberi saran." />
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ProductTable products={summary.low_stock_products} compact title="Stok Perlu Dicek" />
        <TransactionList transactions={summary.recent_transactions} compact title="Transaksi Terbaru" />
      </section>
    </main>
  );
}
