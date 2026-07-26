'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Icon } from '@/components/ui/Icon';
import type { PortfolioContent } from '@/lib/schema';

export function PortfolioGallery({ data }: { data: PortfolioContent }) {
  const [active, setActive] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (active === 'all' ? data.items : data.items.filter((i) => i.category === active)),
    [active, data.items]
  );
  const slides = visible.map((i) => ({ src: i.image, title: i.title }));

  return (
    <Section id="portfolio">
      <SectionTitle title={data.title} subtitle={data.subtitle} />

      <ul className="mb-8 flex flex-wrap justify-center gap-4">
        {data.filters.map((f) => (
          <li key={f.key}>
            <button
              onClick={() => setActive(f.key)}
              className={`text-sm font-medium ${active === f.key ? 'text-accent' : 'text-heading hover:text-accent'}`}
            >
              {f.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, idx) => (
          <div key={item.slug} className="group relative overflow-hidden rounded">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <h4 className="text-lg font-semibold text-white">{item.title}</h4>
              <p className="text-sm text-white/80">{item.description}</p>
              <div className="mt-2 flex gap-4 text-white">
                <button aria-label={`Zoom ${item.title}`} onClick={() => setLightboxIndex(idx)}><Icon name="zoom-in" className="text-xl" /></button>
                <Link aria-label={`Details ${item.title}`} href={`/portfolio/${item.slug}`}><Icon name="link-45deg" className="text-xl" /></Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex !== null}
        index={lightboxIndex ?? 0}
        close={() => setLightboxIndex(null)}
        slides={slides}
      />
    </Section>
  );
}
