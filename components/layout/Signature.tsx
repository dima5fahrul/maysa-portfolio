import type { SiteContent } from '@/lib/schema';

/** The script name and tagline that close a page: in the footer, and on Contact, which has no footer. */
export function Signature({ site }: { site: SiteContent }) {
  return (
    <>
      <p className="font-display text-6xl leading-none text-accent md:text-7xl">{site.name}</p>
      <p className="mt-2 font-serif text-base italic text-body/80 md:text-lg">{site.tagline}</p>
    </>
  );
}

export function Copyright({ site, className = '' }: { site: SiteContent; className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 border-t border-accent/15 pt-4 text-xs text-muted sm:flex-row sm:gap-2 ${className}`}
    >
      <span>
        © {new Date().getFullYear()} {site.copyrightName}. All rights reserved.
      </span>
      <span aria-hidden="true" className="hidden sm:inline">
        ·
      </span>
      <span>
        Designed by{' '}
        <a href="https://dimasfahrul.my.id/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          Dimas Fahrul
        </a>
      </span>
    </div>
  );
}
