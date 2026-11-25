'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { GalleryAlbum } from '@/lib/types';
import { mediaUrl } from '@/lib/media-url';
import { EXPIRY_YEARS, isContentExpired } from '@/lib/content-expiry';
import {
  createAlbumAction,
  deleteAlbumAction,
  togglePublishAlbumAction,
  deleteExpiredAlbumsAction,
} from '@/app/admin/(protected)/galerija/actions';

// ── Create form ───────────────────────────────────────────────────────────────

function CreateAlbumForm({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createAlbumAction(fd);
      if (result.error) {
        setError(result.error);
      } else if (result.id) {
        router.push(`/admin/galerija/${result.id}`);
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p role="alert" className="rounded bg-red-900/40 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="new-album-title" className="block text-sm font-medium text-gray-300">
          Nosaukums <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <input
          id="new-album-title"
          name="title"
          type="text"
          required
          autoFocus
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="new-album-desc" className="block text-sm font-medium text-gray-300">
          Apraksts
        </label>
        <textarea
          id="new-album-desc"
          name="description"
          rows={2}
          className="w-full resize-none rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="new-album-date" className="block text-sm font-medium text-gray-300">
          Notikuma datums
        </label>
        <input
          id="new-album-date"
          name="event_date"
          type="date"
          className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-paper px-5 py-2 text-sm font-medium text-ink transition hover:bg-gray-200 disabled:opacity-50"
        >
          {pending ? 'Izveido…' : 'Izveidot'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-600 px-5 py-2 text-sm text-gray-300 transition hover:border-gray-400"
        >
          Atcelt
        </button>
      </div>
    </form>
  );
}

// ── Album card ────────────────────────────────────────────────────────────────

function AlbumCard({ album }: { album: GalleryAlbum }) {
  const [pending, startTransition] = useTransition();
  const [gone, setGone] = useState(false);

  function handleDelete() {
    if (!confirm(`Dzēst albumu "${album.title}" un visus tā attēlus?`)) return;
    startTransition(async () => {
      const result = await deleteAlbumAction(album.id);
      if (!result.error) setGone(true);
    });
  }

  function handleTogglePublish() {
    startTransition(async () => {
      await togglePublishAlbumAction(album.id, !album.published);
    });
  }

  if (gone) return null;

  return (
    <div className="flex flex-col overflow-hidden rounded border border-gray-700 bg-gray-800/50">
      {/* Cover thumbnail */}
      <div className="relative aspect-video bg-gray-900">
        {album.cover_key ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(album.cover_key)}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-600">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <circle cx="12" cy="14" r="3" />
              <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            <span className="text-xs">Nav vāka</span>
          </div>
        )}
        <span
          className={`absolute top-2 right-2 rounded px-2 py-0.5 text-xs font-medium ${
            album.published ? 'bg-green-800/80 text-green-300' : 'bg-gray-700/80 text-gray-400'
          }`}
        >
          {album.published ? 'Publicēts' : 'Melnraksts'}
        </span>
        {album.published && isContentExpired(album) && (
          <span className="absolute top-2 left-2 rounded bg-amber-900/60 px-2 py-0.5 text-xs font-medium text-amber-300">
            Vecāks par {EXPIRY_YEARS} gadiem
          </span>
        )}
      </div>

      {/* Info + actions */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-heading font-semibold leading-snug text-paper">{album.title}</h3>
          {album.event_date && (
            <p className="mt-0.5 text-xs text-gray-400">{album.event_date}</p>
          )}
          {album.description && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{album.description}</p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-gray-700 pt-3">
          <Link
            href={`/admin/galerija/${album.id}`}
            className="rounded bg-paper px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-gray-200"
          >
            Atvērt
          </Link>

          <button
            onClick={handleTogglePublish}
            disabled={pending}
            className={`rounded border px-3 py-1.5 text-xs transition disabled:opacity-50 ${
              album.published
                ? 'border-gray-600 text-gray-300 hover:border-gray-400'
                : 'border-green-800/60 text-green-400 hover:border-green-600'
            }`}
          >
            {album.published ? 'Paslēpt' : 'Publicēt'}
          </button>

          <button
            onClick={handleDelete}
            disabled={pending}
            className="ml-auto rounded border border-red-800/60 px-3 py-1.5 text-xs text-red-400 transition hover:border-red-600 disabled:opacity-50"
          >
            Dzēst
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function GalerijaManager({ albums }: { albums: GalleryAlbum[] }) {
  const [showForm, setShowForm] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [pendingCleanup, startCleanupTransition] = useTransition();
  const [cleanupError, setCleanupError] = useState<string | null>(null);

  const visibleAlbums = albums.filter((a) => !removedIds.has(a.id));
  const expiredAlbums = visibleAlbums.filter((item) => item.published && isContentExpired(item));

  function handleDeleteExpired() {
    if (
      !confirm(
        `Dzēst ${expiredAlbums.length} novecojušus albumus un visus to attēlus (vecāki par ${EXPIRY_YEARS} gadiem)? Šo darbību nevar atsaukt.`
      )
    )
      return;
    setCleanupError(null);
    startCleanupTransition(async () => {
      const result = await deleteExpiredAlbumsAction();
      if (result.error) setCleanupError(result.error);
      else setRemovedIds(new Set(expiredAlbums.map((a) => a.id)));
    });
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-400">
        &quot;Paslēpt&quot; noņem albumu vai bildi no publiskās vietnes, bet attēli
        paliek pieejami ikvienam, kam jau ir to tiešā saite. Ja attēls
        jāpadara pilnībā nepieejams (piemēram, pēc kāda lūguma), izmantojiet
        &quot;Dzēst&quot;.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="rounded bg-paper px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-gray-200"
          >
            + Jauns albums
          </button>
        ) : (
          <div className="w-full max-w-lg rounded border border-gray-700 bg-gray-800/50 p-5">
            <h2 className="mb-4 text-base font-semibold text-paper">Jauns albums</h2>
            <CreateAlbumForm onCancel={() => setShowForm(false)} />
          </div>
        )}

        {!showForm && expiredAlbums.length > 0 && (
          <button
            onClick={handleDeleteExpired}
            disabled={pendingCleanup}
            className="rounded border border-amber-800/60 px-4 py-2.5 text-sm text-amber-400 transition hover:border-amber-600 disabled:opacity-50"
          >
            {pendingCleanup
              ? 'Dzēš…'
              : `Dzēst novecojušos albumus (${expiredAlbums.length})`}
          </button>
        )}
      </div>

      {cleanupError && (
        <p role="alert" className="rounded bg-red-900/40 px-4 py-2 text-sm text-red-300">
          {cleanupError}
        </p>
      )}

      {visibleAlbums.length === 0 ? (
        <p className="text-gray-400">
          Nav neviena albuma. Izveidojiet pirmo albumu augstāk.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
