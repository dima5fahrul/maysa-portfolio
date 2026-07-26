import './globals.css';
import type { Metadata } from 'next';
import { Poppins, Raleway, Roboto } from 'next/font/google';
import { getSite } from '@/lib/content';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollTop } from '@/components/layout/ScrollTop';

const heading = Poppins({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-heading' });
const body = Raleway({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-body' });
const nav = Roboto({ subsets: ['latin'], weight: ['400','500','700'], variable: '--font-nav' });

export const metadata: Metadata = {
  title: 'Kelly',
  description: 'Kelly — personal CV / resume',
  icons: { icon: '/img/favicon.png', apple: '/img/apple-touch-icon.png' },
};

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
