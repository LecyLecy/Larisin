import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { formatNumber, formatRupiah } from "@/lib/format";
import type { ReportOverview } from "@/lib/types";

const periodOptions = [7, 30, 90];
const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
const rangeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric"
});

export function ReportsView({
  report,
  dataSource,
  days
}: {
  report: ReportOverview;
  dataSource: "api" | "fallback";
  days: number;
}) {
  const highestDailySales = Math.max(...report.daily_sales.map((point) => point.total_sales), 1);
  const kpis = [
    { label: "Total Penjualan", value: formatRupiah(report.total_sales) },
    { label: "Keuntungan Kotor", value: formatRupiah(report.gross_profit) },
    { label: "Jumlah Transaksi", value: formatNumber(report.transaction_count) },
    { label: "Rata-rata Transaksi", value: formatRupiah(report.average_transaction_value) }
  ];

  return (
    <main className="space-y-6">
      <PageHeader
        title="Laporan"
        description={`Ringkasan ${rangeFormatter.format(new Date(`${report.period_start}T00:00:00`))} sampai ${rangeFormatter.format(new Date(`${report.period_end}T00:00:00`))}.`}
      />

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <nav aria-label="Rentang laporan" className="inline-flex w-fit rounded-lg border border-slate-200 bg-white p-1 shadow-soft">
          {periodOptions.map((option) => (
            <Link
              key={option}
              href={`/reports?days=${option}`}
              aria-current={option === days ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                option === days
                  ? "bg-brand-700 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {option} hari
            </Link>
          ))}
        </nav>
        <p className="text-sm text-slate-500">{formatNumber(report.total_quantity)} unit terjual</p>
      </div>

      {dataSource === "fallback" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Backend belum tersambung. Laporan akan tersedia saat API aktif.
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
            <p className="mt-3 text-2xl font-black text-slate-950">{kpi.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-950">Tren Penjualan</h2>
            <p className="mt-1 text-sm text-slate-500">Nilai penjualan bersih per hari.</p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {dataSource === "api" ? "Data aktual" : "Menunggu API"}
          </span>
        </div>
        {report.daily_sales.some((point) => point.total_sales > 0) ? (
          <div className="mt-6 flex h-56 items-end gap-1.5 sm:gap-3" aria-label="Grafik tren penjualan">
            {report.daily_sales.map((point) => (
              <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-brand-600"
                  style={{ height: `${Math.max(12, (point.total_sales / highestDailySales) * 184)}px` }}
                  title={`${dateFormatter.format(new Date(`${point.date}T00:00:00`))}: ${formatRupiah(point.total_sales)}`}
                />
                <span className="text-[11px] text-slate-500 sm:text-xs">
                  {dateFormatter.format(new Date(`${point.date}T00:00:00`))}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5"><EmptyState text="Belum ada penjualan pada rentang ini." /></div>
        )}
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-bold text-slate-950">Performa Produk</h2>
          <p className="mt-1 text-sm text-slate-500">Urut berdasarkan nilai penjualan bersih.</p>
        </div>
        {report.product_performance.length === 0 ? (
          <div className="p-5"><EmptyState text="Produk akan muncul setelah transaksi tercatat." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Produk</th>
                  <th className="px-5 py-3 font-semibold">Unit Terjual</th>
                  <th className="px-5 py-3 font-semibold">Transaksi</th>
                  <th className="px-5 py-3 font-semibold">Penjualan Bersih</th>
                  <th className="px-5 py-3 font-semibold">Keuntungan Kotor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.product_performance.map((product) => (
                  <tr key={product.product_name}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">{product.product_name}</p>
                      {product.category ? <p className="mt-1 text-xs text-slate-500">{product.category}</p> : null}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{formatNumber(product.quantity_sold)} {product.unit ?? "unit"}</td>
                    <td className="px-5 py-4 text-slate-700">{formatNumber(product.transaction_count)}</td>
                    <td className="px-5 py-4 font-semibold text-slate-950">{formatRupiah(product.net_sales)}</td>
                    <td className={`px-5 py-4 font-semibold ${product.gross_profit >= 0 ? "text-brand-700" : "text-red-700"}`}>
                      {formatRupiah(product.gross_profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
