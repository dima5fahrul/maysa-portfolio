import type { PortfolioItem } from '@/lib/schema';

const SYMBOLS: Record<string, string> = { drafting: '§', litigation: '§', hr: '&', projects: '№', research: '¶' };
const TONES = { surface: 'bg-surface', page: 'bg-page' } as const;

export function ProjectCover({
  item,
  tag,
  tone = 'surface',
  variant = 'card',
  art,
  className = '',
  children,
}: {
  item: PortfolioItem;
  tag?: string;
  tone?: keyof typeof TONES;
  variant?: 'card' | 'hero';
  /** Category artwork (a square design) shown whole when the item has no photo of its own. */
  art?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const symbol = SYMBOLS[item.category] ?? '§';
  const fallbackArt = item.cover ? undefined : art;
  // Hero without a photo: the artwork or symbol sits in its own slot above the text, so it can never overlap it.
  const heroSlot = variant === 'hero' && !item.cover;
  return (
    <div
      className={`relative overflow-hidden ${TONES[tone]} ${
        item.cover || fallbackArt || heroSlot ? '' : 'flex items-center justify-center'
      } ${className}`}
    >
      {item.cover ? (
        <img src={item.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : fallbackArt && !heroSlot ? (
        <>
          <img src={fallbackArt} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-2xl" />
          <img src={fallbackArt} alt="" className="absolute inset-0 h-full w-full object-contain p-3 drop-shadow-md" />
        </>
      ) : (
        !heroSlot && (
          <span aria-hidden="true" className="font-serif text-7xl italic leading-none text-accent">
            {symbol}
          </span>
        )
      )}
      {tag && (
        <span className="absolute left-3 top-3 z-[1] rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase leading-none tracking-widest text-accent">
          {tag}
        </span>
      )}
      {children && (
        <div className={`absolute inset-0 z-10 ${heroSlot ? 'flex flex-col' : ''}`}>
          {heroSlot && (
            <div aria-hidden="true" className="min-h-0 flex-1 overflow-hidden px-4 pb-3 pt-6 md:pt-10">
              <div className="mx-auto flex h-full max-w-3xl justify-end">
                {fallbackArt ? (
                  <img src={fallbackArt} alt="" className="aspect-square h-full max-h-64 rounded-lg object-cover shadow-lg" />
                ) : (
                  <span className="font-serif text-[6rem] italic leading-none text-accent sm:text-[8rem] md:text-[10rem]">
                    {symbol}
                  </span>
                )}
              </div>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
