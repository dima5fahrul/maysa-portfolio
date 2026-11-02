import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { LightboxGroup, LightboxThumb } from '@/components/ui/Lightbox';
import type { ResumeContent, ResumeItem } from '@/lib/schema';

function ResumeEntry({ item, thumb }: { item: ResumeItem; thumb?: React.ReactNode }) {
  return (
    <div className={`mb-6 border-l-2 border-accent/30 pl-4 ${thumb ? 'flex items-start gap-4' : ''}`}>
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold uppercase">{item.heading}</h4>
        {item.period && <h5 className="mt-1 inline-block rounded bg-surface px-2 py-0.5 text-sm">{item.period}</h5>}
        {item.place && <p className="mt-1 italic text-muted">{item.place}</p>}
        {item.summary && <p className="mt-2">{item.summary}</p>}
        {item.bullets && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            {item.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
          </ul>
        )}
      </div>
      {thumb}
    </div>
  );
}

/** Renders a group's items; items with an image get a thumbnail that opens the group's lightbox. */
function ResumeItems({ items }: { items: ResumeItem[] }) {
  const withImage = items.filter((i) => i.image);
  if (withImage.length === 0) return <>{items.map((item, ii) => <ResumeEntry key={ii} item={item} />)}</>;
  return (
    <LightboxGroup
      images={withImage.map((i) => ({
        src: i.image!,
        alt: `${i.heading} certificate`,
        caption: [i.heading, i.place, i.period].filter(Boolean).join(' · '),
      }))}
    >
      {items.map((item, ii) => (
        <ResumeEntry
          key={ii}
          item={item}
          thumb={
            item.image && (
              <LightboxThumb
                index={withImage.indexOf(item)}
                className="w-24 shrink-0 rounded bg-white shadow-sm ring-1 ring-black/10 sm:w-32"
                imgClassName="aspect-[7/5]"
              />
            )
          }
        />
      ))}
    </LightboxGroup>
  );
}

export function ResumeTimeline({ data }: { data: ResumeContent }) {
  return (
    <Section id="resume">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid gap-10 md:grid-cols-2">
        {data.columns.map((col, ci) => (
          <div key={ci}>
            {col.groups
              .filter((group) => group.title !== 'Organizational Experience')
              .map((group, gi) => (
                <Reveal key={group.title} delay={gi * 120} className="mb-8">
                  <h3 className="mb-4 text-xl font-semibold uppercase text-accent">{group.title}</h3>
                  <ResumeItems items={group.items} />
                </Reveal>
              ))}
          </div>
        ))}
        {data.columns.flatMap((col) => col.groups)
        .filter((group) => group.title === 'Organizational Experience')
        .map((group) => (
          <Reveal key={group.title} className="mb-8 w-full md:col-span-2">
            <h3 className="mb-4 text-xl font-semibold uppercase text-accent">{group.title}</h3>
            <ResumeItems items={group.items} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
