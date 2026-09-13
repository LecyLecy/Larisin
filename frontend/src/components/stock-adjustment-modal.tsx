"use client";

import { FormEvent, useState } from "react";

import { adjustStock } from "@/lib/api";
import type { Product, StockInResult } from "@/lib/types";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export function StockAdjustmentModal({
  product,
  onClose,
  onCompleted
}: {
  product: Product | null;
  onClose: () => void;
  onCompleted: (result: StockInResult) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!product) return null;
  const productId = product.id;

  function handleClose() {
    if (!isSubmitting) {
      setErrorMessage(null);
      onClose();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const quantityDelta = Number(formData.get("quantity_delta"));
    const notes = String(formData.get("notes") ?? "").trim();
    if (!Number.isInteger(quantityDelta) || quantityDelta === 0) {
      setErrorMessage("Perubahan stok harus berupa bilangan bulat selain nol.");
      return;
    }
    if (notes.length < 2) {
      setErrorMessage("Alasan penyesuaian harus diisi.");
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      onCompleted(await adjustStock(productId, { quantity_delta: quantityDelta, notes }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Stok belum dapat disesuaikan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="stock-adjustment-title" className="w-full max-w-lg rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="stock-adjustment-title" className="text-lg font-bold text-slate-950">Sesuaikan Stok</h2>
            <p className="mt-1 text-sm text-slate-500">{product.name} saat ini: {product.current_stock} {product.unit}</p>
          </div>
          <button type="button" onClick={handleClose} disabled={isSubmitting} className="text-sm font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-50">Tutup</button>
        </div>
        <form noValidate onSubmit={handleSubmit} className="space-y-5 p-5">
          <p className="text-sm leading-6 text-slate-600">Gunakan angka positif untuk menambah atau negatif untuk mengurangi stok hasil hitung fisik.</p>
          {errorMessage ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
          <label className="block text-sm font-semibold text-slate-700">Perubahan stok
            <input name="quantity_delta" type="number" min={-10000} max={10000} step={1} inputMode="numeric" autoFocus required className={inputClassName} placeholder="Contoh: -2 atau 5" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">Alasan penyesuaian
            <input name="notes" minLength={2} maxLength={500} required className={inputClassName} placeholder="Contoh: Barang rusak saat audit stok" />
          </label>
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={handleClose} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Batal</button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-800 disabled:opacity-60">{isSubmitting ? "Menyimpan..." : "Simpan Penyesuaian"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
