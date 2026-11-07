'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { mediaUrl } from '@/lib/media-url';
import type { NewsItem } from '@/lib/types';

type Poster = Pick<NewsItem, 'id' | 'poster_key' | 'poster_alt' | 'poster_portrait_key'>;

function PosterImage({ item }: { item: Poster }) {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={mediaUrl(item.poster_key)} />
      <img
        src={mediaUrl(item.poster_portrait_key ?? item.poster_key)}
        alt={item.poster_alt}
        className="mx-auto max-h-[80vh] w-full object-contain"
        draggable={false}
      />
    </picture>
  );
}

export default function JaunumiSlideshow({ items }: { items: Poster[] }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  const count = items.length;
  const single = count === 1;

  const reducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const go = useCallback(
    (index: number) => {
      setCurrent(((index % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  // Auto-advance
  useEffect(() => {
    if (single || reducedMotion) return;

    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setCurrent((c) => (c + 1) % count);
      }
    }, 8000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [single, reducedMotion, count]);

  // Pause on hidden tab
  useEffect(() => {
    function handleVisibility() {
      pausedRef.current = document.hidden;
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Touch swipe
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) >= 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  }

  if (count === 0) return null;

  return (
    <section
      role="region"
      aria-label="Gaidāmie pasākumi"
      className="relative select-none"
      ref={containerRef}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className="relative overflow-hidden">
        {items.map((item, i) => (
          <div
            key={item.id}
            aria-hidden={i !== current}
            className={`transition-opacity duration-500 ${
              i === current ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'
            }`}
          >
            <PosterImage item={item} />
          </div>
        ))}
      </div>

      {/* Arrow buttons — only when more than one poster */}
      {!single && (
        <>
          <button
            onClick={() => { prev(); pausedRef.current = false; }}
            aria-label="Iepriekšējais"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:left-4 md:p-3"
          >
            <svg aria-hidden="true" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => { next(); pausedRef.current = false; }}
            aria-label="Nākamais"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:right-4 md:p-3"
          >
            <svg aria-hidden="true" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators — only when more than one poster */}
      {!single && (
        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Pasākumu saraksts">
          {items.map((item, i) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={i === current}
              aria-current={i === current ? 'true' : undefined}
              aria-label={`Pasākums ${i + 1}`}
              onClick={() => { go(i); pausedRef.current = false; }}
              className={`h-2.5 w-2.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink ${
                i === current ? 'bg-ink' : 'bg-ink/30 hover:bg-ink/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
