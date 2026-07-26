import Link from 'next/link';
import { Nav } from './Nav';
import { SocialLinks } from './SocialLinks';
import type { SiteContent } from '@/lib/schema';

export function Header({ site }: { site: SiteContent }) {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-heading">{site.name}</Link>
        <Nav items={site.nav} />
        <SocialLinks links={site.social} className="hidden md:flex" />
      </div>
    </header>
  );
}
