import { formatRupiah, formatTransactionDate } from "@/lib/format";
import type { Transaction } from "@/lib/types";

export function TransactionList({
  transactions,
  compact = false,
  title = "Daftar Transaksi"
}: {
  transactions: Transaction[];
  compact?: boolean;
  title?: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-200 p-5">
        <h2 className="font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">Riwayat penjualan yang sudah dicatat.</p>
      </div>
      {transactions.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="font-semibold text-slate-900">Belum ada transaksi</p>
          <p className="mt-2 text-sm text-slate-500">
            Catat penjualan pertama untuk membangun data insight Larisin.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-950">
                  {getProductSummary(transaction)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {formatTransactionDate(transaction.date)} · {transaction.total_quantity} item ·{" "}
                  {transaction.payment_method}
                </p>
                {!compact && transaction.notes ? (
                  <p className="mt-1 text-sm text-slate-500">{transaction.notes}</p>
                ) : null}
              </div>
              <div className="md:text-right">
                <p className="font-bold text-brand-700">{formatRupiah(transaction.total_amount)}</p>
                {!compact && transaction.total_discount > 0 ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Diskon {formatRupiah(transaction.total_discount)}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function getProductSummary(transaction: Transaction) {
  const names = transaction.items.map((item) => item.product_name);
  if (names.length <= 2) {
    return names.join(", ");
  }
  return `${names.slice(0, 2).join(", ")} +${names.length - 2} produk lainnya`;
}
