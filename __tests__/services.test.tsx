import { render } from '@testing-library/react';
import { ServiceCard } from '@/components/sections/ServiceCard';

it('renders title, description and colored icon', () => {
  const { getByText, container } = render(
    <ServiceCard service={{ icon: 'activity', color: '#0dcaf0', title: 'Nesciunt Mete', description: 'desc text' }} />
  );
  expect(getByText('Nesciunt Mete')).toBeInTheDocument();
  expect(getByText('desc text')).toBeInTheDocument();
  expect(container.querySelector('i.bi.bi-activity')).toBeTruthy();
});
