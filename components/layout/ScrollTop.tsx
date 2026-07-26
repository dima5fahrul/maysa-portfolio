'use client';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded bg-accent text-white shadow-lg hover:bg-accent/85"
    >
      <Icon name="arrow-up-short" className="text-2xl" />
    </button>
  );
}
