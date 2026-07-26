import { Icon } from '@/components/ui/Icon';
import type { SiteContent } from '@/lib/schema';

export function SocialLinks({ links, className = '' }: { links: SiteContent['social']; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((l) => (
        <a key={l.platform} href={l.url} aria-label={l.platform} className="text-heading hover:text-accent">
          <Icon name={l.icon} />
        </a>
      ))}
    </div>
  );
}
