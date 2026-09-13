export function PageHeader({
  title,
  description,
  actionLabel,
  action
}: {
  title: string;
  description: string;
  actionLabel?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-sm font-medium text-brand-700">Larisin</p>
        <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {action ?? (actionLabel ? (
        <button className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-800">
          {actionLabel}
        </button>
      ) : null)}
    </section>
  );
}
