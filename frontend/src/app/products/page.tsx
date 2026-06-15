import { PageHeader } from "@/components/page-header";
import { ProductTable } from "@/components/product-table";
import { getProducts } from "@/lib/api";

export default async function ProductsPage() {
  const { data, source } = await getProducts();

  return (
    <main className="space-y-6">
      <PageHeader
        title="Produk & Stok"
        description="Pantau stok, harga jual, harga beli, dan status produk."
        actionLabel="Tambah Produk"
      />
      {source === "fallback" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Backend belum tersambung. Data contoh lokal sedang ditampilkan.
        </p>
      ) : null}
      <ProductTable products={data} />
    </main>
  );
}
