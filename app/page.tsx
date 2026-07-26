import { getHome } from '@/lib/content';
import { Hero } from '@/components/sections/Hero';

export default function HomePage() {
  const { hero } = getHome();
  return <Hero hero={hero} />;
}
