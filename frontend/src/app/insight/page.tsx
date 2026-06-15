import { PlaceholderPage } from "@/components/placeholder-page";

export default function InsightPage() {
  return (
    <PlaceholderPage
      title="Insight"
      description="Ruang untuk rekomendasi produk paling untung, produk laku dengan margin kecil, dan saran restock."
      nextItems={["Produk paling menguntungkan", "Produk lambat terjual", "Estimasi hari menuju stok habis"]}
    />
  );
}
