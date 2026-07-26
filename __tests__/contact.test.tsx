Object.defineProperty(window, 'location', { value: { href: '' }, writable: true });

import { render, fireEvent } from '@testing-library/react';
import { ContactForm } from '@/components/sections/ContactForm';

it('shows validation error when submitting empty, then success when filled', () => {
  const { getByLabelText, getByText, getByRole, queryByText } = render(<ContactForm email="info@example.com" />);
  fireEvent.click(getByRole('button', { name: /send message/i }));
  expect(getByText(/please fill/i)).toBeInTheDocument();

  fireEvent.change(getByLabelText(/your name/i), { target: { value: 'Ada' } });
  fireEvent.change(getByLabelText(/your email/i), { target: { value: 'ada@x.com' } });
  fireEvent.change(getByLabelText(/subject/i), { target: { value: 'Hi' } });
  fireEvent.change(getByLabelText(/message/i), { target: { value: 'Hello there' } });
  fireEvent.click(getByRole('button', { name: /send message/i }));

  expect(queryByText(/please fill/i)).not.toBeInTheDocument();
  expect(getByText(/thank you/i)).toBeInTheDocument();
});
