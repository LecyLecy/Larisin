"use client";

import { FormEvent, useMemo, useState } from "react";

import { createTransaction } from "@/lib/api";
import { formatRupiah } from "@/lib/format";
import type { Product, Transaction, TransactionCreateInput } from "@/lib/types";

type CartItem = {
  product: Product;
  quantity: number;
  discount: number;
};

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export function TransactionFormModal({
  open,
  products,
  onClose,
  onCreated
}: {
  open: boolean;
  products: Product[];
  onClose: () => void;
  onCreated: (transaction: Transaction) => void;
}) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<Transaction["payment_method"]>("Tunai");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableProducts = products.filter((product) => product.current_stock > 0);
  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (total, item) => total + item.product.selling_price * item.quantity,
      0
    );
    const discount = cart.reduce((total, item) => total + item.discount, 0);
    return { subtotal, discount, total: subtotal - discount };
  }, [cart]);

  if (!open) {
    return null;
  }

  function resetForm() {
    setSelectedProductId("");
    setSelectedQuantity(1);
    setCart([]);
    setPaymentMethod("Tunai");
    setNotes("");
    setErrorMessage(null);
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }
    resetForm();
    onClose();
  }

  function addToCart() {
    setErrorMessage(null);
    const product = availableProducts.find((item) => item.id === selectedProductId);
    if (!product) {
      setErrorMessage("Pilih produk yang masih memiliki stok.");
      return;
    }
    if (!Number.isInteger(selectedQuantity) || selectedQuantity < 1) {
      setErrorMessage("Jumlah harus minimal 1.");
      return;
    }

    const existingItem = cart.find((item) => item.product.id === product.id);
    const totalQuantity = (existingItem?.quantity ?? 0) + selectedQuantity;
    if (totalQuantity > product.current_stock) {
      setErrorMessage(`Stok ${product.name} tersisa ${product.current_stock} ${product.unit}.`);
      return;
    }

    setCart((current) =>
      existingItem
        ? current.map((item) =>
            item.product.id === product.id ? { ...item, quantity: totalQuantity } : item
          )
        : [...current, { product, quantity: selectedQuantity, discount: 0 }]
    );
    setSelectedProductId("");
    setSelectedQuantity(1);
  }

  function updateCartItem(productId: string, field: "quantity" | "discount", value: number) {
    setCart((current) =>
      current.map((item) => {
        if (item.product.id !== productId) {
          return item;
        }
        if (field === "quantity") {
          const quantity = Math.min(item.product.current_stock, Math.max(1, value || 1));
          return { ...item, quantity, discount: Math.min(item.discount, quantity * item.product.selling_price) };
        }
        return {
          ...item,
          discount: Math.min(item.quantity * item.product.selling_price, Math.max(0, value || 0))
        };
      })
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    if (cart.length === 0) {
      setErrorMessage("Tambahkan minimal satu produk ke keranjang.");
      return;
    }

    setIsSubmitting(true);
    const payload: TransactionCreateInput = {
      payment_method: paymentMethod,
      notes: notes.trim() || undefined,
      items: cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        discount: item.discount
      }))
    };

    try {
      const transaction = await createTransaction(payload);
      resetForm();
      onCreated(transaction);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Transaksi belum dapat disimpan. Coba lagi."
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
        aria-labelledby="transaction-form-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="transaction-form-title" className="text-lg font-bold text-slate-950">
              Tambah Transaksi
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Harga produk dan stok akan diverifikasi lagi saat transaksi disimpan.
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

        <form noValidate onSubmit={handleSubmit} className="space-y-5 p-5">
          {errorMessage ? (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_120px_auto] sm:items-end">
              <label className="text-sm font-semibold text-slate-700">
                Produk
                <select
                  value={selectedProductId}
                  onChange={(event) => setSelectedProductId(event.target.value)}
                  className={inputClassName}
                >
                  <option value="">Pilih produk</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.current_stock} {product.unit})
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Jumlah
                <input
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={selectedQuantity}
                  onChange={(event) => setSelectedQuantity(Number(event.target.value))}
                  className={inputClassName}
                />
              </label>
              <button
                type="button"
                onClick={addToCart}
                className="rounded-lg border border-brand-700 bg-white px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
              >
                Tambah ke Keranjang
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-slate-200">
            <div className="border-b border-slate-200 px-4 py-3">
              <h3 className="font-bold text-slate-950">Keranjang</h3>
            </div>
            {cart.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                Pilih produk untuk mulai membuat transaksi.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_110px_130px_auto] sm:items-end">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{item.product.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatRupiah(item.product.selling_price)} / {item.product.unit}
                      </p>
                    </div>
                    <label className="text-xs font-semibold text-slate-600">
                      Jumlah
                      <input
                        type="number"
                        min={1}
                        max={item.product.current_stock}
                        value={item.quantity}
                        onChange={(event) =>
                          updateCartItem(item.product.id, "quantity", Number(event.target.value))
                        }
                        className={inputClassName}
                      />
                    </label>
                    <label className="text-xs font-semibold text-slate-600">
                      Diskon
                      <input
                        type="number"
                        min={0}
                        max={item.quantity * item.product.selling_price}
                        value={item.discount}
                        onChange={(event) =>
                          updateCartItem(item.product.id, "discount", Number(event.target.value))
                        }
                        className={inputClassName}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setCart((current) =>
                          current.filter((cartItem) => cartItem.product.id !== item.product.id)
                        )
                      }
                      className="pb-2.5 text-sm font-semibold text-red-700 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Metode pembayaran
              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value as Transaction["payment_method"])
                }
                className={inputClassName}
              >
                <option value="Tunai">Tunai</option>
                <option value="QRIS">QRIS</option>
                <option value="Transfer">Transfer</option>
                <option value="Debit/Kredit">Debit/Kredit</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Catatan (opsional)
              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                maxLength={500}
                placeholder="Contoh: Pesanan pelanggan tetap"
                className={inputClassName}
              />
            </label>
          </div>

          <section className="rounded-lg bg-slate-950 p-4 text-white">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Subtotal</span>
              <span>{formatRupiah(totals.subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
              <span>Diskon</span>
              <span>{formatRupiah(totals.discount)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-700 pt-3">
              <span className="font-bold">Total</span>
              <span className="text-lg font-black">{formatRupiah(totals.total)}</span>
            </div>
          </section>

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
              disabled={isSubmitting || cart.length === 0}
              className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
