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
const statSchema = z.object({ label: z.string(), value: z.number(), suffix: z.string().optional() });

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
  selectedWork: z.object({ title: z.string(), subtitle: z.string() }),
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

const serviceSchema = z.object({
  icon: z.string(), color: z.string(), title: z.string(), description: z.string(),
  image: z.string().optional(), category: z.string().optional(),
});
export const servicesSchema = z.object({
  title: z.string(), subtitle: z.string(), items: z.array(serviceSchema),
});

const metricSchema = z.object({ value: z.string(), label: z.string() });
const caseStepSchema = z.object({ title: z.string(), description: z.string() });
const portfolioFilterSchema = z.object({ key: z.string(), label: z.string(), tag: z.string().optional() });

const portfolioItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  field: z.string(),
  role: z.string(),
  organization: z.string(),
  period: z.string(),
  team: z.string().optional(),
  summary: z.string(),
  cover: z.string().optional(),
  metrics: z.array(metricSchema).min(1),
  featured: z.boolean().optional(),
  selected: z.boolean().optional(),
  situation: z.array(z.string()).min(1),
  task: z.string(),
  quote: z.string().optional(),
  steps: z.array(caseStepSchema).min(1),
  resultNotes: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
});
export const portfolioSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  filters: z.array(portfolioFilterSchema).min(1),
  items: z.array(portfolioItemSchema),
}).superRefine((data, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  const featured = data.items.filter((i) => i.featured).length;
  if (featured > 1) issue(`At most one portfolio item can be featured (found ${featured}).`);
  const selected = data.items.filter((i) => i.selected).length;
  if (selected > 3) issue(`At most three portfolio items can be selected (found ${selected}).`);
  const keys = new Set(data.filters.map((f) => f.key).filter((k) => k !== 'all'));
  const slugs = new Set<string>();
  for (const { slug, category } of data.items) {
    if (!keys.has(category)) issue(`Unknown category "${category}" on item "${slug}".`);
    if (slugs.has(slug)) issue(`Duplicate slug "${slug}".`);
    slugs.add(slug);
  }
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
export type Metric = z.infer<typeof metricSchema>;
export type CaseStep = z.infer<typeof caseStepSchema>;
export type PortfolioFilter = z.infer<typeof portfolioFilterSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type ResumeColumn = z.infer<typeof resumeColumnSchema>;
export type ResumeItem = z.infer<typeof resumeItemSchema>;
