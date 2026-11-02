'use client';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Copyright, Signature } from './Signature';
import type { ContactContent, SiteContent } from '@/lib/schema';

const external = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {});

export function Footer({ site, contacts }: { site: SiteContent; contacts: ContactContent['direct'] }) {
  // Contact already carries everything the footer would show, so it closes with its own signature instead.
  if (usePathname().replace(/\/$/, '') === '/contact') return null;

  return (
    <footer className="bg-surface px-4 pb-6 pt-12 text-center">
      <div className="mx-auto w-full max-w-6xl">
        <Signature site={site} />
        <span aria-hidden="true" className="mx-auto my-5 block h-0.5 w-14 bg-accent/60" />

        <ul className="flex flex-col items-center justify-center gap-2 text-sm sm:flex-row sm:gap-6">
          {contacts.map((c) => (
            <li key={c.href}>
              <a href={c.href} {...external(c.href)} className="text-body transition-colors hover:text-accent">
                <Icon name={c.icon} className="mr-2 text-accent" />
                {c.text}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex justify-center gap-3">
          {site.social.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              aria-label={s.platform}
              {...external(s.url)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 text-accent transition-colors hover:bg-accent hover:text-white"
            >
              <Icon name={s.icon} />
            </a>
          ))}
        </div>

        <Copyright site={site} className="mt-8" />
      </div>
    </footer>
  );
}
