import { PlaceholderPage } from "@/components/placeholder-page";

export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Laporan"
      description="Ringkasan mingguan dan bulanan akan disiapkan setelah data transaksi tersimpan di database."
      nextItems={["Laporan penjualan", "Ringkasan keuntungan", "Export PDF/Excel"]}
    />
  );
}
