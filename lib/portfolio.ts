import type { PortfolioFilter, PortfolioItem } from './schema';

export const categoryTag = (filters: PortfolioFilter[], category: string): string => {
  const filter = filters.find((f) => f.key === category);
  return filter ? filter.tag ?? filter.label : category;
};

export const nextItem = (items: PortfolioItem[], slug: string): PortfolioItem | undefined => {
  const index = items.findIndex((i) => i.slug === slug);
  if (items.length < 2 || index === -1) return undefined;
  return items[(index + 1) % items.length];
};
