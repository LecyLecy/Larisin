"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "D" },
  { href: "/transactions", label: "Transaksi", icon: "T" },
  { href: "/products", label: "Produk & Stok", icon: "P" },
  { href: "/supplier", label: "Supplier", icon: "S" },
  { href: "/insight", label: "Insight", icon: "I" },
  { href: "/reports", label: "Laporan", icon: "L" },
  { href: "/settings", label: "Pengaturan", icon: "G" }
];

export function AppShell({
  children,
  businessName
}: {
  children: React.ReactNode;
  businessName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7faf7]">
      <aside className="fixed inset-y-0 left-0 hidden w-68 border-r border-slate-200 bg-white px-5 py-6 lg:block">
        <Brand />
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-xs font-bold">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-68">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/92 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden">
              <Brand compact />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm text-slate-500">Halo, Bu Rina</p>
              <p className="font-semibold text-slate-900">{businessName}</p>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src="/brand/larisin-icon.png"
                alt="Logo Larisin"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
                priority
              />
            </div>
          </div>
        </header>

        <div className="px-4 pb-24 pt-6 lg:px-8 lg:pb-10">{children}</div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white p-2 lg:hidden">
        {navItems.slice(0, 4).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-2 py-2 text-center text-[11px] font-medium ${
                active ? "bg-brand-50 text-brand-700" : "text-slate-600"
              }`}
            >
              <span className="mx-auto mb-1 grid h-6 w-6 place-items-center rounded-md bg-slate-100 text-[10px] font-bold">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  const logoSize = compact ? 44 : 52;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-white ${
          compact ? "h-11 w-11" : "h-[52px] w-[52px]"
        }`}
      >
        <Image
          src="/brand/larisin-icon.png"
          alt="Logo Larisin"
          width={logoSize}
          height={logoSize}
          className={compact ? "h-11 w-11 object-contain" : "h-[52px] w-[52px] object-contain"}
          priority
        />
      </div>
      {!compact ? (
        <div>
          <p className="text-lg font-black text-slate-950">Larisin</p>
          <p className="text-xs text-slate-500">Insight UMKM</p>
        </div>
      ) : (
        <p className="text-lg font-black text-slate-950">Larisin</p>
      )}
    </div>
  );
}
