import { getServices } from '@/lib/content';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { ServiceCard } from '@/components/sections/ServiceCard';

export default function ServicesPage() {
  const data = getServices();
  return (
    <Section id="services">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((s, i) => (
          <Reveal key={s.title} delay={i * 80}><ServiceCard service={s} /></Reveal>
        ))}
      </div>
    </Section>
  );
}
