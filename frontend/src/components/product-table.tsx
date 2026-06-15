import { formatRupiah } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductTable({
  products,
  compact = false,
  title = "Daftar Produk"
}: {
  products: Product[];
  compact?: boolean;
  title?: string;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-200 p-5">
        <h2 className="font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">Data contoh untuk alur produk dan stok.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Produk</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Stok</th>
              {!compact ? <th className="px-5 py-3">Harga Jual</th> : null}
              <th className="px-5 py-3">Status</th>
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
                {!compact ? <td className="px-5 py-4 text-slate-600">{formatRupiah(product.selling_price)}</td> : null}
                <td className="px-5 py-4">
                  <StatusBadge status={product.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
