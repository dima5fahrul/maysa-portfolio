'use client';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { useInView } from '@/lib/useInView';
import type { AboutContent } from '@/lib/schema';

function SkillBar({ name, value, delay }: { name: string; value: number; delay: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref}>
      <div className="flex justify-between text-sm font-medium">
        <span>{name}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-2 w-full rounded bg-black/10">
        <div
          data-skill-bar
          className="h-2 rounded bg-accent transition-[width] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: inView ? `${value}%` : '0%', transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

export function Skills({ data }: { data: AboutContent['skills'] }) {
  const skills = data.columns.flatMap((col) => col.skills);
  return (
    <Section id="skills" className="bg-surface">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
        {skills.map((s, i) => (
          <Reveal key={s.name} delay={i * 80}>
            <SkillBar name={s.name} value={s.value} delay={i * 80} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
