import type { PortfolioItem } from '@/lib/schema';

const SYMBOLS: Record<string, string> = { legal: '§', hr: '&', projects: '№' };

export function ProjectCover({
  item,
  tag,
  className = '',
  children,
}: {
  item: PortfolioItem;
  tag?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${item.cover ? '' : 'flex items-center justify-center bg-surface'} ${className}`}>
      {item.cover ? (
        <img src={item.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true" className="font-serif text-7xl italic leading-none text-accent">
          {SYMBOLS[item.category] ?? '§'}
        </span>
      )}
      {tag && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase leading-none tracking-widest text-accent">
          {tag}
        </span>
      )}
      {children}
    </div>
  );
}
