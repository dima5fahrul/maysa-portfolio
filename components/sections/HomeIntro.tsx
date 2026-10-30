import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import type { HomeContent } from '@/lib/schema';

export function HomeIntro({ intro }: { intro: HomeContent['intro'] }) {
  return (
    <Section id="intro" className="bg-gradient-to-b from-[#a28a80]/30 via-transparent to-transparent">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center md:flex-row md:gap-12 md:text-left">
        <Reveal from="left" className="shrink-0">
          <img
            src={intro.image}
            alt=""
            className="h-40 w-40 rounded-full object-cover object-top shadow-md ring-4 ring-white md:h-52 md:w-52"
          />
        </Reveal>
        <Reveal from="right" delay={120}>
          <h2 className="text-2xl font-semibold md:text-3xl">{intro.heading}</h2>
          <p className="mt-3 text-lg leading-relaxed">{intro.text}</p>
          <Link href={intro.link.href} className="mt-4 inline-block font-semibold text-accent hover:underline">
            {intro.link.label} →
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
