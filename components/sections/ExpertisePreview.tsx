import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { HomeContent, Service } from '@/lib/schema';

// Titles only: the descriptions live on the Expertise page, so Home stays a summary.
export function ExpertisePreview({ data, items }: { data: HomeContent['expertise']; items: Service[] }) {
  if (items.length === 0) return null;
  return (
    <Section id="expertise" className="bg-surface">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={(i % 3) * 100} className="h-full">
              <div className="flex h-full items-center gap-4 rounded-lg bg-white p-5 shadow-sm">
                <span
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl text-white"
                  style={{ backgroundColor: s.color }}
                >
                  <Icon name={s.icon} />
                </span>
                <h3 className="font-semibold leading-snug">{s.title}</h3>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
      <Reveal className="mt-10 text-center">
        <Button href={data.link.href} variant="outline">{data.link.label}</Button>
      </Reveal>
    </Section>
  );
}
