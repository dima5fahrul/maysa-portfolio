import { getPortfolio } from '@/lib/content';
import { PortfolioGallery } from '@/components/sections/PortfolioGallery';

export default function PortfolioPage() {
  return <PortfolioGallery data={getPortfolio()} />;
}
