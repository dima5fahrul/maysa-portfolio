import { render } from '@testing-library/react';
import { AboutIntro } from '@/components/sections/AboutIntro';
import { Skills } from '@/components/sections/Skills';

it('AboutIntro renders heading and facts', () => {
  const { getByText } = render(
    <AboutIntro
      title="About" subtitle="sub"
      intro={{ image: '/img/profile-img.jpg', heading: 'UI/UX Designer', lead: 'lead', body: 'body',
        facts: [{ label: 'Age', value: '30' }] }}
    />
  );
  expect(getByText('UI/UX Designer')).toBeInTheDocument();
  expect(getByText('30')).toBeInTheDocument();
});

it('Skills renders a progress bar per skill with correct width', () => {
  const { getByText, container } = render(
    <Skills data={{ title: 'Skills', subtitle: 'sub', columns: [{ skills: [{ name: 'HTML', value: 100 }] }] }} />
  );
  expect(getByText('HTML')).toBeInTheDocument();
  const bar = container.querySelector('[data-skill-bar]') as HTMLElement;
  expect(bar.style.width).toBe('100%');
});
