import { render } from '@testing-library/react';
import RootLayout from '@/app/layout';

// Next font mock: next/font/google is not available in jsdom.
vi.mock('next/font/google', () => ({
  Poppins: () => ({ variable: '--font-heading', className: 'font-heading' }),
  Raleway: () => ({ variable: '--font-body', className: 'font-body' }),
  Roboto: () => ({ variable: '--font-nav', className: 'font-nav' }),
}));

it('renders children inside the document body', () => {
  const { getByText } = render(
    <RootLayout><p>hello</p></RootLayout>
  );
  expect(getByText('hello')).toBeInTheDocument();
});
