import Link from 'next/link';
import type { PortfolioItem } from '@/lib/schema';
import { ProjectCover } from './ProjectCover';

export function ProjectCard({
  item,
  tag,
  tone,
}: {
  item: PortfolioItem;
  tag: string;
  tone?: 'surface' | 'page';
}) {
  const metric = item.metrics[0];
  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      <ProjectCover item={item} tag={tag} tone={tone} className="h-44 shrink-0" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 font-heading text-lg font-semibold leading-snug text-heading">{item.title}</h3>
        <p className="text-sm text-muted">{`${item.organization} · ${item.period}`}</p>
        <p className="mt-1">
          <span className="inline-block rounded-xl bg-accent/10 px-3 py-1 text-xs font-semibold leading-snug text-accent">
            {`${metric.value} ${metric.label}`}
          </span>
        </p>
        <span className="mt-auto pt-3 text-sm font-semibold text-accent">View case study →</span>
      </div>
    </Link>
  );
}
