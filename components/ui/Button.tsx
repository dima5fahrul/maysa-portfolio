import Link from 'next/link';

export function Button({ href, children, variant = 'solid' }: { href: string; children: React.ReactNode; variant?: 'solid' | 'outline' }) {
  const base = 'inline-block rounded-full px-8 py-3 text-sm font-medium uppercase tracking-wide transition-colors';
  const styles = variant === 'solid'
    ? 'bg-accent text-white hover:bg-accent/85'
    : 'border-2 border-accent text-accent hover:bg-accent hover:text-white';
  return <Link href={href} className={`${base} ${styles}`}>{children}</Link>;
}
