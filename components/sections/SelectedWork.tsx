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
}: {
  title: string;
  subtitle: string;
  items: PortfolioItem[];
  filters: PortfolioFilter[];
}) {
  if (items.length === 0) return null;
  return (
    <Section id="selected-work" className="bg-surface">
      <SectionTitle title={title} subtitle={subtitle} />
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, idx) => (
          <Reveal key={item.slug} delay={idx * 100} className="h-full">
            <ProjectCard item={item} tag={categoryTag(filters, item.category)} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 text-center">
        <Button href="/portfolio" variant="outline">See all projects</Button>
      </Reveal>
    </Section>
  );
}
