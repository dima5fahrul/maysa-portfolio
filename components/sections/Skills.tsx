'use client';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import type { AboutContent } from '@/lib/schema';

export function Skills({ data }: { data: AboutContent['skills'] }) {
  return (
    <Section id="skills" className="bg-surface">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
        {data.columns.flatMap((col) => col.skills).map((s) => (
          <div key={s.name}>
            <div className="flex justify-between text-sm font-medium">
              <span>{s.name}</span><span>{s.value}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded bg-gray-300">
              <div data-skill-bar className="h-2 rounded bg-accent transition-[width] duration-1000" style={{ width: `${s.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
