'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Nav } from './Nav';
import { SocialLinks } from './SocialLinks';
import type { SiteContent } from '@/lib/schema';

export function Header({ site }: { site: SiteContent }) {
  const pathname = usePathname();
  const overHero = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overHero]);

  const transparent = overHero && !scrolled;

  return (
    <header
      className={`${overHero ? 'fixed inset-x-0 top-0' : 'sticky top-0'} z-40 h-[var(--header-h)] transition-colors duration-500 ${
        transparent ? 'bg-transparent [--accent:226_172_142] [--heading:255_255_255]' : 'bg-surface/95 backdrop-blur'
      }`}
    >
      <div className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-heading">{site.name}</Link>
        <Nav items={site.nav} />
        <SocialLinks links={site.social} className="hidden md:flex" />
      </div>
    </header>
  );
}
