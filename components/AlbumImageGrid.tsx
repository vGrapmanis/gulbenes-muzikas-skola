'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryImage } from '@/lib/types';
import { mediaUrl } from '@/lib/media-url';

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  index,
  onClose,
  onChange,
}: {
  images: Array<{ src: string; alt: string }>;
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const count = images.length;
  const current = images[index];

  const prev = useCallback(() => onChange(Math.max(0, index - 1)), [index, onChange]);
  const next = useCallback(() => onChange(Math.min(count - 1, index + 1)), [index, count, onChange]);

  // Reset loading state when image changes
  useEffect(() => { setImgLoaded(false); }, [index]);

  // Lock scroll + focus close button
  useEffect(() => {
    closeRef.current?.focus();
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  // Touch / swipe
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 60) prev();
    else if (delta < -60) next();
    touchStartX.current = null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${index + 1} no ${count}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close */}
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Aizvērt"
        className="absolute top-4 right-4 z-10 rounded-full p-2.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="Iepriekšējais attēls"
        aria-disabled={index === 0}
        tabIndex={index === 0 ? -1 : 0}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:invisible aria-disabled:invisible"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Nākamais attēls"
        aria-disabled={index === count - 1}
        tabIndex={index === count - 1 ? -1 : 0}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white aria-disabled:invisible"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Image area — stop click propagation so clicking the image doesn't close */}
      <div
        className="relative flex max-h-screen max-w-[calc(100vw-5rem)] flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading spinner */}
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <svg
              className="h-10 w-10 animate-spin text-white/30"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current.src}
          src={current.src}
          alt={current.alt}
          onLoad={() => setImgLoaded(true)}
          className={`max-h-[88vh] max-w-full object-contain transition-opacity duration-200 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          draggable={false}
        />

        {/* Caption + counter */}
        <div className="mt-3 flex w-full items-center justify-between gap-4 px-1">
          {current.alt ? (
            <p className="text-sm text-gray-400">{current.alt}</p>
          ) : (
            <span />
          )}
          <p className="shrink-0 text-xs tabular-nums text-white/30">
            {index + 1} / {count}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Image grid ────────────────────────────────────────────────────────────────

export default function AlbumImageGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const triggerRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  function open(i: number) { setLightboxIdx(i); }

  function close() {
    const idx = lightboxIdx;
    setLightboxIdx(null);
    if (idx !== null) {
      setTimeout(() => triggerRefs.current.get(idx)?.focus(), 0);
    }
  }

  const lightboxImages = images.map((img) => ({
    src: mediaUrl(img.image_key),
    alt: img.alt || '',
  }));

  return (
    <>
      <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4" role="list">
        {images.map((img, i) => (
          <li key={img.id}>
            <button
              ref={(el) => {
                if (el) triggerRefs.current.set(i, el);
                else triggerRefs.current.delete(i);
              }}
              onClick={() => open(i)}
              aria-label={img.alt || `Foto ${i + 1}`}
              className="group block aspect-square w-full overflow-hidden bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(img.image_key)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-80"
              />
            </button>
          </li>
        ))}
      </ul>

      {lightboxIdx !== null && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIdx}
          onClose={close}
          onChange={setLightboxIdx}
        />
      )}
    </>
  );
}
