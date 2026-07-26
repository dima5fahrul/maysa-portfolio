import { render } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';

it('renders name, tagline and CTA', () => {
  const { getByRole, getByText } = render(
    <Hero hero={{ name: 'Kelly Adams', tagline: 'illustrator', backgroundImage: '/img/hero-bg.jpg', cta: { label: 'About Me', href: '/about' } }} />
  );
  expect(getByRole('heading', { name: 'Kelly Adams' })).toBeInTheDocument();
  expect(getByText('illustrator')).toBeInTheDocument();
  expect(getByRole('link', { name: 'About Me' })).toHaveAttribute('href', '/about');
});
