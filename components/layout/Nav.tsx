'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { SiteContent } from '@/lib/schema';

export function Nav({ items }: { items: SiteContent['nav'] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  return (
    <nav className="flex items-center">
      <button
        className="md:hidden text-2xl text-heading"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? 'x' : 'list'} />
      </button>
      <ul className={`${open ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col gap-2 bg-white p-4 shadow md:static md:flex md:w-auto md:flex-row md:gap-6 md:bg-transparent md:p-0 md:shadow-none`}>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={`font-nav text-sm ${isActive(item.href) ? 'text-accent' : 'text-heading hover:text-accent'}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
