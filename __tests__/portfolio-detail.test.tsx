import { render } from '@testing-library/react';
import { PortfolioDetail } from '@/components/sections/PortfolioDetail';

it('renders project info and description', () => {
  const { getByText } = render(
    <PortfolioDetail item={{
      slug: 'app-1', title: 'App 1', category: 'app', description: 'd', image: '/img/a.jpg',
      detail: {
        info: { category: 'Web design', client: 'ASU Company', date: '01 March, 2020', url: 'https://example.com' },
        title: 'Project X', description: 'body text', gallery: ['/img/portfolio/app-1.jpg'],
      },
    }} />
  );
  expect(getByText('Project X')).toBeInTheDocument();
  expect(getByText('body text')).toBeInTheDocument();
  expect(getByText('ASU Company')).toBeInTheDocument();
});
