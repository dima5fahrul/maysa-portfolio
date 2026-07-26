import { render } from '@testing-library/react';
import { Nav } from '@/components/layout/Nav';

vi.mock('next/navigation', () => ({ usePathname: () => '/about' }));

const items = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
];

it('marks the active route with aria-current', () => {
  const { getByRole } = render(<Nav items={items} />);
  expect(getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
  expect(getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
});
