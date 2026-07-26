import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Icon } from '@/components/ui/Icon';
import type { AboutContent } from '@/lib/schema';

export function AboutIntro({ intro, title, subtitle }: { intro: AboutContent['intro']; title: string; subtitle: string }) {
  return (
    <Section id="about">
      <SectionTitle title={title} subtitle={subtitle} />
      <div className="grid gap-8 md:grid-cols-3">
        <img src={intro.image} alt="" className="w-full rounded" />
        <div className="md:col-span-2">
          <h3 className="text-2xl font-semibold">{intro.heading}</h3>
          <p className="mt-3 italic text-muted">{intro.lead}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {intro.facts.map((f) => (
              <li key={f.label} className="flex items-center gap-2">
                <Icon name="chevron-right" className="text-accent" />
                <strong>{f.label}:</strong> <span>{f.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">{intro.body}</p>
        </div>
      </div>
    </Section>
  );
}
