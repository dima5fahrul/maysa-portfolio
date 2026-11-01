'use client';
import { useEffect, useMemo, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { FeaturedProject } from '@/components/portfolio/FeaturedProject';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { categoryImage, categoryTag } from '@/lib/portfolio';
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

      <ul className="mb-12 grid grid-cols-3 gap-x-3 gap-y-5 sm:gap-x-4 lg:grid-cols-6">
        {data.filters.map((f) => {
          const on = active === f.key;
          return (
            <li key={f.key}>
              <button type="button" aria-pressed={on} onClick={() => choose(f.key)} className="group block w-full text-center">
                <span
                  className={`block overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-page transition ${
                    on ? 'ring-accent' : 'ring-transparent group-hover:ring-accent/40'
                  }`}
                >
                  {f.image ? (
                    <img
                      src={f.image}
                      alt=""
                      className={`aspect-square w-full object-cover transition duration-300 group-hover:scale-105 ${
                        on ? '' : 'opacity-75 group-hover:opacity-100'
                      }`}
                    />
                  ) : (
                    <span className="flex aspect-square items-center justify-center bg-surface font-serif text-5xl italic text-accent">
                      {f.label.charAt(0)}
                    </span>
                  )}
                </span>
                <span className={`mt-2 block text-sm font-medium leading-snug ${on ? 'text-accent' : 'text-heading'}`}>
                  {f.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {featured && (
        <Reveal className="mb-6">
          <FeaturedProject item={featured} art={categoryImage(data.filters, featured.category)} />
        </Reveal>
      )}

      {grid.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((item, idx) => (
            <Reveal key={item.slug} delay={(idx % 3) * 100} className="h-full">
              <ProjectCard
                item={item}
                tag={categoryTag(data.filters, item.category)}
                art={categoryImage(data.filters, item.category)}
              />
            </Reveal>
          ))}
        </div>
      ) : (
        !featured && <p className="text-center text-muted">No projects in this category yet.</p>
      )}
    </Section>
  );
}
