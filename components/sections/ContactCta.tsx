import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import type { HomeContent } from '@/lib/schema';

export function ContactCta({ data }: { data: HomeContent['contactCta'] }) {
  return (
    <Section id="contact-cta">
      <Reveal>
        <div className="rounded-2xl bg-accent px-6 py-12 text-center text-white md:px-12 md:py-16">
          <h2 className="text-2xl font-semibold md:text-3xl">{data.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">{data.text}</p>
          <div className="mt-8">
            <Button href={data.link.href} variant="light">{data.link.label}</Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
