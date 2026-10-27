import { Button } from '@/components/ui/Button';
import type { HomeContent } from '@/lib/schema';

export function Hero({ hero, scrollTo }: { hero: HomeContent['hero']; scrollTo?: string }) {
  return (
    <section className="relative flex min-h-[100svh] flex-1 items-center justify-center overflow-hidden">
      <img
        src={hero.backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full animate-ken-burns object-cover object-bottom will-change-transform"
      />
      <div className="absolute inset-0 animate-fade-in bg-gradient-to-b from-black/75 via-black/55 to-black/80"></div>
      <div className="absolute inset-0 animate-fade-in bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]"></div>

      <div className="relative z-10 px-4 text-center text-white sm:px-6 lg:px-8">
        <h1 className="animate-fade-up font-display text-7xl font-normal leading-none tracking-wide [animation-delay:200ms] md:text-9xl">
          {hero.name}
        </h1>
        <div className="mx-auto mt-6 h-px w-24 origin-center animate-line-grow bg-accent [animation-delay:600ms]"></div>
        <p className="mx-auto mt-6 max-w-xl animate-fade-up font-serif text-xl font-light italic tracking-wide text-white/85 [animation-delay:800ms] md:text-2xl">
          {hero.tagline}
        </p>
        <div className="mt-10 animate-fade-up [animation-delay:1100ms]">
          <Button href={hero.cta.href}>{hero.cta.label}</Button>
        </div>
      </div>

      {scrollTo && (
        <a
          href={`#${scrollTo}`}
          aria-label="Scroll to next section"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-fade-in p-2 text-white/70 transition-colors hover:text-white [animation-delay:1600ms]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 animate-scroll-cue"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </a>
      )}
    </section>
  );
}
