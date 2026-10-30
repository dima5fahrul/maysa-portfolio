'use client';
import { useEffect, useMemo, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { FeaturedProject } from '@/components/portfolio/FeaturedProject';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { categoryTag } from '@/lib/portfolio';
import type { PortfolioContent } from '@/lib/schema';

export function PortfolioGallery({ data }: { data: PortfolioContent }) {
  const [active, setActive] = useState('all');

  // Static export: read ?category= on the client (useSearchParams would need a Suspense fallback).
  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('category');
    if (key && data.filters.some((f) => f.key === key)) setActive(key);
  }, [data.filters]);

  const choose = (key: string) => {
    setActive(key);
    const url = new URL(window.location.href);
    if (key === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', key);
    window.history.replaceState(window.history.state, '', url);
  };

  const { featured, grid } = useMemo(() => {
    if (active !== 'all') return { featured: undefined, grid: data.items.filter((i) => i.category === active) };
    const top = data.items.find((i) => i.featured);
    return { featured: top, grid: data.items.filter((i) => i !== top) };
  }, [active, data.items]);

  return (
    <Section id="portfolio">
      <SectionTitle title={data.title} subtitle={data.subtitle} />

      <ul className="mb-10 flex flex-wrap justify-center gap-3">
        {data.filters.map((f) => (
          <li key={f.key}>
            <button
              type="button"
              aria-pressed={active === f.key}
              onClick={() => choose(f.key)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                active === f.key
                  ? 'border-accent bg-accent text-white'
                  : 'border-accent/30 bg-white text-heading hover:border-accent hover:text-accent'
              }`}
            >
              {f.label}
            </button>
          </li>
        ))}
      </ul>

      {featured && (
        <Reveal className="mb-6">
          <FeaturedProject item={featured} />
        </Reveal>
      )}

      {grid.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((item, idx) => (
            <Reveal key={item.slug} delay={(idx % 3) * 100} className="h-full">
              <ProjectCard item={item} tag={categoryTag(data.filters, item.category)} />
            </Reveal>
          ))}
        </div>
      ) : (
        !featured && <p className="text-center text-muted">No projects in this category yet.</p>
      )}
    </Section>
  );
}
