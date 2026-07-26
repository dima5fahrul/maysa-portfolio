# Kelly React/TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the static BootstrapMade "Kelly" resume template as a Next.js + TypeScript site whose content is driven by per-page JSON files, restyled in Tailwind, output as fully static HTML.

**Architecture:** Next.js App Router with `output: 'export'`. Each page imports one typed JSON from `content/`, validated by a Zod schema (types inferred via `z.infer`). Pages pass typed props down to presentational section components; components never read JSON directly. Interaction (sliders, lightbox, scroll reveal, counters) uses React-native libraries. Malformed content fails the build via Zod `parse()`.

**Tech Stack:** Next.js (App Router, static export), TypeScript, Tailwind CSS, Zod, swiper/react, yet-another-react-lightbox, Vitest + @testing-library/react + jsdom.

## Global Constraints

- Next.js `output: 'export'` — no server code, no server actions, no runtime data fetching. Everything static at build.
- `next.config` MUST set `images: { unoptimized: true }` (required for static export).
- Content lives ONLY in `content/*.json`. Presentational components receive data as props — they never import JSON.
- Types are inferred from Zod schemas with `z.infer`. Do not hand-write a parallel type.
- Site name string: `Kelly`. Person/brand copy is carried verbatim from the original template (see per-task JSON).
- Images served from `/img/...` (migrated from `assets/img/`). Reference with root-absolute paths.
- Original template files are archived under `_legacy/` and never imported by the app.
- Node 18.18+ (Next.js 14 floor).
- Every client component (uses hooks/state/effects/browser APIs) starts with `'use client'`.
- Test commands: `npm test` runs Vitest once (`vitest run`).

---

### Task 1: Scaffold app, archive legacy, migrate images, wire test tooling

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `tailwind.config.ts`, `.gitignore`, `vitest.config.mts`, `vitest.setup.ts`
- Create: `app/globals.css`, `app/layout.tsx` (placeholder), `app/page.tsx` (placeholder)
- Move: everything currently at repo root (`*.html`, `assets/`, `forms/`, `Readme.txt`) into `_legacy/`
- Create: `public/img/` (copied from `_legacy/assets/img/`)

**Interfaces:**
- Produces: a runnable Next.js app (`npm run dev`, `npm run build`) and a runnable test harness (`npm test`). No app-specific exports yet.

- [ ] **Step 1: Archive the original template**

```bash
mkdir -p _legacy
git ls-files -o --exclude-standard 2>/dev/null; true   # (repo may be non-git; ignore)
mv about.html contact.html index.html portfolio-details.html portfolio.html \
   resume.html services.html starter-page.html Readme.txt assets forms _legacy/ 2>/dev/null || true
ls _legacy
```
Expected: the eight HTML files, `Readme.txt`, `assets/`, `forms/` now under `_legacy/`. (`docs/` stays at root.)

- [ ] **Step 2: Migrate images into public**

```bash
mkdir -p public/img
cp -R _legacy/assets/img/. public/img/
ls public/img
```
Expected: `favicon.png`, `apple-touch-icon.png`, `hero-bg.jpg`, `profile-img.jpg`, `logo.png`, and subfolders `testimonials/`, `masonry-portfolio/`, `portfolio/`.

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "kelly",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "swiper": "11.1.9",
    "yet-another-react-lightbox": "3.21.6",
    "zod": "3.23.8"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "6.4.8",
    "@testing-library/react": "16.0.0",
    "@types/node": "20.14.15",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "@vitejs/plugin-react": "4.3.1",
    "autoprefixer": "10.4.20",
    "jsdom": "24.1.1",
    "postcss": "8.4.41",
    "tailwindcss": "3.4.10",
    "typescript": "5.5.4",
    "vitest": "2.0.5"
  }
}
```

- [ ] **Step 4: Create config files**

`next.config.mjs`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "_legacy"]
}
```

`postcss.config.mjs`:
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

`tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'rgb(var(--accent) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        heading: 'rgb(var(--heading) / <alpha-value>)',
        body: 'rgb(var(--body) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        nav: ['var(--font-nav)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
```

`.gitignore`:
```
node_modules
.next
out
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 5: Create Vitest config + setup**

`vitest.config.mts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, '.') } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['_legacy/**', 'node_modules/**'],
  },
});
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 6: Create minimal `globals.css` and placeholder layout/page**

`app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --accent: 20 157 221;      /* #149ddd */
  --surface: 245 245 245;    /* #f5f5f5 */
  --heading: 5 5 5;          /* near-black */
  --body: 39 39 39;          /* #272727 */
  --muted: 108 117 125;      /* #6c757d */
}
```

`app/layout.tsx`:
```tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kelly' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx`:
```tsx
export default function Home() {
  return <main>Kelly</main>;
}
```

- [ ] **Step 7: Install and verify build + tests run**

Run:
```bash
npm install
npm run build
npx vitest run --passWithNoTests
```
Expected: `npm run build` completes and emits `out/index.html`. Vitest exits 0 (no tests yet).

- [ ] **Step 8: Commit**

```bash
git init 2>/dev/null; git add -A
git commit -m "chore: scaffold Next.js app, archive legacy template, migrate images"
```

---

### Task 2: Design tokens, fonts, and global base styles

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Test: `__tests__/layout.test.tsx`

**Interfaces:**
- Produces: `app/layout.tsx` root layout exposing font CSS variables (`--font-heading`, `--font-body`, `--font-nav`) on `<body>` and applying base typography. Consumed by every page.

- [ ] **Step 1: Write the failing test**

`__tests__/layout.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/layout.test.tsx`
Expected: FAIL — layout does not yet use fonts / test asserts against new structure (or hydration warning about nested html). If it passes trivially, proceed; the real signal is Step 4.

- [ ] **Step 3: Implement fonts + base styles**

