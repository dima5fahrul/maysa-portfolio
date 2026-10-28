import type { PortfolioItem } from '@/lib/schema';

const SYMBOLS: Record<string, string> = { legal: '§', hr: '&', projects: '№' };
const TONES = { surface: 'bg-surface', page: 'bg-page' } as const;

export function ProjectCover({
  item,
  tag,
  tone = 'surface',
  variant = 'card',
  className = '',
  children,
}: {
  item: PortfolioItem;
  tag?: string;
  tone?: keyof typeof TONES;
  variant?: 'card' | 'hero';
  className?: string;
  children?: React.ReactNode;
}) {
  const symbol = SYMBOLS[item.category] ?? '§';
  // Hero without a photo: the symbol sits in its own slot above the text, so it can never overlap it.
  const heroSymbol = variant === 'hero' && !item.cover;
  return (
    <div
      className={`relative overflow-hidden ${TONES[tone]} ${
        item.cover || heroSymbol ? '' : 'flex items-center justify-center'
      } ${className}`}
    >
      {item.cover ? (
        <img src={item.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        !heroSymbol && (
          <span aria-hidden="true" className="font-serif text-7xl italic leading-none text-accent">
            {symbol}
          </span>
        )
      )}
      {tag && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase leading-none tracking-widest text-accent">
          {tag}
        </span>
      )}
      {children && (
        <div className={`absolute inset-0 z-10 ${heroSymbol ? 'flex flex-col' : ''}`}>
          {heroSymbol && (
            <div aria-hidden="true" className="min-h-0 flex-1 overflow-hidden px-4 pb-3 pt-6 md:pt-10">
              <div className="mx-auto max-w-3xl text-right">
                <span className="font-serif text-[6rem] italic leading-none text-accent sm:text-[8rem] md:text-[10rem]">
                  {symbol}
                </span>
              </div>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
