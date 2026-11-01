import { Icon } from '@/components/ui/Icon';
import type { ContactContent } from '@/lib/schema';

const CARD = 'flex flex-1 items-center gap-5 rounded-lg bg-white p-6 shadow-sm';

export function ContactInfo({ info }: { info: ContactContent['info'] }) {
  return (
    <div className="flex h-full flex-col gap-6">
      {info.map((i) => {
        const body = (
          <>
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-2xl text-white">
              <Icon name={i.icon} />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-heading">{i.title}</h3>
              <p className="mt-1 break-words text-muted">{i.text}</p>
              {i.action && <span className="mt-3 block text-sm font-semibold text-accent">{i.action} →</span>}
            </div>
          </>
        );
        // The whole card is the link, like the portfolio cards.
        return i.href ? (
          <a
            key={i.title}
            href={i.href}
            {...(i.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`${CARD} transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg`}
          >
            {body}
          </a>
        ) : (
          <div key={i.title} className={CARD}>
            {body}
          </div>
        );
      })}
    </div>
  );
}