Replace `app/layout.tsx`:
```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Poppins, Raleway, Roboto } from 'next/font/google';

const heading = Poppins({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-heading' });
const body = Raleway({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-body' });
const nav = Roboto({ subsets: ['latin'], weight: ['400','500','700'], variable: '--font-nav' });

export const metadata: Metadata = {
  title: 'Kelly',
  description: 'Kelly — personal CV / resume',
  icons: { icon: '/img/favicon.png', apple: '/img/apple-touch-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${nav.variable}`}>
      <body className="font-sans text-body bg-white antialiased">{children}</body>
    </html>
  );
}
```

Append to `app/globals.css`:
```css
@layer base {
  body { @apply text-[15px] leading-relaxed; }
  h1, h2, h3, h4, h5, h6 { @apply font-heading text-heading; }
  a { @apply text-accent no-underline transition-colors; }
  a:hover { @apply text-accent/80; }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/layout.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add fonts and global base styles"
```

---

### Task 3: Zod schemas, content loader, and inferred types

**Files:**
- Create: `lib/schema.ts`
- Create: `lib/content.ts`
- Test: `__tests__/schema.test.ts`

**Interfaces:**
- Produces (in `lib/schema.ts`) Zod schemas: `homeSchema`, `aboutSchema`, `resumeSchema`, `servicesSchema`, `portfolioSchema`, `contactSchema`, plus a shared `siteSchema` for header/footer chrome; and inferred types `HomeContent`, `AboutContent`, `ResumeContent`, `ServicesContent`, `PortfolioContent`, `ContactContent`, `SiteContent`. Also exports item-level types used by components: `PortfolioItem`, `Testimonial`, `SkillGroup`, `Service`, `ResumeColumn`, `ResumeItem`.
- Produces (in `lib/content.ts`) loader functions that import each JSON and return the parsed, typed object: `getSite()`, `getHome()`, `getAbout()`, `getResume()`, `getServices()`, `getPortfolio()`, `getContact()`, and `getPortfolioItem(slug: string): PortfolioItem | undefined`.

- [ ] **Step 1: Write the failing test**

`__tests__/schema.test.ts`:
```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/schema.test.ts`
Expected: FAIL — `Cannot find module '@/lib/schema'`.

- [ ] **Step 3: Implement schemas**

`lib/schema.ts`:
```ts
import { z } from 'zod';

const socialLink = z.object({ platform: z.string(), icon: z.string(), url: z.string() });

export const siteSchema = z.object({
  name: z.string(),
  nav: z.array(z.object({ label: z.string(), href: z.string() })),
  social: z.array(socialLink),
  copyrightName: z.string(),
});

export const homeSchema = z.object({
  hero: z.object({
    name: z.string(),
    tagline: z.string(),
    backgroundImage: z.string(),
    cta: z.object({ label: z.string(), href: z.string() }),
  }),
});

const skillSchema = z.object({ name: z.string(), value: z.number().min(0).max(100) });
const skillGroupSchema = z.object({ skills: z.array(skillSchema) });
const statSchema = z.object({ label: z.string(), value: z.number() });
const testimonialSchema = z.object({
  name: z.string(), role: z.string(), image: z.string(), quote: z.string(), rating: z.number().min(0).max(5),
});

export const aboutSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  intro: z.object({
    image: z.string(),
    heading: z.string(),
    lead: z.string(),
    facts: z.array(z.object({ label: z.string(), value: z.string() })),
    body: z.string(),
  }),
  skills: z.object({ title: z.string(), subtitle: z.string(), columns: z.array(skillGroupSchema) }),
  stats: z.object({ title: z.string(), subtitle: z.string(), items: z.array(statSchema) }),
  testimonials: z.object({ title: z.string(), subtitle: z.string(), items: z.array(testimonialSchema) }),
});

const resumeItemSchema = z.object({
  heading: z.string(),
  period: z.string().optional(),
  place: z.string().optional(),
  summary: z.string().optional(),
  bullets: z.array(z.string()).optional(),
});
const resumeColumnSchema = z.object({
  groups: z.array(z.object({ title: z.string(), items: z.array(resumeItemSchema) })),
});
export const resumeSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  columns: z.array(resumeColumnSchema),
});

const serviceSchema = z.object({ icon: z.string(), color: z.string(), title: z.string(), description: z.string() });
export const servicesSchema = z.object({
  title: z.string(), subtitle: z.string(), items: z.array(serviceSchema),
});

const portfolioItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  detail: z.object({
    info: z.object({ category: z.string(), client: z.string(), date: z.string(), url: z.string() }),
    title: z.string(),
    description: z.string(),
    gallery: z.array(z.string()).min(1),
  }),
});
export const portfolioSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  filters: z.array(z.object({ key: z.string(), label: z.string() })),
  items: z.array(portfolioItemSchema),
});

export const contactSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  email: z.string(),
  info: z.array(z.object({ icon: z.string(), title: z.string(), text: z.string() })),
  mapEmbedUrl: z.string(),
});

export type SiteContent = z.infer<typeof siteSchema>;
export type HomeContent = z.infer<typeof homeSchema>;
export type AboutContent = z.infer<typeof aboutSchema>;
export type ResumeContent = z.infer<typeof resumeSchema>;
export type ServicesContent = z.infer<typeof servicesSchema>;
export type PortfolioContent = z.infer<typeof portfolioSchema>;
export type ContactContent = z.infer<typeof contactSchema>;
export type PortfolioItem = z.infer<typeof portfolioItemSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type ResumeColumn = z.infer<typeof resumeColumnSchema>;
export type ResumeItem = z.infer<typeof resumeItemSchema>;
```

- [ ] **Step 4: Run schema test to verify it passes**

Run: `npx vitest run __tests__/schema.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement the loader (depends on Task 4 JSON, so guard with lazy import)**

`lib/content.ts`:
```ts
import {
  siteSchema, homeSchema, aboutSchema, resumeSchema,
  servicesSchema, portfolioSchema, contactSchema,
  type PortfolioItem,
} from './schema';

import site from '@/content/site.json';
import home from '@/content/home.json';
import about from '@/content/about.json';
import resume from '@/content/resume.json';
import services from '@/content/services.json';
import portfolio from '@/content/portfolio.json';
import contact from '@/content/contact.json';

export const getSite = () => siteSchema.parse(site);
export const getHome = () => homeSchema.parse(home);
export const getAbout = () => aboutSchema.parse(about);
export const getResume = () => resumeSchema.parse(resume);
export const getServices = () => servicesSchema.parse(services);
export const getPortfolio = () => portfolioSchema.parse(portfolio);
export const getContact = () => contactSchema.parse(contact);

export const getPortfolioItem = (slug: string): PortfolioItem | undefined =>
  getPortfolio().items.find((i) => i.slug === slug);
```

