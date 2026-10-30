import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { categoryTag } from '@/lib/portfolio';
import type { PortfolioFilter, PortfolioItem } from '@/lib/schema';

export function SelectedWork({
  title,
  subtitle,
  items,
  filters,
  background = 'surface',
}: {
  title: string;
  subtitle: string;
  items: PortfolioItem[];
  filters: PortfolioFilter[];
  background?: 'surface' | 'page';
}) {
  if (items.length === 0) return null;
  // Cards take the opposite tone so a no-photo cover never blends into the section.
  const cardTone = background === 'surface' ? 'page' : 'surface';
  return (
    <Section id="selected-work" className={background === 'surface' ? 'bg-surface' : ''}>
      <SectionTitle title={title} subtitle={subtitle} />
      <div className="flex flex-wrap justify-center gap-6">
        {items.map((item, idx) => (
          <Reveal key={item.slug} delay={idx * 100} className="w-full md:w-[calc((100%-3rem)/3)]">
            <ProjectCard item={item} tag={categoryTag(filters, item.category)} tone={cardTone} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 text-center">
        <Button href="/portfolio" variant="outline">See all projects</Button>
      </Reveal>
    </Section>
  );
}
