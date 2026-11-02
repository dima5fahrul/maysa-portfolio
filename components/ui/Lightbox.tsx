'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon';

export type LightboxImage = { src: string; alt: string; caption?: string };

type LightboxApi = {
  images: LightboxImage[];
  show: (index: number) => void;
  register: (index: number, el: HTMLButtonElement | null) => void;
};

const LightboxContext = createContext<LightboxApi | null>(null);

/**
 * Holds one set of images. Any <LightboxThumb> inside it opens the viewer, which then pages
 * through the whole set. Children stay server-rendered, so thumbnails can sit in any markup.
 */
export function LightboxGroup({ images, children }: { images: LightboxImage[]; children: React.ReactNode }) {
  const [open, setOpen] = useState<number | null>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const count = images.length;
  const isOpen = open !== null;
  const single = count === 1;

  // Wraps around both ways, so "next" on the last photo goes back to the first.
  const step = useCallback((delta: number) => setOpen((i) => (i === null ? i : (i + delta + count) % count)), [count]);

  const close = useCallback(() => {
    setOpen((i) => {
      if (i !== null) thumbs.current[i]?.focus();
      return null;
    });
  }, []);

  const register = useCallback((index: number, el: HTMLButtonElement | null) => {
    thumbs.current[index] = el;
  }, []);

  // Runs when the lightbox opens or closes, not on every photo change.
  useEffect(() => {
    if (!isOpen) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close, step]);

  const navButton = 'absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/25 md:h-14 md:w-14';
  const current = open === null ? null : images[open];

  return (
    <LightboxContext.Provider value={{ images, show: setOpen, register }}>
      {children}

      {/* Portalled to <body>: the Reveal wrapper's transform would otherwise trap position:fixed inside the section. */}
      {open !== null &&
        current &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${current.alt} (${open + 1} of ${count})`}
            onClick={close}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null || single) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            }}
            className="fixed inset-0 z-[100] flex animate-fade-in-fast items-center justify-center bg-black/90 p-4 pb-14 md:p-16"
          >
            <figure key={open} className="flex max-w-full animate-fade-in-fast flex-col items-center">
              <img
                src={current.src}
                alt={current.alt}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[calc(100dvh-8rem)] max-w-full rounded object-contain shadow-2xl md:max-h-[calc(100dvh-11rem)]"
              />
              {current.caption && (
                <figcaption onClick={(e) => e.stopPropagation()} className="mt-3 max-w-xl text-center text-sm text-white/90">
                  {current.caption}
                </figcaption>
              )}
            </figure>

            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-colors hover:bg-white/25"
            >
              <Icon name="x-lg" />
            </button>

            {!single && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous image"
                  className={`${navButton} left-3 md:left-6`}
                >
                  <Icon name="chevron-left" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next image"
                  className={`${navButton} right-3 md:right-6`}
                >
                  <Icon name="chevron-right" />
                </button>
                <p className="absolute inset-x-0 bottom-4 text-center text-sm tracking-widest text-white/80" aria-live="polite">
                  {open + 1} / {count}
                </p>
              </>
            )}
          </div>,
          document.body,
        )}
    </LightboxContext.Provider>
  );
}

/** A thumbnail button that opens its <LightboxGroup> at `index`. */
export function LightboxThumb({
  index,
  className = '',
  imgClassName = '',
}: {
  index: number;
  className?: string;
  imgClassName?: string;
}) {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('<LightboxThumb> must be inside a <LightboxGroup>.');
  const image = ctx.images[index];
  return (
    <button
      ref={(el) => ctx.register(index, el)}
      type="button"
      onClick={() => ctx.show(index)}
      aria-label={`View ${image.alt}`}
      className={`group relative block cursor-zoom-in overflow-hidden ${className}`}
    >
      <img
        src={image.src}
        alt=""
        loading="lazy"
        className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgClassName}`}
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-2xl text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
        <Icon name="arrows-fullscreen" />
      </span>
    </button>
  );
}
