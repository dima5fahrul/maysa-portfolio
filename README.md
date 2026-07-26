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
