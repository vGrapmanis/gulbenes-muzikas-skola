'use client';

import { useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import type { GalleryAlbum, GalleryImage } from '@/lib/types';
import { mediaUrl } from '@/lib/media-url';
import {
  updateAlbumMetaAction,
  togglePublishAlbumAction,
  uploadImagesAction,
  deleteImageAction,
  setCoverAction,
} from '@/app/admin/(protected)/galerija/actions';

// ── Publish toggle ────────────────────────────────────────────────────────────

function PublishToggle({ album }: { album: GalleryAlbum }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex items-center gap-1.5 text-sm ${album.published ? 'text-green-400' : 'text-gray-400'}`}
      >
        <span
          className={`h-2 w-2 rounded-full ${album.published ? 'bg-green-500' : 'bg-gray-600'}`}
        />
        {album.published ? 'Publicēts' : 'Melnraksts'}
      </span>
      <button
        onClick={() =>
          startTransition(async () => {
            await togglePublishAlbumAction(album.id, !album.published);
          })
        }
        disabled={pending}
        className={`rounded border px-4 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
          album.published
            ? 'border-gray-600 text-gray-300 hover:border-gray-400'
            : 'border-green-800/60 text-green-400 hover:border-green-600'
        }`}
      >
        {pending ? '…' : album.published ? 'Paslēpt' : 'Publicēt'}
      </button>
    </div>
  );
}

// ── Meta form ─────────────────────────────────────────────────────────────────

function MetaForm({ album }: { album: GalleryAlbum }) {
  const [title, setTitle] = useState(album.title);
  const [description, setDescription] = useState(album.description ?? '');
  const [eventDate, setEventDate] = useState(album.event_date ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateAlbumMetaAction(album.id, {
        title,
        description: description || undefined,
        event_date: eventDate || undefined,
      });
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p role="alert" className="rounded bg-red-900/40 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="rounded bg-green-900/40 px-4 py-2 text-sm text-green-300">
          Saglabāts.
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="meta-title" className="block text-sm font-medium text-gray-300">
          Nosaukums <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <input
          id="meta-title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
          required
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="meta-desc" className="block text-sm font-medium text-gray-300">
          Apraksts
        </label>
        <textarea
          id="meta-desc"
          value={description}
          onChange={(e) => { setDescription(e.target.value); setSaved(false); }}
          rows={3}
          className="w-full resize-none rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="meta-date" className="block text-sm font-medium text-gray-300">
          Notikuma datums
        </label>
        <input
          id="meta-date"
          type="date"
          value={eventDate}
          onChange={(e) => { setEventDate(e.target.value); setSaved(false); }}
          className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-paper px-5 py-2 text-sm font-medium text-ink transition hover:bg-gray-200 disabled:opacity-50"
      >
        {pending ? 'Saglabā…' : 'Saglabāt'}
      </button>
    </form>
  );
}

// ── Upload form ───────────────────────────────────────────────────────────────

function UploadForm({ albumId }: { albumId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await uploadImagesAction(fd);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        formRef.current?.reset();
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 rounded border border-gray-700 bg-gray-800/50 p-5"
    >
      <h3 className="text-sm font-semibold text-paper">Pievienot fotoattēlus</h3>

      {error && (
        <p role="alert" className="rounded bg-red-900/40 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="rounded bg-green-900/40 px-4 py-2 text-sm text-green-300">
          Attēli veiksmīgi augšupielādēti.
        </p>
      )}

      <input type="hidden" name="album_id" value={albumId} />

      <div className="space-y-1">
        <label htmlFor="upload-files" className="block text-sm font-medium text-gray-300">
          Attēli <span aria-hidden="true" className="text-red-400">*</span>
          <span className="ml-2 text-xs text-gray-500">JPEG · PNG · WebP · maks. 10 MB katrs</span>
        </label>
        <input
          id="upload-files"
          name="files"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          required
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-gray-700 file:px-3 file:py-1 file:text-sm file:text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="upload-alt" className="block text-sm font-medium text-gray-300">
          Alt teksts{' '}
          <span className="text-xs text-gray-500">(apraksts visiem augšupielādētajiem attēliem)</span>
        </label>
        <input
          id="upload-alt"
          name="alt"
          type="text"
          placeholder="Piem. Skolēni Ziemassvētku koncertā"
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper placeholder-gray-600 focus:border-gray-400 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-paper px-5 py-2 text-sm font-medium text-ink transition hover:bg-gray-200 disabled:opacity-50"
      >
        {pending ? 'Augšupielādē…' : 'Augšupielādēt'}
      </button>
    </form>
  );
}

// ── Image card ────────────────────────────────────────────────────────────────

function ImageCard({
  image,
  albumId,
  isCover,
}: {
  image: GalleryImage;
  albumId: string;
  isCover: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [gone, setGone] = useState(false);

  function handleDelete() {
    if (!confirm('Dzēst šo attēlu?')) return;
    startTransition(async () => {
      const result = await deleteImageAction(image.id, image.image_key, albumId);
      if (!result.error) setGone(true);
    });
  }

  function handleSetCover() {
    startTransition(async () => {
      await setCoverAction(albumId, image.image_key);
    });
  }

  if (gone) return null;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded border ${
        isCover ? 'border-yellow-500' : 'border-gray-700'
      }`}
    >
      <div className="relative aspect-square bg-gray-900">
        <img
          src={mediaUrl(image.image_key)}
          alt={image.alt || ''}
          className="h-full w-full object-cover"
        />
        {isCover && (
          <span className="absolute top-1 left-1 rounded bg-yellow-500/90 px-1.5 py-0.5 text-xs font-semibold leading-none text-black">
            Vāks
          </span>
        )}
      </div>

      {image.caption && (
        <p className="truncate bg-gray-900 px-2 py-1 text-xs text-gray-400">{image.caption}</p>
      )}

      <div className="flex gap-1 bg-gray-900/80 p-1.5">
        {!isCover && (
          <button
            onClick={handleSetCover}
            disabled={pending}
            title="Iestatīt kā albuma vāku"
            className="flex-1 rounded border border-yellow-800/60 px-2 py-1 text-xs text-yellow-400 transition hover:border-yellow-600 disabled:opacity-50"
          >
            ★ Vāks
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={pending}
          title="Dzēst attēlu"
          className={`rounded border border-red-800/60 px-2 py-1 text-xs text-red-400 transition hover:border-red-600 disabled:opacity-50 ${isCover ? 'flex-1' : ''}`}
        >
          Dzēst
        </button>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function AlbumEditor({
  album,
  images,
}: {
  album: GalleryAlbum;
  images: GalleryImage[];
}) {
  const sorted = [...images].sort(
    (a, b) => a.display_order - b.display_order || a.created_at.localeCompare(b.created_at)
  );

  return (
    <div className="space-y-10">
      <Link
        href="/admin/galerija"
        className="inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gray-200"
      >
        ← Atpakaļ uz galeriju
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-paper">{album.title}</h1>
        <PublishToggle album={album} />
      </div>

      {/* Meta */}
      <section aria-labelledby="section-meta">
        <h2
          id="section-meta"
          className="mb-4 border-b border-gray-700 pb-2 text-base font-semibold text-paper"
        >
          Pamata informācija
        </h2>
        <div className="max-w-lg">
          <MetaForm album={album} />
        </div>
      </section>

      {/* Photos */}
      <section aria-labelledby="section-photos">
        <h2
          id="section-photos"
          className="mb-4 border-b border-gray-700 pb-2 text-base font-semibold text-paper"
        >
          Fotoattēli ({images.length})
        </h2>

        <div className="space-y-6">
          <UploadForm albumId={album.id} />

          {images.length === 0 ? (
            <p className="text-sm text-gray-400">
              Nav neviena attēla. Pievienojiet pirmos fotoattēlus augstāk.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {sorted.map((img) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  albumId={album.id}
                  isCover={album.cover_key === img.image_key}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
