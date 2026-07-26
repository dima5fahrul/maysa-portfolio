'use client';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useCountUp } from '@/lib/useCountUp';
import type { AboutContent } from '@/lib/schema';

function StatItem({ label, value }: { label: string; value: number }) {
  const n = useCountUp(value);
  return (
    <div className="text-center">
      <span className="block text-4xl font-bold text-accent">{n}</span>
      <p className="mt-2 text-muted">{label}</p>
    </div>
  );
}

export function Stats({ data }: { data: AboutContent['stats'] }) {
  return (
    <Section id="stats">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {data.items.map((s) => <StatItem key={s.label} {...s} />)}
      </div>
    </Section>
  );
}
