import { Button } from '@/components/ui/Button';
import type { HomeContent } from '@/lib/schema';

export function Hero({ hero }: { hero: HomeContent['hero'] }) {
  return (
    <section className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden">
      <img src={hero.backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 px-4 text-center text-white">
        <h1 className="text-4xl font-bold md:text-6xl">{hero.name}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">{hero.tagline}</p>
        <div className="mt-8"><Button href={hero.cta.href}>{hero.cta.label}</Button></div>
      </div>
    </section>
  );
}
