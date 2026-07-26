import { portfolioSchema, aboutSchema } from '@/lib/schema';

it('accepts a valid portfolio item', () => {
  const data = {
    title: 'Portfolio',
    subtitle: 'sub',
    filters: [{ key: 'all', label: 'All' }],
    items: [{
      slug: 'app-1', title: 'App 1', category: 'app',
      description: 'desc', image: '/img/masonry-portfolio/masonry-portfolio-1.jpg',
      detail: {
        info: { category: 'Web design', client: 'ASU', date: '01 March, 2020', url: 'https://example.com' },
        title: 'Project', description: 'body',
        gallery: ['/img/portfolio/app-1.jpg'],
      },
    }],
  };
  expect(() => portfolioSchema.parse(data)).not.toThrow();
});

it('rejects an about doc missing required fields', () => {
  expect(() => aboutSchema.parse({})).toThrow();
});
