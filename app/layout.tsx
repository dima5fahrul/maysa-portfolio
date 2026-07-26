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
