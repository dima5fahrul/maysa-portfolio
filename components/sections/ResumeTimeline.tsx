import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import type { ResumeContent } from '@/lib/schema';

export function ResumeTimeline({ data }: { data: ResumeContent }) {
  return (
    <Section id="resume">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid gap-10 md:grid-cols-2">
        {data.columns.map((col, ci) => (
          <div key={ci}>
            {col.groups.map((group) => (
              <div key={group.title} className="mb-8">
                <h3 className="mb-4 text-xl font-semibold uppercase text-accent">{group.title}</h3>
                {group.items.map((item, ii) => (
                  <div key={ii} className="mb-6 border-l-2 border-accent/30 pl-4">
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
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
