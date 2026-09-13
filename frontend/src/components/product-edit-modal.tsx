"use client";

import { FormEvent, useState } from "react";

import { deactivateProduct, updateProduct } from "@/lib/api";
import type { Product, ProductUpdateInput } from "@/lib/types";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export function ProductEditModal({
  product,
  onClose,
  onSaved,
  onDeactivated
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: (product: Product) => void;
  onDeactivated: (product: Product) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingDeactivate, setIsConfirmingDeactivate] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!product) return null;
  const selectedProduct = product;
  const productId = product.id;

  function handleClose() {
    if (!isSubmitting) {
      setErrorMessage(null);
      setIsConfirmingDeactivate(false);
      onClose();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: ProductUpdateInput = {
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? ""),
      unit: String(formData.get("unit") ?? ""),
      purchase_price: Number(formData.get("purchase_price")),
      selling_price: Number(formData.get("selling_price")),
      minimum_stock: Number(formData.get("minimum_stock"))
    };
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      onSaved(await updateProduct(productId, payload));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Produk belum dapat diperbarui.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeactivate() {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await deactivateProduct(productId);
      onDeactivated(selectedProduct);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Produk belum dapat dinonaktifkan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="product-edit-title" className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div><h2 id="product-edit-title" className="text-lg font-bold text-slate-950">Edit Produk</h2><p className="mt-1 text-sm text-slate-500">Stok hanya dapat diubah melalui restock atau penyesuaian.</p></div>
          <button type="button" onClick={handleClose} disabled={isSubmitting} className="text-sm font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-50">Tutup</button>
        </div>
        <form noValidate onSubmit={handleSubmit} className="space-y-5 p-5">
          {errorMessage ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Nama produk<input name="name" defaultValue={product.name} required minLength={2} maxLength={120} autoFocus className={inputClassName} /></label>
            <label className="text-sm font-semibold text-slate-700">Kategori<input name="category" defaultValue={product.category} required minLength={2} maxLength={80} className={inputClassName} /></label>
            <label className="text-sm font-semibold text-slate-700">Satuan<input name="unit" defaultValue={product.unit} required minLength={1} maxLength={30} className={inputClassName} /></label>
            <label className="text-sm font-semibold text-slate-700">Harga beli<input name="purchase_price" defaultValue={product.purchase_price} type="number" min={0} step={1} required className={inputClassName} /></label>
            <label className="text-sm font-semibold text-slate-700">Harga jual<input name="selling_price" defaultValue={product.selling_price} type="number" min={0} step={1} required className={inputClassName} /></label>
            <label className="text-sm font-semibold text-slate-700">Batas stok minimum<input name="minimum_stock" defaultValue={product.minimum_stock} type="number" min={0} step={1} required className={inputClassName} /></label>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            {isConfirmingDeactivate ? <div className="flex flex-wrap items-center gap-2 text-sm"><span className="font-semibold text-red-700">Nonaktifkan produk ini?</span><button type="button" onClick={handleDeactivate} disabled={isSubmitting} className="font-bold text-red-700 hover:underline">Ya, nonaktifkan</button><button type="button" onClick={() => setIsConfirmingDeactivate(false)} disabled={isSubmitting} className="font-semibold text-slate-600 hover:underline">Batal</button></div> : <button type="button" onClick={() => setIsConfirmingDeactivate(true)} disabled={isSubmitting} className="w-fit text-sm font-semibold text-red-700 hover:underline">Nonaktifkan produk</button>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row"><button type="button" onClick={handleClose} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Batal</button><button type="submit" disabled={isSubmitting} className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-800 disabled:opacity-60">{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</button></div>
          </div>
        </form>
      </section>
    </div>
  );
}
