import { notFound } from 'next/navigation';
import { getPortfolio, getPortfolioItem } from '@/lib/content';
import { categoryImage, nextItem } from '@/lib/portfolio';
import { PortfolioDetail } from '@/components/sections/PortfolioDetail';

export function generateStaticParams() {
  return getPortfolio().items.map((i) => ({ slug: i.slug }));
}

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const item = getPortfolioItem(params.slug);
  if (!item) notFound();
  const { items, filters } = getPortfolio();
  return <PortfolioDetail item={item} next={nextItem(items, item.slug)} art={categoryImage(filters, item.category)} />;
}
