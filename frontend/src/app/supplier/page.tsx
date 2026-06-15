import { PlaceholderPage } from "@/components/placeholder-page";

export default function SupplierPage() {
  return (
    <PlaceholderPage
      title="Supplier"
      description="Nantinya halaman ini membantu membandingkan pemasok berdasarkan harga, kategori, dan ketepatan pengiriman."
      nextItems={["Daftar supplier", "Riwayat pembelian", "Perbandingan harga per kategori"]}
    />
  );
}
