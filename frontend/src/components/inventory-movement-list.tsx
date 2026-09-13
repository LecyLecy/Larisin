import { formatTransactionDate } from "@/lib/format";
import type { InventoryMovement } from "@/lib/types";

const movementLabels: Record<InventoryMovement["movement_type"], string> = {
  stock_in: "Stok masuk",
  sale: "Penjualan",
  adjustment: "Penyesuaian",
  return: "Pengembalian"
};

export function InventoryMovementList({ movements }: { movements: InventoryMovement[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-200 p-5">
        <h2 className="font-bold text-slate-950">Riwayat Mutasi Stok</h2>
        <p className="mt-1 text-sm text-slate-500">Perubahan stok dari restock dan penjualan.</p>
      </div>
      {movements.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="font-semibold text-slate-900">Belum ada mutasi stok</p>
          <p className="mt-2 text-sm text-slate-500">Restock dan transaksi penjualan akan muncul di sini.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {movements.map((movement) => {
            const isIncrease = movement.quantity_delta > 0;
            return (
              <div key={movement.id} className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-semibold text-slate-950">{movement.product_name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatTransactionDate(movement.created_at)} · {movementLabels[movement.movement_type]}
                  </p>
                  {movement.notes ? <p className="mt-1 text-sm text-slate-500">{movement.notes}</p> : null}
                  {movement.supplier_name ? (
                    <p className="mt-1 text-sm text-slate-500">Dari supplier: {movement.supplier_name}</p>
                  ) : null}
                </div>
                <div className="md:text-right">
                  <p className={`font-bold ${isIncrease ? "text-brand-700" : "text-red-700"}`}>
                    {isIncrease ? "+" : ""}{movement.quantity_delta} {movement.product_unit}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Stok akhir: {movement.stock_after}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
