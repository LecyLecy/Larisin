"use client";

import { useState } from "react";

import { PageHeader } from "@/components/page-header";
import { ProductFormModal } from "@/components/product-form-modal";
import { ProductTable } from "@/components/product-table";
import { InventoryMovementList } from "@/components/inventory-movement-list";
import { ProductEditModal } from "@/components/product-edit-modal";
import { StockAdjustmentModal } from "@/components/stock-adjustment-modal";
import { StockInModal } from "@/components/stock-in-modal";
import type { InventoryMovement, Product, StockInResult, Supplier } from "@/lib/types";

export function ProductsView({
  initialProducts,
  initialMovements,
  suppliers,
  dataSource
}: {
  initialProducts: Product[];
  initialMovements: InventoryMovement[];
  suppliers: Supplier[];
  dataSource: "api" | "fallback";
}) {
  const [products, setProducts] = useState(initialProducts);
  const [movements, setMovements] = useState(initialMovements);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [stockInProduct, setStockInProduct] = useState<Product | null>(null);
  const [adjustmentProduct, setAdjustmentProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleCreated(product: Product) {
    setProducts((currentProducts) =>
      [...currentProducts, product].toSorted((left, right) => left.name.localeCompare(right.name, "id"))
    );
    setSuccessMessage(`${product.name} berhasil ditambahkan.`);
    setIsFormOpen(false);
  }

  function handleStockIn(result: StockInResult) {
    setProducts((current) =>
      current.map((product) => (product.id === result.product.id ? result.product : product))
    );
    setMovements((current) => [result.movement, ...current]);
    setSuccessMessage(`${result.product.name} bertambah ${result.movement.quantity_delta} ${result.product.unit}.`);
    setStockInProduct(null);
  }

  function handleAdjustment(result: StockInResult) {
    setProducts((current) =>
      current.map((product) => (product.id === result.product.id ? result.product : product))
    );
    setMovements((current) => [result.movement, ...current]);
    setSuccessMessage(`${result.product.name} disesuaikan ${result.movement.quantity_delta > 0 ? "+" : ""}${result.movement.quantity_delta} ${result.product.unit}.`);
    setAdjustmentProduct(null);
  }

  function handleProductUpdated(product: Product) {
    setProducts((current) => current.map((item) => (item.id === product.id ? product : item)));
    setSuccessMessage(`${product.name} berhasil diperbarui.`);
    setEditingProduct(null);
  }

  function handleProductDeactivated(product: Product) {
    setProducts((current) => current.filter((item) => item.id !== product.id));
    setSuccessMessage(`${product.name} dinonaktifkan.`);
    setEditingProduct(null);
  }

  return (
    <main className="space-y-6">
      <PageHeader
        title="Produk & Stok"
        description="Pantau stok, harga jual, harga beli, dan status produk."
        action={
          <button
            type="button"
            onClick={() => {
              setSuccessMessage(null);
              setIsFormOpen(true);
            }}
            className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2"
          >
            Tambah Produk
          </button>
        }
      />

      {dataSource === "fallback" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Backend belum tersambung. Data contoh lokal sedang ditampilkan; penambahan produk
          memerlukan backend aktif.
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

      <ProductTable
        products={products}
        onStockIn={setStockInProduct}
        onAdjustStock={setAdjustmentProduct}
        onEdit={setEditingProduct}
      />
      <InventoryMovementList movements={movements} />

      <ProductFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onCreated={handleCreated}
      />
      <StockInModal
        product={stockInProduct}
        suppliers={suppliers}
        onClose={() => setStockInProduct(null)}
        onCompleted={handleStockIn}
      />
      <StockAdjustmentModal
        product={adjustmentProduct}
        onClose={() => setAdjustmentProduct(null)}
        onCompleted={handleAdjustment}
      />
      <ProductEditModal
        key={editingProduct?.id ?? "closed"}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSaved={handleProductUpdated}
        onDeactivated={handleProductDeactivated}
      />
    </main>
  );
}
