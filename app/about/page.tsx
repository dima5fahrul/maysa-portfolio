import { getAbout } from '@/lib/content';
import { AboutIntro } from '@/components/sections/AboutIntro';
import { Skills } from '@/components/sections/Skills';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';

export default function AboutPage() {
  const about = getAbout();
  return (
    <>
      <AboutIntro title={about.title} subtitle={about.subtitle} intro={about.intro} />
      <Skills data={about.skills} />
      <Stats data={about.stats} />
      <Testimonials data={about.testimonials} />
    </>
  );
}
