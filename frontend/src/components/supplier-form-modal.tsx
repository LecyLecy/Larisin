"use client";

import { FormEvent, useState } from "react";

import { createSupplier } from "@/lib/api";
import type { Supplier, SupplierCreateInput } from "@/lib/types";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export function SupplierFormModal({
  open,
  onClose,
  onCreated
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (supplier: Supplier) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!open) return null;

  function handleClose() {
    if (!isSubmitting) {
      setErrorMessage(null);
      onClose();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const deliveryDays = String(formData.get("average_delivery_days") ?? "");
    const payload: SupplierCreateInput = {
      name: String(formData.get("name") ?? ""),
      contact: String(formData.get("contact") ?? "").trim() || null,
      product_category: String(formData.get("product_category") ?? "").trim() || null,
      average_delivery_days: deliveryDays ? Number(deliveryDays) : null
    };
    setIsSubmitting(true);
    try {
      const supplier = await createSupplier(payload);
      form.reset();
      onCreated(supplier);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Supplier belum dapat disimpan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="supplier-form-title" className="w-full max-w-xl rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="supplier-form-title" className="text-lg font-bold text-slate-950">Tambah Supplier</h2>
            <p className="mt-1 text-sm text-slate-500">Simpan pemasok agar sumber restock dapat dicatat.</p>
          </div>
          <button type="button" onClick={handleClose} disabled={isSubmitting} className="text-sm font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-50">Tutup</button>
        </div>
        <form noValidate onSubmit={handleSubmit} className="space-y-5 p-5">
          {errorMessage ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Nama supplier
              <input name="name" required minLength={2} maxLength={120} autoFocus className={inputClassName} placeholder="Contoh: CV Sumber Makmur" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Kontak (opsional)
              <input name="contact" maxLength={120} className={inputClassName} placeholder="Contoh: 0812-3456-7890" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Kategori utama (opsional)
              <input name="product_category" maxLength={80} className={inputClassName} placeholder="Contoh: Sembako" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Rata-rata kirim, hari (opsional)
              <input name="average_delivery_days" type="number" min={0} max={365} step={1} inputMode="numeric" className={inputClassName} placeholder="Contoh: 2" />
            </label>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={handleClose} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Batal</button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-800 disabled:opacity-60">{isSubmitting ? "Menyimpan..." : "Simpan Supplier"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
