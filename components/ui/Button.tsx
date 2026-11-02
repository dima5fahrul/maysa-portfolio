import Link from 'next/link';

const STYLES = {
  solid: 'bg-accent text-white hover:bg-accent/85 hover:text-white',
  outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white',
  light: 'bg-white text-accent hover:bg-white/90',
} as const;

export function Button({ href, children, variant = 'solid' }: { href: string; children: React.ReactNode; variant?: keyof typeof STYLES }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-medium uppercase tracking-wide transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25';
  const className = `${base} ${STYLES[variant]}`;
  // Internal routes go through next/link; wa.me, mailto: and other outside links are plain anchors.
  if (!href.startsWith('/')) {
    const external = href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return <a href={href} {...external} className={className}>{children}</a>;
  }
  return <Link href={href} className={className}>{children}</Link>;
}
