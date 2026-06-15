import type { Recommendation } from "@/lib/types";

export function RecommendationCard({ item }: { item: Recommendation }) {
  return (
    <article className="rounded-lg border border-amber-200 bg-white p-5 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Saran</p>
      <h3 className="mt-2 font-bold text-slate-950">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
      <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
        {item.action}
      </p>
    </article>
  );
}
