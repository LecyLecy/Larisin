import { formatRupiah } from "@/lib/format";
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
        <p className="mt-1 text-sm text-slate-500">Transaksi penjualan contoh.</p>
      </div>
      <div className="divide-y divide-slate-100">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-semibold text-slate-950">{transaction.product_name}</p>
              <p className="mt-1 text-sm text-slate-500">
                {transaction.date} · {transaction.quantity} item · {transaction.payment_method}
              </p>
              {!compact && transaction.notes ? (
                <p className="mt-1 text-sm text-slate-500">{transaction.notes}</p>
              ) : null}
            </div>
            <p className="font-bold text-brand-700">
              {formatRupiah(transaction.quantity * transaction.selling_price - transaction.discount)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
