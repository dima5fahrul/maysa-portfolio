# Kelly — React/TypeScript Migration Design

**Date:** 2026-07-26
**Status:** Approved

## Goal

Convert the static BootstrapMade "Kelly" CV/resume template into a Next.js + TypeScript
site whose content is driven by per-page JSON files. Output stays fully static ("dynamic
but static"): content is imported and baked into HTML at build time. Clean architecture,
reusable components.

## Decisions

| Area | Decision |
|------|----------|
| Framework | Next.js App Router + TypeScript, `output: 'export'` (static `out/`) |
| Styling | Tailwind CSS — full restyle, drop Bootstrap |
| Interaction libs | All React-native: `swiper/react`, `yet-another-react-lightbox`, IntersectionObserver hook for scroll reveal, count-up hook for stats. No imperative vendor JS. |
| Content | One typed JSON per page in `content/`, imported at build, validated with Zod |
| Types | Inferred from Zod schemas (`z.infer`) — schema is single source of truth |
| Pages | `/`, `/about`, `/resume`, `/services`, `/portfolio`, `/portfolio/[slug]`, `/contact` |
| Dropped | `starter-page` (empty scaffold) |
| Contact form | Client-side validation + UI success state + `mailto:` fallback. No backend. |
| Layout | Scaffold at repo root; originals moved to `_legacy/`; images migrated to `public/img/` |

## Directory Structure

```
Kelly/
  app/
    layout.tsx                   root: fonts, Header, Footer, ScrollTop, metadata
    page.tsx                     home
    about/page.tsx
    resume/page.tsx
    services/page.tsx
    portfolio/page.tsx
    portfolio/[slug]/page.tsx    generateStaticParams from portfolio.json
    contact/page.tsx
    globals.css                  Tailwind directives + theme tokens
  components/
    layout/    Header Nav SocialLinks Footer ScrollTop
    sections/  Hero Skills ResumeTimeline ServiceCard PortfolioGallery
               PortfolioFilter Testimonials Stats ContactForm ContactInfo
    ui/        Section SectionTitle Button Card Reveal
  content/     home.json about.json resume.json services.json
               portfolio.json contact.json
  lib/
    content.ts                   typed loaders (import JSON, schema.parse)
    schema.ts                    Zod schema per page
  types/                         re-exported inferred content types
  public/img/                    migrated images
  _legacy/                       original template (archived)
```

## Content Model + Data Flow

1. Each page has one JSON in `content/` (e.g. `home.json`, `about.json`).
2. `lib/schema.ts` defines a Zod schema per page. Types inferred via `z.infer`.
3. `lib/content.ts` imports the JSON and runs `schema.parse()` → returns a typed object.
4. `page.tsx` calls the loader, passes typed props down to section components.
5. Next.js SSG bakes the result into static HTML at build.

Portfolio detail: `portfolio.json` items each carry a `slug`. `portfolio/[slug]/page.tsx`
uses `generateStaticParams()` to emit one static HTML file per item.

## Component Boundaries

- **ui/** — dumb, content-agnostic primitives (`Section` wrapper, `SectionTitle`,
  `Button`, `Card`, `Reveal` scroll-animation wrapper). Reused everywhere.
- **sections/** — page building blocks; accept typed props only; no data fetching inside.
- **layout/** — shared chrome rendered by the root layout.
- **Rule:** components never import JSON directly. Data flows in as props. Keeps them
  reusable and testable.

## Error Handling

- Malformed or missing content → Zod `parse()` throws at build → build fails loud.
  No bad content reaches a deploy.
- Contact form → client-side validation, UI success state, `mailto:` fallback. No server.

## Testing (light — YAGNI beyond this)

- Vitest schema tests: every `content/*.json` parses against its schema.
- Optional smoke render of a few key section components.

## Page → Section Mapping (from original template)

| Page | Sections |
|------|----------|
| Home | Hero |
| About | About intro, Skills, Stats (counters) |
| Resume | ResumeTimeline (summary, education, experience) |
| Services | ServiceCard grid |
| Portfolio | PortfolioFilter + PortfolioGallery (Isotope→grid+state, lightbox) |
| Portfolio detail | item detail, image slider (Swiper) |
| Contact | ContactInfo + ContactForm |
| Shared (all) | Header/Nav/SocialLinks, Footer, ScrollTop |
| Testimonials | Testimonials (Swiper) — placed where template used it |

## Out of Scope

- Real backend / email sending
- CMS
- Preloader (dropped; not needed with fast static load)
- `starter-page`
