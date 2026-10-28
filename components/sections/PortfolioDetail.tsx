import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { ProjectCover } from '@/components/portfolio/ProjectCover';
import type { PortfolioItem } from '@/lib/schema';

function CaseSection({ title, children }: { title: string; children: React.ReactNode }) {
  const id = `case-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <Reveal>
      <section aria-labelledby={id}>
        <h2 id={id} className="mb-6 text-sm font-bold uppercase tracking-[0.14em] text-accent">
          {title}
        </h2>
        {children}
      </section>
    </Reveal>
  );
}

export function PortfolioDetail({ item, next }: { item: PortfolioItem; next?: PortfolioItem }) {
  const facts = [
    { label: 'Role', value: item.role },
    { label: 'Organization', value: item.organization },
    { label: 'Period', value: item.period },
    ...(item.team ? [{ label: 'Team', value: item.team }] : []),
  ];
  const gallery = item.gallery ?? [];
  const single = gallery.length === 1;

  return (
    <article>
      <ProjectCover item={item} className="h-[50vh] min-h-[22rem] rounded-none">
        <div className="flex h-full flex-col justify-end bg-gradient-to-t from-black/85 via-black/60 to-transparent px-4 pb-8 md:pb-12">
          <div className="mx-auto w-full max-w-3xl">
            <p className="mb-3 inline-block rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase leading-none tracking-widest text-accent">
              {item.field}
            </p>
            <h1 className="font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
              {item.title}
            </h1>
          </div>
        </div>
      </ProjectCover>

      <div className="border-b border-surface bg-white px-4">
        <dl
          className={`mx-auto grid max-w-3xl grid-cols-2 gap-x-6 gap-y-4 py-5 ${
            facts.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
          }`}
        >
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted">{f.label}</dt>
              <dd className="mt-1 font-heading text-sm font-semibold text-heading">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Section id="case-study">
        <div className="mx-auto max-w-3xl space-y-14 md:space-y-16">
          <CaseSection title="Story">
            <div className="space-y-4 text-lg leading-relaxed text-body">
              {item.situation.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>{item.task}</p>
            </div>
            {item.quote && (
              <blockquote className="mt-8 border-l-2 border-accent pl-5 font-serif text-2xl italic leading-snug text-accent md:text-3xl">
                {item.quote}
              </blockquote>
            )}
          </CaseSection>

          <CaseSection title="Contribution steps">
            <ol>
              {item.steps.map((step, i) => (
                <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < item.steps.length - 1 && (
                    <span aria-hidden="true" className="absolute bottom-0 left-4 top-8 w-px -translate-x-1/2 bg-accent/30" />
                  )}
                  <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="pt-0.5">
                    <h3 className="font-heading text-base font-semibold text-heading">{step.title}</h3>
                    <p className="mt-1 text-body">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CaseSection>

          <CaseSection title="Results">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {item.metrics.map((m) => (
                <div key={m.label} className="rounded-lg bg-white p-5 text-center shadow-sm">
                  <dt className="font-heading text-4xl font-bold leading-none text-accent">{m.value}</dt>
                  <dd className="mt-2 text-sm text-muted">{m.label}</dd>
                </div>
              ))}
            </dl>
            {item.resultNotes && item.resultNotes.length > 0 && (
              <ul className="mt-8 space-y-3">
                {item.resultNotes.map((note, i) => (
                  <li key={i} className="flex gap-3 text-body">
                    <Icon name="check-circle-fill" className="mt-0.5 text-accent" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            )}
          </CaseSection>

          {gallery.length > 0 && (
            <CaseSection title="Documentation">
              <div className={`grid gap-3 ${single ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
                {gallery.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${item.title}, documentation ${i + 1}`}
                    loading="lazy"
                    className={`w-full rounded object-cover ${single ? 'aspect-video' : 'aspect-[4/3]'}`}
                  />
                ))}
              </div>
            </CaseSection>
          )}

          <Reveal>
            <div className="flex flex-col gap-6 border-t border-accent/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Button href="/portfolio" variant="outline">
                  Back to portfolio
                </Button>
              </div>
              {next && (
                <Link href={`/portfolio/${next.slug}`} className="group sm:max-w-xs sm:text-right">
                  <span className="block text-xs font-medium uppercase tracking-wider text-muted">Next project →</span>
                  <span className="mt-1 block font-heading text-lg font-semibold leading-snug text-accent group-hover:underline">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </Section>
    </article>
  );
}
