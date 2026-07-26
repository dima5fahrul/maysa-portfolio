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
