"use client";

import { FormEvent, useState } from "react";

import { createProduct } from "@/lib/api";
import type { Product, ProductCreateInput } from "@/lib/types";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export function ProductFormModal({
  open,
  onClose,
  onCreated
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (product: Product) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }
    setErrorMessage(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: ProductCreateInput = {
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? ""),
      unit: String(formData.get("unit") ?? ""),
      purchase_price: Number(formData.get("purchase_price")),
      selling_price: Number(formData.get("selling_price")),
      current_stock: Number(formData.get("current_stock")),
      minimum_stock: Number(formData.get("minimum_stock"))
    };

    try {
      const product = await createProduct(payload);
      form.reset();
      onCreated(product);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Produk belum dapat disimpan. Coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="product-form-title" className="text-lg font-bold text-slate-950">
              Tambah Produk
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Harga disimpan dalam Rupiah dan stok menggunakan bilangan bulat.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {errorMessage ? (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Nama produk
              <input
                name="name"
                required
                minLength={2}
                maxLength={120}
                autoFocus
                placeholder="Contoh: Beras Ramos 5kg"
                className={inputClassName}
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Kategori
              <select name="category" required defaultValue="" className={inputClassName}>
                <option value="" disabled>
                  Pilih kategori
                </option>
                <option value="Sembako">Sembako</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Perawatan">Perawatan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Satuan
              <select name="unit" required defaultValue="" className={inputClassName}>
                <option value="" disabled>
                  Pilih satuan
                </option>
                <option value="pcs">Pcs</option>
                <option value="bungkus">Bungkus</option>
                <option value="botol">Botol</option>
                <option value="renceng">Renceng</option>
                <option value="karung">Karung</option>
                <option value="kilogram">Kilogram</option>
              </select>
            </label>

            <NumberField name="purchase_price" label="Harga beli" placeholder="58000" />
            <NumberField name="selling_price" label="Harga jual" placeholder="68000" />
            <NumberField name="current_stock" label="Stok awal" placeholder="20" />
            <NumberField name="minimum_stock" label="Batas stok minimum" placeholder="5" />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function NumberField({
  name,
  label,
  placeholder
}: {
  name: keyof Pick<
    ProductCreateInput,
    "purchase_price" | "selling_price" | "current_stock" | "minimum_stock"
  >;
  label: string;
  placeholder: string;
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <input
        type="number"
        name={name}
        required
        min={0}
        step={1}
        inputMode="numeric"
        placeholder={placeholder}
        className={inputClassName}
      />
    </label>
  );
}
