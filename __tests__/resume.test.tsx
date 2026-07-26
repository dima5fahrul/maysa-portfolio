import { render } from '@testing-library/react';
import { ResumeTimeline } from '@/components/sections/ResumeTimeline';

it('renders group titles, headings and bullets', () => {
  const { getByText } = render(
    <ResumeTimeline data={{
      title: 'Resume', subtitle: 'sub',
      columns: [{ groups: [{ title: 'Education', items: [
        { heading: 'MFA', period: '2015 - 2016', place: 'RIT', summary: 'studied', bullets: ['b1'] }
      ] }] }],
    }} />
  );
  expect(getByText('Education')).toBeInTheDocument();
  expect(getByText('MFA')).toBeInTheDocument();
  expect(getByText('2015 - 2016')).toBeInTheDocument();
  expect(getByText('b1')).toBeInTheDocument();
});
