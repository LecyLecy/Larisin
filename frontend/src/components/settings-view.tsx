"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { updateBusinessProfile } from "@/lib/api";
import type { BusinessProfile } from "@/lib/types";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export function SettingsView({
  initialProfile,
  dataSource
}: {
  initialProfile: BusinessProfile;
  dataSource: "api" | "fallback";
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const businessCategory = String(formData.get("business_category") ?? "").trim();
    if (name.length < 2) {
      setErrorMessage("Nama usaha minimal dua karakter.");
      return;
    }
    setErrorMessage(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      const updated = await updateBusinessProfile({
        name,
        business_category: businessCategory || null
      });
      setProfile(updated);
      setMessage("Profil usaha berhasil diperbarui.");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Profil belum dapat disimpan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="space-y-6">
      <PageHeader title="Pengaturan" description="Kelola identitas usaha yang digunakan di Larisin." />
      {dataSource === "fallback" ? <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Backend belum tersambung. Perubahan profil memerlukan API aktif.</p> : null}
      <section className="max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="font-bold text-slate-950">Profil Usaha</h2>
        <p className="mt-1 text-sm text-slate-500">Nama ini akan tampil pada header aplikasi.</p>
        <form noValidate onSubmit={handleSubmit} className="mt-5 space-y-5">
          {errorMessage ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
          {message ? <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p> : null}
          <label className="block text-sm font-semibold text-slate-700">Nama usaha<input name="name" key={`name-${profile.name}`} defaultValue={profile.name} minLength={2} maxLength={120} required className={inputClassName} /></label>
          <label className="block text-sm font-semibold text-slate-700">Kategori usaha (opsional)<input name="business_category" key={`category-${profile.business_category ?? "empty"}`} defaultValue={profile.business_category ?? ""} maxLength={80} className={inputClassName} placeholder="Contoh: Toko Kelontong" /></label>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">Mata uang: <span className="font-semibold text-slate-900">{profile.currency_code}</span></div>
          <div className="border-t border-slate-200 pt-5"><button type="submit" disabled={isSubmitting} className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-800 disabled:opacity-60">{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</button></div>
        </form>
      </section>
    </main>
  );
}
