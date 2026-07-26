import { render, fireEvent } from '@testing-library/react';
import { PortfolioGallery } from '@/components/sections/PortfolioGallery';

const data = {
  title: 'Portfolio', subtitle: 'sub',
  filters: [{ key: 'all', label: 'All' }, { key: 'app', label: 'App' }, { key: 'product', label: 'Card' }],
  items: [
    { slug: 'app-1', title: 'App 1', category: 'app', description: 'd', image: '/img/a.jpg',
      detail: { info: { category: 'c', client: 'c', date: 'd', url: 'u' }, title: 't', description: 'x', gallery: ['/img/a.jpg'] } },
    { slug: 'product-1', title: 'Product 1', category: 'product', description: 'd', image: '/img/p.jpg',
      detail: { info: { category: 'c', client: 'c', date: 'd', url: 'u' }, title: 't', description: 'x', gallery: ['/img/p.jpg'] } },
  ],
};

it('shows all items initially and filters by category', () => {
  const { getByText, queryByText, getByRole } = render(<PortfolioGallery data={data} />);
  expect(getByText('App 1')).toBeInTheDocument();
  expect(getByText('Product 1')).toBeInTheDocument();
  fireEvent.click(getByRole('button', { name: 'App' }));
  expect(getByText('App 1')).toBeInTheDocument();
  expect(queryByText('Product 1')).not.toBeInTheDocument();
});
