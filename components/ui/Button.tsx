import Link from 'next/link';

const STYLES = {
  solid: 'bg-accent text-white hover:bg-accent/85 hover:text-white',
  outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white',
  light: 'bg-white text-accent hover:bg-white/90',
} as const;

export function Button({ href, children, variant = 'solid' }: { href: string; children: React.ReactNode; variant?: keyof typeof STYLES }) {
  const base = 'inline-block rounded-full px-8 py-3 text-sm font-medium uppercase tracking-wide transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25';
  return <Link href={href} className={`${base} ${STYLES[variant]}`}>{children}</Link>;
}
