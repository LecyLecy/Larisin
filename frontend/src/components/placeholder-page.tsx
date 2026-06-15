import { PageHeader } from "@/components/page-header";

export function PlaceholderPage({
  title,
  description,
  nextItems
}: {
  title: string;
  description: string;
  nextItems: string[];
}) {
  return (
    <main className="space-y-6">
      <PageHeader title={title} description={description} />
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="font-bold text-slate-950">Arah fitur berikutnya</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {nextItems.map((item) => (
            <li key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
