import { getSite, getHome, getAbout, getResume, getServices, getPortfolio, getContact } from '@/lib/content';

it('every content file parses against its schema', () => {
  expect(() => getSite()).not.toThrow();
  expect(() => getHome()).not.toThrow();
  expect(() => getAbout()).not.toThrow();
  expect(() => getResume()).not.toThrow();
  expect(() => getServices()).not.toThrow();
  expect(() => getPortfolio()).not.toThrow();
  expect(() => getContact()).not.toThrow();
});

it('portfolio slugs are unique', () => {
  const slugs = getPortfolio().items.map((i) => i.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
});
