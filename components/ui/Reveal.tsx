'use client';
import { useInView } from '@/lib/useInView';

const FROM = {
  up: 'translate-y-8',
  down: '-translate-y-8',
  left: '-translate-x-8',
  right: 'translate-x-8',
  none: '',
} as const;

export function Reveal({
  children,
  delay = 0,
  from = 'up',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  from?: keyof typeof FROM;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.1);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        inView ? 'translate-x-0 translate-y-0 opacity-100 blur-0' : `${FROM[from]} opacity-0 blur-[6px]`
      } ${className}`}
    >
      {children}
    </div>
  );
}
