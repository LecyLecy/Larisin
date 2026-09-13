"use client";

import { useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SupplierFormModal } from "@/components/supplier-form-modal";
import type { Supplier } from "@/lib/types";

export function SupplierView({
  initialSuppliers,
  dataSource
}: {
  initialSuppliers: Supplier[];
  dataSource: "api" | "fallback";
}) {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleCreated(supplier: Supplier) {
    setSuppliers((current) =>
      [...current, supplier].toSorted((left, right) => left.name.localeCompare(right.name, "id"))
    );
    setSuccessMessage(`${supplier.name} berhasil ditambahkan.`);
    setIsFormOpen(false);
  }

  return (
    <main className="space-y-6">
      <PageHeader
        title="Supplier"
        description="Catat pemasok dan gunakan saat menambahkan stok masuk."
        action={
          <button type="button" onClick={() => { setSuccessMessage(null); setIsFormOpen(true); }} className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-800">
            Tambah Supplier
          </button>
        }
      />
      {dataSource === "fallback" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Backend belum tersambung. Supplier memerlukan API aktif.</p>
      ) : null}
      {successMessage ? (
        <div role="status" className="flex items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>{successMessage}</span>
          <button type="button" onClick={() => setSuccessMessage(null)} className="font-semibold text-emerald-900 hover:underline">Tutup</button>
        </div>
      ) : null}
      {suppliers.length === 0 ? (
        <EmptyState text="Belum ada supplier. Tambahkan pemasok pertama untuk mencatat asal stok masuk." />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {suppliers.map((supplier) => (
            <article key={supplier.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <h2 className="font-bold text-slate-950">{supplier.name}</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <div><dt className="text-slate-500">Kontak</dt><dd className="mt-1 text-slate-800">{supplier.contact ?? "Belum dicatat"}</dd></div>
                <div><dt className="text-slate-500">Kategori</dt><dd className="mt-1 text-slate-800">{supplier.product_category ?? "Belum dicatat"}</dd></div>
                <div><dt className="text-slate-500">Rata-rata pengiriman</dt><dd className="mt-1 text-slate-800">{supplier.average_delivery_days === null ? "Belum dicatat" : `${supplier.average_delivery_days} hari`}</dd></div>
              </dl>
            </article>
          ))}
        </section>
      )}
      <SupplierFormModal open={isFormOpen} onClose={() => setIsFormOpen(false)} onCreated={handleCreated} />
    </main>
  );
}
