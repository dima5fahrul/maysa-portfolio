import { notFound } from 'next/navigation';
import { getPortfolio, getPortfolioItem } from '@/lib/content';
import { PortfolioDetail } from '@/components/sections/PortfolioDetail';

export function generateStaticParams() {
  return getPortfolio().items.map((i) => ({ slug: i.slug }));
}

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const item = getPortfolioItem(params.slug);
  if (!item) notFound();
  return <PortfolioDetail item={item} />;
}
