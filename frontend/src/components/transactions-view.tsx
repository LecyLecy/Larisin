"use client";

import { useState } from "react";

import { TransactionFormModal } from "@/components/transaction-form-modal";
import { TransactionList } from "@/components/transaction-list";
import { PageHeader } from "@/components/page-header";
import { formatRupiah } from "@/lib/format";
import type { Product, Transaction } from "@/lib/types";

export function TransactionsView({
  initialTransactions,
  products,
  dataSource
}: {
  initialTransactions: Transaction[];
  products: Product[];
  dataSource: "api" | "fallback";
}) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [currentProducts, setCurrentProducts] = useState(products);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleCreated(transaction: Transaction) {
    setTransactions((current) => [transaction, ...current]);
    setCurrentProducts((current) =>
      current.map((product) => {
        const soldItem = transaction.items.find((item) => item.product_id === product.id);
        return soldItem
          ? { ...product, current_stock: Math.max(0, product.current_stock - soldItem.quantity) }
          : product;
      })
    );
    setSuccessMessage(`Transaksi ${formatRupiah(transaction.total_amount)} berhasil dicatat.`);
    setIsFormOpen(false);
  }

  const canCreateTransaction =
    dataSource === "api" && currentProducts.some((product) => product.current_stock > 0);

  return (
    <main className="space-y-6">
      <PageHeader
        title="Transaksi"
        description="Catat penjualan, kurangi stok otomatis, dan bangun data untuk insight usaha."
        action={
          <button
            type="button"
            onClick={() => {
              setSuccessMessage(null);
              setIsFormOpen(true);
            }}
            disabled={!canCreateTransaction}
            className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Tambah Transaksi
          </button>
        }
      />

      {dataSource === "fallback" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Backend belum tersambung. Data contoh lokal ditampilkan dan transaksi baru tidak dapat
          disimpan.
        </p>
      ) : null}

      {dataSource === "api" && !canCreateTransaction ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Tambahkan atau isi ulang stok produk terlebih dahulu sebelum mencatat transaksi.
        </p>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          className="flex items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="font-semibold text-emerald-900 hover:underline"
          >
            Tutup
          </button>
        </div>
      ) : null}

      <TransactionList transactions={transactions} />

      <TransactionFormModal
        open={isFormOpen}
        products={currentProducts}
        onClose={() => setIsFormOpen(false)}
        onCreated={handleCreated}
      />
    </main>
  );
}
