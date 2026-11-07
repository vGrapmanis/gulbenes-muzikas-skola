'use client';

import { useRef, useState, useTransition } from 'react';
import type { NewsItem } from '@/lib/types';
import { mediaUrl } from '@/lib/media-url';
import {
  createNewsAction,
  updateNewsAction,
  deleteNewsAction,
  toggleNewsPublishAction,
} from '@/app/admin/(protected)/jaunumi/actions';

// ── Create form ───────────────────────────────────────────────────────────────

function CreateForm({ onCancel }: { onCancel: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createNewsAction(fd);
      if (result.error) setError(result.error);
      else onCancel();
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
        <label htmlFor="new-title" className="block text-sm font-medium text-gray-300">
          Nosaukums (tikai administrācijai){' '}
          <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <input
          id="new-title"
          name="title"
          type="text"
          required
          autoFocus
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="new-event_date" className="block text-sm font-medium text-gray-300">
          Pasākuma datums{' '}
          <span aria-hidden="true" className="text-red-400">*</span>
          <span className="ml-1 text-xs text-gray-500">(plakāts noņems nākamajā dienā pēc pasākuma)</span>
        </label>
        <input
          id="new-event_date"
          name="event_date"
          type="date"
          required
          className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="new-poster-landscape" className="block text-sm font-medium text-gray-300">
          Plakāts — ekrānam (ainavas){' '}
          <span aria-hidden="true" className="text-red-400">*</span>
          <span className="ml-1 text-xs text-gray-500">(JPEG/PNG/WebP, maks. 10 MB)</span>
        </label>
        <input
          id="new-poster-landscape"
          name="poster_landscape"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-gray-700 file:px-3 file:py-1 file:text-sm file:text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="new-poster-portrait" className="block text-sm font-medium text-gray-300">
          Plakāts — mobilajam (portreta){' '}
          <span aria-hidden="true" className="text-red-400">*</span>
          <span className="ml-1 text-xs text-gray-500">(JPEG/PNG/WebP, maks. 10 MB)</span>
        </label>
        <input
          id="new-poster-portrait"
          name="poster_portrait"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-gray-700 file:px-3 file:py-1 file:text-sm file:text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-paper px-5 py-2 text-sm font-medium text-ink transition hover:bg-gray-200 disabled:opacity-50"
        >
          {pending ? 'Saglabā…' : 'Pievienot'}
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

// ── Edit form ─────────────────────────────────────────────────────────────────

function EditForm({ item, onCancel }: { item: NewsItem; onCancel: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateNewsAction(
        item.id,
        fd,
        item.poster_key,
        item.poster_portrait_key,
      );
      if (result.error) setError(result.error);
      else onCancel();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      {error && (
        <p role="alert" className="rounded bg-red-900/40 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">
          Nosaukums (tikai administrācijai){' '}
          <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <input
          name="title"
          type="text"
          required
          defaultValue={item.title}
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">
          Pasākuma datums{' '}
          <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <input
          name="event_date"
          type="date"
          required
          defaultValue={item.event_date ?? ''}
          className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">
          Plakāts — ekrānam (ainavas){' '}
          <span className="text-xs text-gray-500">(atstājiet tukšu, lai saglabātu esošo)</span>
        </label>
        <img
          src={mediaUrl(item.poster_key)}
          alt=""
          className="mb-2 h-20 w-auto rounded border border-gray-700 object-cover"
        />
        <input
          name="poster_landscape"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-gray-700 file:px-3 file:py-1 file:text-sm file:text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">
          Plakāts — mobilajam (portreta){' '}
          <span className="text-xs text-gray-500">(atstājiet tukšu, lai saglabātu esošo)</span>
        </label>
        {item.poster_portrait_key && (
          <img
            src={mediaUrl(item.poster_portrait_key)}
            alt=""
            className="mb-2 h-20 w-auto rounded border border-gray-700 object-cover"
          />
        )}
        <input
          name="poster_portrait"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-gray-700 file:px-3 file:py-1 file:text-sm file:text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-paper px-5 py-2 text-sm font-medium text-ink transition hover:bg-gray-200 disabled:opacity-50"
        >
          {pending ? 'Saglabā…' : 'Saglabāt'}
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

// ── News row ──────────────────────────────────────────────────────────────────

function NewsRow({ item }: { item: NewsItem }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [gone, setGone] = useState(false);

  function handleDelete() {
    if (!confirm(`Dzēst pasākumu "${item.title}"?`)) return;
    startTransition(async () => {
      const result = await deleteNewsAction(item.id, item.poster_key, item.poster_portrait_key);
      if (!result.error) setGone(true);
    });
  }

  function handleTogglePublish() {
    startTransition(async () => {
      await toggleNewsPublishAction(item.id, !item.published);
    });
  }

  if (gone) return null;

  return (
    <li className="rounded border border-gray-700 bg-gray-800/40">
      <div className="flex flex-wrap items-start gap-4 p-4">
        <img
          src={mediaUrl(item.poster_key)}
          alt=""
          className="h-16 w-24 shrink-0 rounded object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-paper">{item.title}</p>
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                item.published
                  ? 'bg-green-800/80 text-green-300'
                  : 'bg-gray-700/80 text-gray-400'
              }`}
            >
              {item.published ? 'Publicēts' : 'Melnraksts'}
            </span>
          </div>
          {item.event_date && (
            <p className="mt-0.5 text-sm text-gray-400">Pasākums: {item.event_date}</p>
          )}
          {!item.poster_portrait_key && (
            <p className="mt-0.5 text-xs text-amber-400">Trūkst portreta plakāts</p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            onClick={() => setEditing((v) => !v)}
            disabled={pending}
            className="rounded border border-gray-600 px-3 py-1 text-xs text-gray-300 transition hover:border-gray-400 disabled:opacity-50"
          >
            {editing ? 'Aizvērt' : 'Rediģēt'}
          </button>
          <button
            onClick={handleTogglePublish}
            disabled={pending}
            className={`rounded border px-3 py-1 text-xs transition disabled:opacity-50 ${
              item.published
                ? 'border-gray-600 text-gray-300 hover:border-gray-400'
                : 'border-green-800/60 text-green-400 hover:border-green-600'
            }`}
          >
            {item.published ? 'Paslēpt' : 'Publicēt'}
          </button>
          <button
            onClick={handleDelete}
            disabled={pending}
            className="rounded border border-red-800/60 px-3 py-1 text-xs text-red-400 transition hover:border-red-600 disabled:opacity-50"
          >
            Dzēst
          </button>
        </div>
      </div>

      {editing && (
        <div className="border-t border-gray-700 px-4 pb-5">
          <EditForm item={item} onCancel={() => setEditing(false)} />
        </div>
      )}
    </li>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function JaunumiManager({ items }: { items: NewsItem[] }) {
  const [showForm, setShowForm] = useState(false);

  const sorted = [...items].sort((a, b) => {
    if (a.event_date && b.event_date) return a.event_date.localeCompare(b.event_date);
    if (a.event_date) return -1;
    if (b.event_date) return 1;
    return b.created_at.localeCompare(a.created_at);
  });

  return (
    <div className="space-y-8">
      <div>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="rounded bg-paper px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-gray-200"
          >
            + Pievienot pasākumu
          </button>
        ) : (
          <div className="rounded border border-gray-700 bg-gray-800/50 p-5">
            <h2 className="mb-5 text-base font-semibold text-paper">Jauns pasākums</h2>
            <CreateForm onCancel={() => setShowForm(false)} />
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400">Nav neviena pasākuma. Pievienojiet pirmo augstāk.</p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((item) => (
            <NewsRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
