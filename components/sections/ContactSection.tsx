import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { ContactContent } from '@/lib/schema';

export function ContactSection({ data }: { data: ContactContent }) {
  return (
    <Section id="contact">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{data.title}</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight text-heading sm:text-4xl md:text-5xl">
            {data.heading}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{data.subtitle}</p>
        </Reveal>

        <Reveal delay={120} className="mt-8">
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            {data.direct.map((c, i) => (
              <Button key={c.href} href={c.href} variant={i === 0 ? 'solid' : 'outline'}>
                <Icon name={c.icon} className="text-base" />
                {c.action ?? c.title}
              </Button>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">{data.direct.map((c) => c.text).join(' · ')}</p>
        </Reveal>

        {data.profiles.length > 0 && (
          <Reveal delay={200} className="mt-12">
            <p className="flex items-center gap-4 text-xs uppercase tracking-[0.14em] text-muted before:h-px before:flex-1 before:bg-accent/20 after:h-px after:flex-1 after:bg-accent/20">
              {data.profilesTitle}
            </p>
            <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
              {data.profiles.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-4 rounded-lg bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-xl text-white">
                    <Icon name={p.icon} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-heading">{p.title}</span>
                    <span className="block truncate text-muted">{p.text}</span>
                  </span>
                  <Icon name="arrow-up-right" className="text-accent" />
                </a>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
