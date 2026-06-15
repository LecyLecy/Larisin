import { PageHeader } from "@/components/page-header";
import { TransactionList } from "@/components/transaction-list";
import { getTransactions } from "@/lib/api";

export default async function TransactionsPage() {
  const { data, source } = await getTransactions();

  return (
    <main className="space-y-6">
      <PageHeader
        title="Transaksi"
        description="Catat dan tinjau transaksi penjualan harian."
        actionLabel="Tambah Transaksi"
      />
      {source === "fallback" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Backend belum tersambung. Data contoh lokal sedang ditampilkan.
        </p>
      ) : null}
      <TransactionList transactions={data} />
    </main>
  );
}
