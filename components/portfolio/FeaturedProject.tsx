import Link from 'next/link';
import type { PortfolioItem } from '@/lib/schema';
import { ProjectCover } from './ProjectCover';

export function FeaturedProject({ item }: { item: PortfolioItem }) {
  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg md:flex-row"
    >
      <ProjectCover item={item} tag="Featured" className="h-56 shrink-0 md:h-auto md:min-h-[22rem] md:w-[55%]" />
      <div className="flex flex-1 flex-col gap-3 p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">{item.field}</p>
        <h3 className="font-heading text-2xl font-semibold leading-snug text-heading">{item.title}</h3>
        <p className="text-sm text-muted">{`${item.role} · ${item.organization} · ${item.period}`}</p>
        <p className="text-body">{item.summary}</p>
        <dl className="my-1 flex flex-wrap gap-x-8 gap-y-3">
          {item.metrics.slice(0, 2).map((m) => (
            <div key={m.label}>
              <dt className="font-heading text-3xl font-bold leading-none text-accent">{m.value}</dt>
              <dd className="mt-1 text-xs text-muted">{m.label}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-2 inline-block self-start rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-wide text-white transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:bg-accent/85 group-hover:shadow-lg group-hover:shadow-accent/25">
          Read case study
        </span>
      </div>
    </Link>
  );
}
