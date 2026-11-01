import type { PortfolioFilter, PortfolioItem } from './schema';

const findFilter = (filters: PortfolioFilter[], key: string): PortfolioFilter | undefined =>
  filters.find((f) => f.key === key);

export const categoryTag = (filters: PortfolioFilter[], category: string): string => {
  const filter = findFilter(filters, category);
  return filter ? filter.tag ?? filter.label : category;
};

export const categoryImage = (filters: PortfolioFilter[], category: string): string | undefined =>
  findFilter(filters, category)?.image;

export const nextItem = (items: PortfolioItem[], slug: string): PortfolioItem | undefined => {
  const index = items.findIndex((i) => i.slug === slug);
  if (items.length < 2 || index === -1) return undefined;
  return items[(index + 1) % items.length];
};
