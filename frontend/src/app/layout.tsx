import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { getBusinessProfile } from "@/lib/api";

export const metadata: Metadata = {
  title: "Larisin",
  description: "Platform insight penjualan dan stok untuk UMKM Indonesia"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const business = await getBusinessProfile();
  return (
    <html lang="id">
      <body>
        <AppShell businessName={business.data.name}>{children}</AppShell>
      </body>
    </html>
  );
}
