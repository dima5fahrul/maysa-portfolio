export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-12 text-center">
      <h2 className="relative inline-block pb-2 text-3xl font-semibold uppercase tracking-wide after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-16 after:-translate-x-1/2 after:bg-accent">
        {title}
      </h2>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-muted">{subtitle}</p>}
    </div>
  );
}
