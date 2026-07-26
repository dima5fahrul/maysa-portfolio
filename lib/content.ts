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
