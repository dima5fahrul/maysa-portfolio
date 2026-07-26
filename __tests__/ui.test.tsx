import { render } from '@testing-library/react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

it('SectionTitle renders title and subtitle', () => {
  const { getByRole, getByText } = render(<SectionTitle title="About" subtitle="sub text" />);
  expect(getByRole('heading', { name: 'About' })).toBeInTheDocument();
  expect(getByText('sub text')).toBeInTheDocument();
});

it('Button renders an anchor to href', () => {
  const { getByRole } = render(<Button href="/about">Go</Button>);
  expect(getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/about');
});

it('Icon renders a bootstrap icon class', () => {
  const { container } = render(<Icon name="facebook" />);
  expect(container.querySelector('i.bi.bi-facebook')).toBeTruthy();
});
