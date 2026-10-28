import { getAbout, getPortfolio, getSelectedItems } from '@/lib/content';
import { AboutIntro } from '@/components/sections/AboutIntro';
import { Skills } from '@/components/sections/Skills';
import { Stats } from '@/components/sections/Stats';
import { SelectedWork } from '@/components/sections/SelectedWork';

export default function AboutPage() {
  const about = getAbout();
  return (
    <>
      <AboutIntro title={about.title} subtitle={about.subtitle} intro={about.intro} />
      <Skills data={about.skills} />
      <Stats data={about.stats} />
      <SelectedWork
        title={about.selectedWork.title}
        subtitle={about.selectedWork.subtitle}
        items={getSelectedItems()}
        filters={getPortfolio().filters}
      />
    </>
  );
}
