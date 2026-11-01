import { Icon } from '@/components/ui/Icon';
import type { ContactContent } from '@/lib/schema';

export function ContactInfo({ info }: { info: ContactContent['info'] }) {
  return (
    <div className="space-y-6">
      {info.map((i) => (
        <div key={i.title} className="flex items-start gap-4">
          <Icon name={i.icon} className="text-2xl text-accent" />
          <div>
            <h3 className="font-semibold">{i.title}</h3>
            {i.href ? (
              <a
                href={i.href}
                {...(i.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-muted transition-colors hover:text-accent"
              >
                {i.text}
              </a>
            ) : (
              <p className="text-muted">{i.text}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
