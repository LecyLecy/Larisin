import { formatRupiah } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductTable({
  products,
  compact = false,
  title = "Daftar Produk",
  emptyTitle = "Belum ada produk",
  emptyDescription = "Tambahkan produk pertama untuk mulai memantau stok.",
  onStockIn,
  onAdjustStock,
  onEdit
}: {
  products: Product[];
  compact?: boolean;
  title?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onStockIn?: (product: Product) => void;
  onAdjustStock?: (product: Product) => void;
  onEdit?: (product: Product) => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-200 p-5">
        <h2 className="font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">Harga dan status stok produk aktif.</p>
      </div>
      {products.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="font-semibold text-slate-900">{emptyTitle}</p>
          <p className="mt-2 text-sm text-slate-500">{emptyDescription}</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-slate-100 md:hidden">
            {products.map((product) => (
              <div key={product.id} className="space-y-3 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{product.category}</p>
                  </div>
                  <StatusBadge status={product.status} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Stok</p>
                    <p className="mt-1 font-medium text-slate-700">
                      {product.current_stock} {product.unit}
                    </p>
                  </div>
                  {!compact ? (
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Harga jual</p>
                      <p className="mt-1 font-medium text-slate-700">
                        {formatRupiah(product.selling_price)}
                      </p>
                    </div>
                  ) : null}
                </div>
                {onStockIn || onAdjustStock || onEdit ? (
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                    {onStockIn ? <button type="button" onClick={() => onStockIn(product)} className="text-brand-700 hover:underline">Tambah stok</button> : null}
                    {onAdjustStock ? <button type="button" onClick={() => onAdjustStock(product)} className="text-slate-700 hover:underline">Sesuaikan</button> : null}
                    {onEdit ? <button type="button" onClick={() => onEdit(product)} className="text-slate-700 hover:underline">Edit</button> : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Produk</th>
                  <th className="px-5 py-3">Kategori</th>
                  <th className="px-5 py-3">Stok</th>
                  {!compact ? <th className="px-5 py-3">Harga Jual</th> : null}
                  <th className="px-5 py-3">Status</th>
                  {onStockIn || onAdjustStock || onEdit ? <th className="px-5 py-3 text-right">Aksi</th> : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-5 py-4 font-semibold text-slate-900">{product.name}</td>
                    <td className="px-5 py-4 text-slate-600">{product.category}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {product.current_stock} {product.unit}
                    </td>
                    {!compact ? (
                      <td className="px-5 py-4 text-slate-600">
                        {formatRupiah(product.selling_price)}
                      </td>
                    ) : null}
                    <td className="px-5 py-4">
                      <StatusBadge status={product.status} />
                    </td>
                    {onStockIn || onAdjustStock || onEdit ? (
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-3 font-semibold">
                          {onStockIn ? <button type="button" onClick={() => onStockIn(product)} className="text-brand-700 hover:underline">Tambah stok</button> : null}
                          {onAdjustStock ? <button type="button" onClick={() => onAdjustStock(product)} className="text-slate-700 hover:underline">Sesuaikan</button> : null}
                          {onEdit ? <button type="button" onClick={() => onEdit(product)} className="text-slate-700 hover:underline">Edit</button> : null}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: Product["status"] }) {
  const styles = {
    Aman: "bg-brand-50 text-brand-700 border-brand-100",
    Menipis: "bg-amber-50 text-amber-800 border-amber-200",
    Habis: "bg-red-50 text-red-700 border-red-200"
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${styles[status]}`}>
      {status}
    </span>
  );
}