Note: `lib/content.ts` imports the JSON files created in Task 4. Do NOT run a build that imports `content.ts` until Task 4 lands. The schema test (Step 4) does not import `content.ts`, so it passes independently.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add zod content schemas, inferred types, and loader"
```

---

### Task 4: Author per-page content JSON

**Files:**
- Create: `content/site.json`, `content/home.json`, `content/about.json`, `content/resume.json`, `content/services.json`, `content/portfolio.json`, `content/contact.json`
- Test: `__tests__/content.test.ts`

**Interfaces:**
- Consumes: schemas + loaders from Task 3.
- Produces: valid content consumed by all pages. Every file parses against its schema.

- [ ] **Step 1: Write the failing test**

`__tests__/content.test.ts`:
```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/content.test.ts`
Expected: FAIL — `Cannot find module '@/content/site.json'`.

- [ ] **Step 3: Create the JSON files**

`content/site.json`:
```json
{
  "name": "Kelly",
  "copyrightName": "Kelly",
  "nav": [
    { "label": "Home", "href": "/" },
    { "label": "About", "href": "/about" },
    { "label": "Resume", "href": "/resume" },
    { "label": "Services", "href": "/services" },
    { "label": "Portfolio", "href": "/portfolio" },
    { "label": "Contact", "href": "/contact" }
  ],
  "social": [
    { "platform": "Twitter", "icon": "twitter-x", "url": "#" },
    { "platform": "Facebook", "icon": "facebook", "url": "#" },
    { "platform": "Instagram", "icon": "instagram", "url": "#" },
    { "platform": "LinkedIn", "icon": "linkedin", "url": "#" }
  ]
}
```

`content/home.json`:
```json
{
  "hero": {
    "name": "Kelly Adams",
    "tagline": "I'm a professional illustrator from San Francisco",
    "backgroundImage": "/img/hero-bg.jpg",
    "cta": { "label": "About Me", "href": "/about" }
  }
}
```

`content/about.json`:
```json
{
  "title": "About",
  "subtitle": "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
  "intro": {
    "image": "/img/profile-img.jpg",
    "heading": "UI/UX Designer & Web Developer.",
    "lead": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "facts": [
      { "label": "Birthday", "value": "1 May 1995" },
      { "label": "Website", "value": "www.example.com" },
      { "label": "Phone", "value": "+123 456 7890" },
      { "label": "City", "value": "New York, USA" },
      { "label": "Age", "value": "30" },
      { "label": "Degree", "value": "Master" },
      { "label": "Email", "value": "email@example.com" },
      { "label": "Freelance", "value": "Available" }
    ],
    "body": "Officiis eligendi itaque labore et dolorum mollitia officiis optio vero. Quisquam sunt adipisci omnis et ut. Nulla accusantium dolor incidunt officia tempore. Et eius omnis. Cupiditate ut dicta maxime officiis quidem quia. Sed et consectetur qui quia repellendus itaque neque."
  },
  "skills": {
    "title": "Skills",
    "subtitle": "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
    "columns": [
      { "skills": [
        { "name": "HTML", "value": 100 },
        { "name": "CSS", "value": 90 },
        { "name": "JavaScript", "value": 75 }
      ] },
      { "skills": [
        { "name": "PHP", "value": 80 },
        { "name": "WordPress/CMS", "value": 90 },
        { "name": "Photoshop", "value": 55 }
      ] }
    ]
  },
  "stats": {
    "title": "Facts",
    "subtitle": "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
    "items": [
      { "label": "Clients", "value": 232 },
      { "label": "Projects", "value": 521 },
      { "label": "Hours Of Support", "value": 1453 },
      { "label": "Workers", "value": 32 }
    ]
  },
  "testimonials": {
    "title": "Testimonials",
    "subtitle": "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
    "items": [
      { "name": "Saul Goodman", "role": "Ceo & Founder", "image": "/img/testimonials/testimonials-1.jpg", "rating": 5, "quote": "Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper." },
      { "name": "Sara Wilsson", "role": "Designer", "image": "/img/testimonials/testimonials-2.jpg", "rating": 5, "quote": "Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa." },
      { "name": "Jena Karlis", "role": "Store Owner", "image": "/img/testimonials/testimonials-3.jpg", "rating": 5, "quote": "Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim." },
      { "name": "Matt Brandon", "role": "Freelancer", "image": "/img/testimonials/testimonials-4.jpg", "rating": 5, "quote": "Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat minim velit minim dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam." },
      { "name": "John Larson", "role": "Entrepreneur", "image": "/img/testimonials/testimonials-5.jpg", "rating": 5, "quote": "Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam enim culpa labore duis sunt culpa nulla illum cillum fugiat legam esse veniam culpa fore nisi cillum quid." }
    ]
  }
}
```

`content/resume.json`:
```json
{
  "title": "Resume",
  "subtitle": "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
  "columns": [
    { "groups": [
      { "title": "Sumary", "items": [
        { "heading": "Brandon Johnson", "summary": "Innovative and deadline-driven Graphic Designer with 3+ years of experience designing and developing user-centered digital/print marketing material from initial concept to final, polished deliverable.", "bullets": ["Portland par 127, Orlando, FL", "(123) 456-7891", "alice.barkley@example.com"] }
      ] },
      { "title": "Education", "items": [
        { "heading": "Master of Fine Arts & Graphic Design", "period": "2015 - 2016", "place": "Rochester Institute of Technology, Rochester, NY", "summary": "Qui deserunt veniam. Et sed aliquam labore tempore sed quisquam iusto autem sit. Ea vero voluptatum qui ut dignissimos deleniti nerada porti sand markend" },
        { "heading": "Bachelor of Fine Arts & Graphic Design", "period": "2010 - 2014", "place": "Rochester Institute of Technology, Rochester, NY", "summary": "Quia nobis sequi est occaecati aut. Repudiandae et iusto quae reiciendis et quis Eius vel ratione eius unde vitae rerum voluptates asperiores voluptatem Earum molestiae consequatur neque etlon sader mart dila" }
      ] }
    ] },
    { "groups": [
      { "title": "Professional Experience", "items": [
        { "heading": "Senior graphic design specialist", "period": "2019 - Present", "place": "Experion, New York, NY", "bullets": ["Lead in the design, development, and implementation of the graphic, layout, and production communication materials", "Delegate tasks to the 7 members of the design team and provide counsel on all aspects of the project.", "Supervise the assessment of all graphic materials in order to ensure quality and accuracy of the design", "Oversee the efficient use of production project budgets ranging from $2,000 - $25,000"] },
        { "heading": "Graphic design specialist", "period": "2017 - 2018", "place": "Stepping Stone Advertising, New York, NY", "bullets": ["Developed numerous marketing programs (logos, brochures, infographics, presentations, and advertisements).", "Managed up to 5 projects or tasks at a given time while under pressure", "Recommended and consulted with clients on the most appropriate graphic design", "Created 4+ design presentations and proposals a month for clients and account managers"] }
      ] }
    ] }
  ]
}
```

`content/services.json`:
```json
{
  "title": "Services",
  "subtitle": "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
  "items": [
    { "icon": "activity", "color": "#0dcaf0", "title": "Nesciunt Mete", "description": "Provident nihil minus qui consequatur non omnis maiores. Eos accusantium minus dolores iure perferendis tempore et consequatur." },
    { "icon": "broadcast", "color": "#fd7e14", "title": "Eosle Commodi", "description": "Ut autem aut autem non a. Sint sint sit facilis nam iusto sint. Libero corrupti neque eum hic non ut nesciunt dolorem." },
    { "icon": "easel", "color": "#20c997", "title": "Ledo Markt", "description": "Ut excepturi voluptatem nisi sed. Quidem fuga consequatur. Minus ea aut. Vel qui id voluptas adipisci eos earum corrupti." },
    { "icon": "bounding-box-circles", "color": "#df1529", "title": "Asperiores Commodit", "description": "Non et temporibus minus omnis sed dolor esse consequatur. Cupiditate sed error ea fuga sit provident adipisci neque." },
    { "icon": "calendar4-week", "color": "#6610f2", "title": "Velit Doloremque", "description": "Cumque et suscipit saepe. Est maiores autem enim facilis ut aut ipsam corporis aut. Sed animi at autem alias eius labore." },
    { "icon": "chat-square-text", "color": "#f3268c", "title": "Dolori Architecto", "description": "Hic molestias ea quibusdam eos. Fugiat enim doloremque aut neque non et debitis iure. Corrupti recusandae ducimus enim." }
  ]
}
```

`content/portfolio.json` (9 items; `category` matches a filter `key`; each `detail.gallery` uses the shared portfolio images from the template detail page):
```json
{
  "title": "Portfolio",
  "subtitle": "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
  "filters": [
    { "key": "all", "label": "All" },
    { "key": "app", "label": "App" },
    { "key": "product", "label": "Card" },
    { "key": "branding", "label": "Web" }
  ],
  "items": [
    { "slug": "app-1", "title": "App 1", "category": "app", "description": "Lorem ipsum, dolor sit", "image": "/img/masonry-portfolio/masonry-portfolio-1.jpg", "detail": { "info": { "category": "Web design", "client": "ASU Company", "date": "01 March, 2020", "url": "https://www.example.com" }, "title": "Exercitationem repudiandae officiis neque suscipit", "description": "Autem ipsum nam porro corporis rerum. Quis eos dolorem eos itaque inventore commodi labore quia quia. Exercitationem repudiandae officiis neque suscipit non officia eaque itaque enim. Voluptatem officia accusantium nesciunt est omnis tempora consectetur dignissimos. Sequi nulla at esse enim cum deserunt eius.", "gallery": ["/img/portfolio/app-1.jpg", "/img/portfolio/product-1.jpg", "/img/portfolio/branding-1.jpg", "/img/portfolio/books-1.jpg"] } },
    { "slug": "product-1", "title": "Product 1", "category": "product", "description": "Lorem ipsum, dolor sit", "image": "/img/masonry-portfolio/masonry-portfolio-2.jpg", "detail": { "info": { "category": "Product design", "client": "ASU Company", "date": "01 March, 2020", "url": "https://www.example.com" }, "title": "Exercitationem repudiandae officiis neque suscipit", "description": "Autem ipsum nam porro corporis rerum. Quis eos dolorem eos itaque inventore commodi labore quia quia. Voluptatem officia accusantium nesciunt est omnis tempora consectetur dignissimos.", "gallery": ["/img/portfolio/product-1.jpg", "/img/portfolio/app-1.jpg", "/img/portfolio/branding-1.jpg", "/img/portfolio/books-1.jpg"] } },
    { "slug": "branding-1", "title": "Branding 1", "category": "branding", "description": "Lorem ipsum, dolor sit", "image": "/img/masonry-portfolio/masonry-portfolio-3.jpg", "detail": { "info": { "category": "Branding", "client": "ASU Company", "date": "01 March, 2020", "url": "https://www.example.com" }, "title": "Exercitationem repudiandae officiis neque suscipit", "description": "Autem ipsum nam porro corporis rerum. Quis eos dolorem eos itaque inventore commodi labore quia quia. Voluptatem officia accusantium nesciunt est omnis tempora consectetur dignissimos.", "gallery": ["/img/portfolio/branding-1.jpg", "/img/portfolio/app-1.jpg", "/img/portfolio/product-1.jpg", "/img/portfolio/books-1.jpg"] } },
    { "slug": "app-2", "title": "App 2", "category": "app", "description": "Lorem ipsum, dolor sit", "image": "/img/masonry-portfolio/masonry-portfolio-4.jpg", "detail": { "info": { "category": "Web design", "client": "ASU Company", "date": "01 March, 2020", "url": "https://www.example.com" }, "title": "Exercitationem repudiandae officiis neque suscipit", "description": "Autem ipsum nam porro corporis rerum. Quis eos dolorem eos itaque inventore commodi labore quia quia.", "gallery": ["/img/portfolio/app-1.jpg", "/img/portfolio/product-1.jpg", "/img/portfolio/branding-1.jpg", "/img/portfolio/books-1.jpg"] } },
    { "slug": "product-2", "title": "Product 2", "category": "product", "description": "Lorem ipsum, dolor sit", "image": "/img/masonry-portfolio/masonry-portfolio-5.jpg", "detail": { "info": { "category": "Product design", "client": "ASU Company", "date": "01 March, 2020", "url": "https://www.example.com" }, "title": "Exercitationem repudiandae officiis neque suscipit", "description": "Autem ipsum nam porro corporis rerum. Quis eos dolorem eos itaque inventore commodi labore quia quia.", "gallery": ["/img/portfolio/product-1.jpg", "/img/portfolio/app-1.jpg", "/img/portfolio/branding-1.jpg", "/img/portfolio/books-1.jpg"] } },
    { "slug": "branding-2", "title": "Branding 2", "category": "branding", "description": "Lorem ipsum, dolor sit", "image": "/img/masonry-portfolio/masonry-portfolio-6.jpg", "detail": { "info": { "category": "Branding", "client": "ASU Company", "date": "01 March, 2020", "url": "https://www.example.com" }, "title": "Exercitationem repudiandae officiis neque suscipit", "description": "Autem ipsum nam porro corporis rerum. Quis eos dolorem eos itaque inventore commodi labore quia quia.", "gallery": ["/img/portfolio/branding-1.jpg", "/img/portfolio/app-1.jpg", "/img/portfolio/product-1.jpg", "/img/portfolio/books-1.jpg"] } },
    { "slug": "app-3", "title": "App 3", "category": "app", "description": "Lorem ipsum, dolor sit", "image": "/img/masonry-portfolio/masonry-portfolio-7.jpg", "detail": { "info": { "category": "Web design", "client": "ASU Company", "date": "01 March, 2020", "url": "https://www.example.com" }, "title": "Exercitationem repudiandae officiis neque suscipit", "description": "Autem ipsum nam porro corporis rerum. Quis eos dolorem eos itaque inventore commodi labore quia quia.", "gallery": ["/img/portfolio/app-1.jpg", "/img/portfolio/product-1.jpg", "/img/portfolio/branding-1.jpg", "/img/portfolio/books-1.jpg"] } },
    { "slug": "product-3", "title": "Product 3", "category": "product", "description": "Lorem ipsum, dolor sit", "image": "/img/masonry-portfolio/masonry-portfolio-8.jpg", "detail": { "info": { "category": "Product design", "client": "ASU Company", "date": "01 March, 2020", "url": "https://www.example.com" }, "title": "Exercitationem repudiandae officiis neque suscipit", "description": "Autem ipsum nam porro corporis rerum. Quis eos dolorem eos itaque inventore commodi labore quia quia.", "gallery": ["/img/portfolio/product-1.jpg", "/img/portfolio/app-1.jpg", "/img/portfolio/branding-1.jpg", "/img/portfolio/books-1.jpg"] } },
    { "slug": "branding-3", "title": "Branding 3", "category": "branding", "description": "Lorem ipsum, dolor sit", "image": "/img/masonry-portfolio/masonry-portfolio-9.jpg", "detail": { "info": { "category": "Branding", "client": "ASU Company", "date": "01 March, 2020", "url": "https://www.example.com" }, "title": "Exercitationem repudiandae officiis neque suscipit", "description": "Autem ipsum nam porro corporis rerum. Quis eos dolorem eos itaque inventore commodi labore quia quia.", "gallery": ["/img/portfolio/branding-1.jpg", "/img/portfolio/app-1.jpg", "/img/portfolio/product-1.jpg", "/img/portfolio/books-1.jpg"] } }
  ]
}
```

`content/contact.json`:
```json
{
  "title": "Contact",
  "subtitle": "Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit",
  "email": "info@example.com",
  "info": [
    { "icon": "geo-alt", "title": "Address", "text": "A108 Adam Street, New York, NY 535022" },
    { "icon": "telephone", "title": "Call Us", "text": "+1 5589 55488 55" },
    { "icon": "envelope", "title": "Email Us", "text": "info@example.com" }
  ],
  "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus"
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/content.test.ts`
Expected: PASS (both tests).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: author typed per-page content json"
```

---

### Task 5: UI primitives + hooks

**Files:**
- Create: `components/ui/Section.tsx`, `components/ui/SectionTitle.tsx`, `components/ui/Button.tsx`, `components/ui/Reveal.tsx`, `components/ui/Icon.tsx`
- Create: `lib/useCountUp.ts`
- Test: `__tests__/ui.test.tsx`

**Interfaces:**
- Produces:
  - `Section({ id?, className?, children })` — `<section>` wrapper with container + vertical padding.
  - `SectionTitle({ title, subtitle })` — heading block.
  - `Button({ href, children, variant? })` — link-styled button (`variant: 'solid' | 'outline'`, default `solid`).
  - `Reveal({ children, delay?, className? })` — `'use client'`; fades/translates content in on scroll via IntersectionObserver.
  - `Icon({ name, className? })` — renders a Bootstrap Icon by name as `<i className={"bi bi-" + name}>`.
  - `useCountUp(target: number, durationMs?: number): number` — `'use client'` hook returning a value animating 0→target once visible; here it runs on mount.

- [ ] **Step 1: Write the failing test**

`__tests__/ui.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/ui.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement primitives**

`components/ui/Section.tsx`:
```tsx
export function Section({ id, className = '', children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`py-16 md:py-20 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-4">{children}</div>
    </section>
  );
}
```

`components/ui/SectionTitle.tsx`:
```tsx
export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-12 text-center">
      <h2 className="relative inline-block pb-2 text-3xl font-semibold uppercase tracking-wide after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-16 after:-translate-x-1/2 after:bg-accent">
        {title}
      </h2>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-muted">{subtitle}</p>}
    </div>
  );
}
```

`components/ui/Button.tsx`:
```tsx
import Link from 'next/link';

export function Button({ href, children, variant = 'solid' }: { href: string; children: React.ReactNode; variant?: 'solid' | 'outline' }) {
  const base = 'inline-block rounded-full px-8 py-3 text-sm font-medium uppercase tracking-wide transition-colors';
  const styles = variant === 'solid'
    ? 'bg-accent text-white hover:bg-accent/85'
    : 'border-2 border-accent text-accent hover:bg-accent hover:text-white';
  return <Link href={href} className={`${base} ${styles}`}>{children}</Link>;
}
```

`components/ui/Icon.tsx`:
```tsx
export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <i className={`bi bi-${name} ${className}`} aria-hidden="true" />;
}
```

`components/ui/Reveal.tsx`:
```tsx
'use client';
import { useEffect, useRef, useState } from 'react';

export function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
}
```

`lib/useCountUp.ts`:
```ts
'use client';
import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, durationMs = 1200): number {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let raf = 0;
    let startTs: number | null = null;
    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const progress = Math.min((ts - startTs) / durationMs, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}
```

Add Bootstrap Icons font via CDN-free local copy: copy the icons CSS + fonts into `public/` and link it. In `app/globals.css` append `@import` is not used for a remote host (offline build). Instead copy the vendor icon assets:
```bash
mkdir -p public/vendor/bootstrap-icons
cp -R _legacy/assets/vendor/bootstrap-icons/. public/vendor/bootstrap-icons/
```
Then add to the root layout `<head>` (in `app/layout.tsx`, add inside the returned `<html>` a `<head>` with a stylesheet link):
```tsx
<head>
  <link rel="stylesheet" href="/vendor/bootstrap-icons/bootstrap-icons.min.css" />
</head>
```
(Placing the link in `app/layout.tsx` head is allowed for static asset stylesheets.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/ui.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add ui primitives, Reveal, Icon, and useCountUp hook"
```

---

### Task 6: Layout chrome (Header, Nav, SocialLinks, Footer, ScrollTop) + root layout wiring

**Files:**
- Create: `components/layout/SocialLinks.tsx`, `components/layout/Nav.tsx`, `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `components/layout/ScrollTop.tsx`
- Modify: `app/layout.tsx`
- Test: `__tests__/nav.test.tsx`

**Interfaces:**
- Consumes: `getSite()` from `lib/content`, `Icon` from `components/ui/Icon`.
- Produces:
  - `SocialLinks({ links, className? })` where `links: SiteContent['social']`.
  - `Nav({ items })` — `'use client'`; `items: SiteContent['nav']`; highlights the active route via `usePathname()`; includes a mobile toggle.
  - `Header({ site })` — `site: SiteContent`; renders logo, `Nav`, `SocialLinks`.
  - `Footer({ site })` — copyright + social + credits.
  - `ScrollTop()` — `'use client'`; back-to-top button appearing after scroll.
- Root layout renders `Header`/`Footer`/`ScrollTop` around `{children}`.

- [ ] **Step 1: Write the failing test**

`__tests__/nav.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/nav.test.tsx`
Expected: FAIL — `Cannot find module '@/components/layout/Nav'`.

- [ ] **Step 3: Implement layout components**

`components/layout/SocialLinks.tsx`:
```tsx
import { Icon } from '@/components/ui/Icon';
import type { SiteContent } from '@/lib/schema';

export function SocialLinks({ links, className = '' }: { links: SiteContent['social']; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((l) => (
        <a key={l.platform} href={l.url} aria-label={l.platform} className="text-heading hover:text-accent">
          <Icon name={l.icon} />
        </a>
      ))}
    </div>
  );
}
```

`components/layout/Nav.tsx`:
```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { SiteContent } from '@/lib/schema';

export function Nav({ items }: { items: SiteContent['nav'] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  return (
    <nav className="flex items-center">
      <button
        className="md:hidden text-2xl text-heading"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? 'x' : 'list'} />
      </button>
      <ul className={`${open ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col gap-2 bg-white p-4 shadow md:static md:flex md:w-auto md:flex-row md:gap-6 md:bg-transparent md:p-0 md:shadow-none`}>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={`font-nav text-sm ${isActive(item.href) ? 'text-accent' : 'text-heading hover:text-accent'}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

`components/layout/Header.tsx`:
```tsx
import Link from 'next/link';
import { Nav } from './Nav';
import { SocialLinks } from './SocialLinks';
import type { SiteContent } from '@/lib/schema';

export function Header({ site }: { site: SiteContent }) {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-heading">{site.name}</Link>
        <Nav items={site.nav} />
        <SocialLinks links={site.social} className="hidden md:flex" />
      </div>
    </header>
  );
}
```

`components/layout/Footer.tsx`:
```tsx
import { SocialLinks } from './SocialLinks';
import type { SiteContent } from '@/lib/schema';

export function Footer({ site }: { site: SiteContent }) {
  return (
    <footer className="bg-surface py-10 text-center">
      <div className="mx-auto w-full max-w-6xl px-4">
        <p className="text-sm">
          © <span>Copyright</span> <strong className="px-1">{site.copyrightName}</strong>
          <span>All Rights Reserved</span>
        </p>
        <SocialLinks links={site.social} className="mt-4 justify-center" />
        <p className="mt-4 text-xs text-muted">
          Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
        </p>
      </div>
    </footer>
  );
}
```

`components/layout/ScrollTop.tsx`:
```tsx
'use client';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded bg-accent text-white shadow-lg hover:bg-accent/85"
    >
      <Icon name="arrow-up-short" className="text-2xl" />
    </button>
  );
}
```

- [ ] **Step 4: Wire the root layout**

Update `app/layout.tsx` body to include chrome:
```tsx
import { getSite } from '@/lib/content';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollTop } from '@/components/layout/ScrollTop';
// ...fonts + metadata unchanged...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${nav.variable}`}>
      <head>
        <link rel="stylesheet" href="/vendor/bootstrap-icons/bootstrap-icons.min.css" />
      </head>
      <body className="font-sans text-body bg-white antialiased">
        <Header site={site} />
        <main>{children}</main>
        <Footer site={site} />
        <ScrollTop />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run __tests__/nav.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add header, nav, footer, social links, scroll-top chrome"
```

---

### Task 7: Home page + Hero section

**Files:**
- Create: `components/sections/Hero.tsx`
- Modify: `app/page.tsx`
- Test: `__tests__/hero.test.tsx`

**Interfaces:**
- Consumes: `getHome()`, `Button`, `Reveal`.
- Produces: `Hero({ hero })` where `hero: HomeContent['hero']`; renders name, tagline, CTA over a full-bleed background image.

- [ ] **Step 1: Write the failing test**

`__tests__/hero.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/hero.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement Hero + home page**

`components/sections/Hero.tsx`:
```tsx
import { Button } from '@/components/ui/Button';
import type { HomeContent } from '@/lib/schema';

export function Hero({ hero }: { hero: HomeContent['hero'] }) {
  return (
    <section className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden">
      <img src={hero.backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 px-4 text-center text-white">
        <h1 className="text-4xl font-bold md:text-6xl">{hero.name}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">{hero.tagline}</p>
        <div className="mt-8"><Button href={hero.cta.href}>{hero.cta.label}</Button></div>
      </div>
    </section>
  );
}
```

`app/page.tsx`:
```tsx
import { getHome } from '@/lib/content';
import { Hero } from '@/components/sections/Hero';

export default function HomePage() {
  const { hero } = getHome();
  return <Hero hero={hero} />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/hero.test.tsx`
Expected: PASS.

- [ ] **Step 5: Verify page builds**

Run: `npm run build`
Expected: build succeeds; `out/index.html` contains "Kelly Adams".

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: home page with hero section"
```

---

### Task 8: About page — intro, skills, stats, testimonials

**Files:**
- Create: `components/sections/AboutIntro.tsx`, `components/sections/Skills.tsx`, `components/sections/Stats.tsx`, `components/sections/Testimonials.tsx`
- Create: `app/about/page.tsx`
- Test: `__tests__/about.test.tsx`

**Interfaces:**
- Consumes: `getAbout()`, `Section`, `SectionTitle`, `Reveal`, `useCountUp`, `Icon`, `swiper/react`.
- Produces:
  - `AboutIntro({ intro, title, subtitle })` — `intro: AboutContent['intro']`.
  - `Skills({ data })` — `data: AboutContent['skills']`; animated progress bars.
  - `Stats({ data })` — `'use client'`; `data: AboutContent['stats']`; count-up numbers.
  - `Testimonials({ data })` — `'use client'`; `data: AboutContent['testimonials']`; Swiper carousel.

- [ ] **Step 1: Write the failing test**

`__tests__/about.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/about.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement sections**

`components/sections/AboutIntro.tsx`:
```tsx
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Icon } from '@/components/ui/Icon';
import type { AboutContent } from '@/lib/schema';

export function AboutIntro({ intro, title, subtitle }: { intro: AboutContent['intro']; title: string; subtitle: string }) {
  return (
    <Section id="about">
      <SectionTitle title={title} subtitle={subtitle} />
      <div className="grid gap-8 md:grid-cols-3">
        <img src={intro.image} alt="" className="w-full rounded" />
        <div className="md:col-span-2">
          <h3 className="text-2xl font-semibold">{intro.heading}</h3>
          <p className="mt-3 italic text-muted">{intro.lead}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {intro.facts.map((f) => (
              <li key={f.label} className="flex items-center gap-2">
                <Icon name="chevron-right" className="text-accent" />
                <strong>{f.label}:</strong> <span>{f.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">{intro.body}</p>
        </div>
      </div>
    </Section>
  );
}
```

`components/sections/Skills.tsx`:
```tsx
'use client';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import type { AboutContent } from '@/lib/schema';

export function Skills({ data }: { data: AboutContent['skills'] }) {
  return (
    <Section id="skills" className="bg-surface">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
        {data.columns.flatMap((col) => col.skills).map((s) => (
          <div key={s.name}>
            <div className="flex justify-between text-sm font-medium">
              <span>{s.name}</span><span>{s.value}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded bg-gray-300">
              <div data-skill-bar className="h-2 rounded bg-accent transition-[width] duration-1000" style={{ width: `${s.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
```

`components/sections/Stats.tsx`:
```tsx
'use client';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useCountUp } from '@/lib/useCountUp';
import type { AboutContent } from '@/lib/schema';

function StatItem({ label, value }: { label: string; value: number }) {
  const n = useCountUp(value);
  return (
    <div className="text-center">
      <span className="block text-4xl font-bold text-accent">{n}</span>
      <p className="mt-2 text-muted">{label}</p>
    </div>
  );
}

export function Stats({ data }: { data: AboutContent['stats'] }) {
  return (
    <Section id="stats">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {data.items.map((s) => <StatItem key={s.label} {...s} />)}
      </div>
    </Section>
  );
}
```

`components/sections/Testimonials.tsx`:
```tsx
'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Icon } from '@/components/ui/Icon';
import type { AboutContent } from '@/lib/schema';

export function Testimonials({ data }: { data: AboutContent['testimonials'] }) {
  return (
    <Section id="testimonials" className="bg-surface">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        spaceBetween={24}
        className="pb-12"
      >
        {data.items.map((t) => (
          <SwiperSlide key={t.name}>
            <div className="mx-auto max-w-2xl rounded bg-white p-8 text-center shadow">
              <img src={t.image} alt={t.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
              <h3 className="mt-4 text-lg font-semibold">{t.name}</h3>
              <h4 className="text-sm text-muted">{t.role}</h4>
              <div className="mt-2 flex justify-center gap-1 text-yellow-400">
                {Array.from({ length: t.rating }).map((_, i) => <Icon key={i} name="star-fill" />)}
              </div>
              <p className="mt-4 italic text-muted">{t.quote}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
}
```

`app/about/page.tsx`:
```tsx
import { getAbout } from '@/lib/content';
import { AboutIntro } from '@/components/sections/AboutIntro';
import { Skills } from '@/components/sections/Skills';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';

export default function AboutPage() {
  const about = getAbout();
  return (
    <>
      <AboutIntro title={about.title} subtitle={about.subtitle} intro={about.intro} />
      <Skills data={about.skills} />
      <Stats data={about.stats} />
      <Testimonials data={about.testimonials} />
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/about.test.tsx`
Expected: PASS.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: success; `out/about/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: about page with intro, skills, stats, testimonials"
```

---

### Task 9: Resume page

**Files:**
- Create: `components/sections/ResumeTimeline.tsx`
- Create: `app/resume/page.tsx`
- Test: `__tests__/resume.test.tsx`

**Interfaces:**
- Consumes: `getResume()`, `Section`, `SectionTitle`, `Reveal`.
- Produces: `ResumeTimeline({ data })` where `data: ResumeContent`; renders two columns of grouped resume items.

- [ ] **Step 1: Write the failing test**

`__tests__/resume.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/resume.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

`components/sections/ResumeTimeline.tsx`:
```tsx
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import type { ResumeContent } from '@/lib/schema';

export function ResumeTimeline({ data }: { data: ResumeContent }) {
  return (
    <Section id="resume">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid gap-10 md:grid-cols-2">
        {data.columns.map((col, ci) => (
          <div key={ci}>
            {col.groups.map((group) => (
              <div key={group.title} className="mb-8">
                <h3 className="mb-4 text-xl font-semibold uppercase text-accent">{group.title}</h3>
                {group.items.map((item, ii) => (
                  <div key={ii} className="mb-6 border-l-2 border-accent/30 pl-4">
                    <h4 className="font-semibold uppercase">{item.heading}</h4>
                    {item.period && <h5 className="mt-1 inline-block rounded bg-surface px-2 py-0.5 text-sm">{item.period}</h5>}
                    {item.place && <p className="mt-1 italic text-muted">{item.place}</p>}
                    {item.summary && <p className="mt-2">{item.summary}</p>}
                    {item.bullets && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                        {item.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
```

`app/resume/page.tsx`:
```tsx
import { getResume } from '@/lib/content';
import { ResumeTimeline } from '@/components/sections/ResumeTimeline';

export default function ResumePage() {
  return <ResumeTimeline data={getResume()} />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/resume.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: resume page with timeline"
```

---

### Task 10: Services page

**Files:**
- Create: `components/sections/ServiceCard.tsx`
- Create: `app/services/page.tsx`
- Test: `__tests__/services.test.tsx`

**Interfaces:**
- Consumes: `getServices()`, `Section`, `SectionTitle`, `Reveal`, `Icon`.
- Produces: `ServiceCard({ service })` where `service: Service`; a services page mapping items to cards in a responsive grid.

- [ ] **Step 1: Write the failing test**

`__tests__/services.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/services.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

`components/sections/ServiceCard.tsx`:
```tsx
import { Icon } from '@/components/ui/Icon';
import type { Service } from '@/lib/schema';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="rounded-lg border border-black/5 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
      <span
        className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white"
        style={{ backgroundColor: service.color }}
      >
        <Icon name={service.icon} />
      </span>
      <h3 className="text-lg font-semibold">{service.title}</h3>
      <p className="mt-2 text-muted">{service.description}</p>
    </div>
  );
}
```

`app/services/page.tsx`:
```tsx
import { getServices } from '@/lib/content';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { ServiceCard } from '@/components/sections/ServiceCard';

export default function ServicesPage() {
  const data = getServices();
  return (
    <Section id="services">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((s, i) => (
          <Reveal key={s.title} delay={i * 80}><ServiceCard service={s} /></Reveal>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/services.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: services page with service cards"
```

---

### Task 11: Portfolio page — filter, gallery, lightbox

**Files:**
- Create: `components/sections/PortfolioGallery.tsx`
- Create: `app/portfolio/page.tsx`
- Test: `__tests__/portfolio.test.tsx`

**Interfaces:**
- Consumes: `getPortfolio()`, `Section`, `SectionTitle`, `Icon`, `yet-another-react-lightbox`, `next/link`.
- Produces: `PortfolioGallery({ data })` — `'use client'`; `data: PortfolioContent`; renders filter buttons + filtered grid; clicking zoom opens the lightbox; a details link routes to `/portfolio/[slug]`. Filtering by a filter `key` shows items whose `category === key` (or all when key is `all`).

- [ ] **Step 1: Write the failing test**

`__tests__/portfolio.test.tsx`:
```tsx
import { render, fireEvent } from '@testing-library/react';
import { PortfolioGallery } from '@/components/sections/PortfolioGallery';

const data = {
  title: 'Portfolio', subtitle: 'sub',
  filters: [{ key: 'all', label: 'All' }, { key: 'app', label: 'App' }, { key: 'product', label: 'Card' }],
  items: [
    { slug: 'app-1', title: 'App 1', category: 'app', description: 'd', image: '/img/a.jpg',
      detail: { info: { category: 'c', client: 'c', date: 'd', url: 'u' }, title: 't', description: 'x', gallery: ['/img/a.jpg'] } },
    { slug: 'product-1', title: 'Product 1', category: 'product', description: 'd', image: '/img/p.jpg',
      detail: { info: { category: 'c', client: 'c', date: 'd', url: 'u' }, title: 't', description: 'x', gallery: ['/img/p.jpg'] } },
  ],
};

it('shows all items initially and filters by category', () => {
  const { getByText, queryByText, getByRole } = render(<PortfolioGallery data={data} />);
  expect(getByText('App 1')).toBeInTheDocument();
  expect(getByText('Product 1')).toBeInTheDocument();
  fireEvent.click(getByRole('button', { name: 'App' }));
  expect(getByText('App 1')).toBeInTheDocument();
  expect(queryByText('Product 1')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/portfolio.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

`components/sections/PortfolioGallery.tsx`:
```tsx
'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Icon } from '@/components/ui/Icon';
import type { PortfolioContent } from '@/lib/schema';

export function PortfolioGallery({ data }: { data: PortfolioContent }) {
  const [active, setActive] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (active === 'all' ? data.items : data.items.filter((i) => i.category === active)),
    [active, data.items]
  );
  const slides = visible.map((i) => ({ src: i.image, title: i.title }));

  return (
    <Section id="portfolio">
      <SectionTitle title={data.title} subtitle={data.subtitle} />

      <ul className="mb-8 flex flex-wrap justify-center gap-4">
        {data.filters.map((f) => (
          <li key={f.key}>
            <button
              onClick={() => setActive(f.key)}
              className={`text-sm font-medium ${active === f.key ? 'text-accent' : 'text-heading hover:text-accent'}`}
            >
              {f.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, idx) => (
          <div key={item.slug} className="group relative overflow-hidden rounded">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <h4 className="text-lg font-semibold text-white">{item.title}</h4>
              <p className="text-sm text-white/80">{item.description}</p>
              <div className="mt-2 flex gap-4 text-white">
                <button aria-label={`Zoom ${item.title}`} onClick={() => setLightboxIndex(idx)}><Icon name="zoom-in" className="text-xl" /></button>
                <Link aria-label={`Details ${item.title}`} href={`/portfolio/${item.slug}`}><Icon name="link-45deg" className="text-xl" /></Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex !== null}
        index={lightboxIndex ?? 0}
        close={() => setLightboxIndex(null)}
        slides={slides}
      />
    </Section>
  );
}
```

`app/portfolio/page.tsx`:
```tsx
import { getPortfolio } from '@/lib/content';
import { PortfolioGallery } from '@/components/sections/PortfolioGallery';

export default function PortfolioPage() {
  return <PortfolioGallery data={getPortfolio()} />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/portfolio.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: portfolio page with filter and lightbox"
```

---

### Task 12: Portfolio detail dynamic route

**Files:**
- Create: `components/sections/PortfolioDetail.tsx`
- Create: `app/portfolio/[slug]/page.tsx`
- Test: `__tests__/portfolio-detail.test.tsx`

**Interfaces:**
- Consumes: `getPortfolio()`, `getPortfolioItem()`, `Section`, `SectionTitle`, `swiper/react`.
- Produces:
  - `PortfolioDetail({ item })` where `item: PortfolioItem`; renders a Swiper image slider + project info + description.
  - `app/portfolio/[slug]/page.tsx` exporting `generateStaticParams()` (one param per portfolio slug) and a default page that looks up the item and renders `PortfolioDetail`.

- [ ] **Step 1: Write the failing test**

`__tests__/portfolio-detail.test.tsx`:
```tsx
import { render } from '@testing-library/react';
import { PortfolioDetail } from '@/components/sections/PortfolioDetail';

it('renders project info and description', () => {
  const { getByText } = render(
    <PortfolioDetail item={{
      slug: 'app-1', title: 'App 1', category: 'app', description: 'd', image: '/img/a.jpg',
      detail: {
        info: { category: 'Web design', client: 'ASU Company', date: '01 March, 2020', url: 'https://example.com' },
        title: 'Project X', description: 'body text', gallery: ['/img/portfolio/app-1.jpg'],
      },
    }} />
  );
  expect(getByText('Project X')).toBeInTheDocument();
  expect(getByText('body text')).toBeInTheDocument();
  expect(getByText('ASU Company')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/portfolio-detail.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

`components/sections/PortfolioDetail.tsx`:
```tsx
'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import type { PortfolioItem } from '@/lib/schema';

export function PortfolioDetail({ item }: { item: PortfolioItem }) {
  const { detail } = item;
  return (
    <Section id="portfolio-details">
      <SectionTitle title="Portfolio Details" />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Swiper modules={[Autoplay, Pagination]} loop autoplay={{ delay: 5000 }} pagination={{ clickable: true }} className="pb-10">
            {detail.gallery.map((src) => (
              <SwiperSlide key={src}><img src={src} alt={item.title} className="w-full rounded object-cover" /></SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div>
          <div className="rounded bg-surface p-6">
            <h3 className="mb-3 text-lg font-semibold">Project information</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>Category</strong>: {detail.info.category}</li>
              <li><strong>Client</strong>: {detail.info.client}</li>
              <li><strong>Project date</strong>: {detail.info.date}</li>
              <li><strong>Project URL</strong>: <a href={detail.info.url}>{detail.info.url}</a></li>
            </ul>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">{detail.title}</h2>
            <p className="mt-2 text-muted">{detail.description}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`app/portfolio/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { getPortfolio, getPortfolioItem } from '@/lib/content';
import { PortfolioDetail } from '@/components/sections/PortfolioDetail';

export function generateStaticParams() {
  return getPortfolio().items.map((i) => ({ slug: i.slug }));
}

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const item = getPortfolioItem(params.slug);
  if (!item) notFound();
  return <PortfolioDetail item={item} />;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/portfolio-detail.test.tsx`
Expected: PASS.

- [ ] **Step 5: Verify static params emit one HTML per item**

Run: `npm run build && ls out/portfolio`
Expected: build succeeds; `out/portfolio/app-1/index.html` … `out/portfolio/branding-3/index.html` all exist (9 items).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: portfolio detail dynamic route with static params"
```

---

### Task 13: Contact page — info + mailto form

**Files:**
- Create: `components/sections/ContactInfo.tsx`, `components/sections/ContactForm.tsx`
- Create: `app/contact/page.tsx`
- Test: `__tests__/contact.test.tsx`

**Interfaces:**
- Consumes: `getContact()`, `Section`, `SectionTitle`, `Icon`.
- Produces:
  - `ContactInfo({ info, mapEmbedUrl })` where `info: ContactContent['info']`.
  - `ContactForm({ email })` — `'use client'`; validates required fields; on submit builds a `mailto:` link to `email` with subject/body and shows a success message. No network.

- [ ] **Step 1: Write the failing test**

`__tests__/contact.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/contact.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

`components/sections/ContactInfo.tsx`:
```tsx
import { Icon } from '@/components/ui/Icon';
import type { ContactContent } from '@/lib/schema';

export function ContactInfo({ info, mapEmbedUrl }: { info: ContactContent['info']; mapEmbedUrl: string }) {
  return (
    <div className="space-y-6">
      {info.map((i) => (
        <div key={i.title} className="flex items-start gap-4">
          <Icon name={i.icon} className="text-2xl text-accent" />
          <div>
            <h3 className="font-semibold">{i.title}</h3>
            <p className="text-muted">{i.text}</p>
          </div>
        </div>
      ))}
      <iframe src={mapEmbedUrl} className="h-64 w-full rounded border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
    </div>
  );
}
```

`components/sections/ContactForm.tsx`:
```tsx
'use client';
import { useState } from 'react';

export function ContactForm({ email }: { email: string }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please fill in all fields.');
      setSent(false);
      return;
    }
    setError('');
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    const subject = encodeURIComponent(form.subject);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field = 'w-full rounded border border-black/15 px-3 py-2 focus:border-accent focus:outline-none';

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name-field" className="mb-1 block text-sm">Your Name</label>
          <input id="name-field" className={field} value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label htmlFor="email-field" className="mb-1 block text-sm">Your Email</label>
          <input id="email-field" type="email" className={field} value={form.email} onChange={update('email')} />
        </div>
      </div>
      <div>
        <label htmlFor="subject-field" className="mb-1 block text-sm">Subject</label>
        <input id="subject-field" className={field} value={form.subject} onChange={update('subject')} />
      </div>
      <div>
        <label htmlFor="message-field" className="mb-1 block text-sm">Message</label>
        <textarea id="message-field" rows={8} className={field} value={form.message} onChange={update('message')} />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {sent && <p className="text-green-600">Your message has been sent. Thank you!</p>}
      <div className="text-center">
        <button type="submit" className="rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase text-white hover:bg-accent/85">
          Send Message
        </button>
      </div>
    </form>
  );
}
```

`app/contact/page.tsx`:
```tsx
import { getContact } from '@/lib/content';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContactInfo } from '@/components/sections/ContactInfo';
import { ContactForm } from '@/components/sections/ContactForm';

export default function ContactPage() {
  const data = getContact();
  return (
    <Section id="contact">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid gap-10 md:grid-cols-2">
        <ContactInfo info={data.info} mapEmbedUrl={data.mapEmbedUrl} />
        <ContactForm email={data.email} />
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/contact.test.tsx`
Expected: PASS. Note: jsdom does not implement navigation; if assigning `window.location.href` throws, guard the test by stubbing it: add at top of test `Object.defineProperty(window, 'location', { value: { href: '' }, writable: true });`. Include that stub in the test file.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: contact page with info and mailto form"
```

---

### Task 14: Full static export verification

**Files:**
- Modify: `README.md` (create)
- No new components.

**Interfaces:**
- Consumes: everything.
- Produces: a verified static `out/` build and project README.

- [ ] **Step 1: Run the whole test suite**

Run: `npm test`
Expected: all test files pass.

- [ ] **Step 2: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: no type errors; build emits `out/` with `index.html`, `about/`, `resume/`, `services/`, `portfolio/`, `portfolio/<slug>/`, `contact/`.

- [ ] **Step 3: Smoke-serve the static output**

Run: `npx serve out` (or `python3 -m http.server -d out 8080`) and load `/`, `/portfolio/`, `/portfolio/app-1/`, `/contact/`.
Expected: pages render, nav highlights active route, portfolio filter works, lightbox opens, testimonials carousel autoplays, contact form validates.

- [ ] **Step 4: Write README**

`README.md`:
```markdown
# Kelly

Static personal CV/resume site. Next.js (App Router, static export) + TypeScript + Tailwind.
Content is per-page JSON in `content/`, validated with Zod at build.

## Develop
- `npm install`
- `npm run dev` — http://localhost:3000
- `npm test` — run Vitest
- `npm run build` — static export to `out/`

## Edit content
Edit files in `content/*.json`. Types/validation live in `lib/schema.ts`.
A malformed file fails the build. Original template archived in `_legacy/`.
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "docs: add README and verify static export"
```

---

## Self-Review

**Spec coverage:**
- Next.js static export → Task 1 (`output: 'export'`), verified Tasks 12/14.
- Tailwind full restyle → Tasks 2, 5–13.
- Per-page typed JSON + Zod → Tasks 3, 4.
- Types inferred from Zod → Task 3.
- Pages `/ /about /resume /services /portfolio /portfolio/[slug] /contact` → Tasks 7–13.
- `starter-page` dropped → not built (Task 1 archives it).
- Contact form mailto/UI-only → Task 13.
- Originals archived to `_legacy/`, images migrated → Task 1.
- Component boundaries (ui/sections/layout; props-only) → Tasks 5, 6, and all section tasks.
- Build-fails-loud error handling → Tasks 3/4 (Zod parse in loaders), verified in build steps.
- Light Vitest testing → every task has schema/component tests.
- Testimonials placement confirmed: original template renders Testimonials on the About page (below Stats) → Task 8.

**Placeholder scan:** No TBD/TODO. All code blocks concrete. Lorem-ipsum strings are intentional carried-over template copy, not plan placeholders.

**Type consistency:** Loader names (`getSite/getHome/getAbout/getResume/getServices/getPortfolio/getContact/getPortfolioItem`) consistent between Task 3 definition and Tasks 6–13 consumption. Component prop shapes reference inferred types (`AboutContent['skills']`, `PortfolioItem`, `Service`, etc.) defined in Task 3. Filter semantics (`category === key`, `all` = show all) consistent between portfolio.json (Task 4), gallery (Task 11), and its test.
