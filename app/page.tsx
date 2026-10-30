import { getHome, getAbout, getPortfolio, getSelectedItems, getServices } from '@/lib/content';
import { Hero } from '@/components/sections/Hero';
import { HomeIntro } from '@/components/sections/HomeIntro';
import { ExpertisePreview } from '@/components/sections/ExpertisePreview';
import { Stats } from '@/components/sections/Stats';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { ContactCta } from '@/components/sections/ContactCta';

export default function HomePage() {
  const home = getHome();
  const about = getAbout();
  return (
    <>
      <Hero hero={home.hero} scrollTo="intro" />
      <HomeIntro intro={home.intro} />
      <ExpertisePreview data={home.expertise} items={getServices().items} />
      <Stats data={home.stats} />
      <SelectedWork
        title={about.selectedWork.title}
        subtitle={about.selectedWork.subtitle}
        items={getSelectedItems()}
        filters={getPortfolio().filters}
      />
      <ContactCta data={home.contactCta} />
    </>
  );
}
