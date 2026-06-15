import { PlaceholderPage } from "@/components/placeholder-page";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Pengaturan"
      description="Tempat mengelola profil toko, kategori usaha, preferensi stok minimum, dan akses pengguna."
      nextItems={["Nama toko", "Kategori usaha", "Hak akses Owner dan Staff"]}
    />
  );
}
