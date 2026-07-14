'use client';

import { useState, useTransition } from 'react';
import type { GraduateClass } from '@/lib/types';
import { mediaUrl } from '@/lib/media-url';
import {
  createGraduateClassAction,
  updateGraduateClassAction,
  deleteGraduateClassAction,
  toggleGraduateClassPublishAction,
} from '@/app/admin/(protected)/absolventi/actions';

// ── Create form ───────────────────────────────────────────────────────────────

function CreateForm({ onCancel }: { onCancel: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createGraduateClassAction(fd);
      if (result.error) setError(result.error);
      else onCancel();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p role="alert" className="rounded bg-red-900/40 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="new-title" className="block text-sm font-medium text-gray-300">
          Nosaukums <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <input
          id="new-title"
          name="title"
          type="text"
          required
          autoFocus
          placeholder="piem., 62.izlaidums"
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper placeholder:text-gray-600 focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="new-image" className="block text-sm font-medium text-gray-300">
          Foto <span className="ml-1 text-xs text-gray-500">(horizontāls, JPEG/PNG/WebP, maks. 8 MB)</span>
        </label>
        <input
          id="new-image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-gray-700 file:px-3 file:py-1 file:text-sm file:text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="new-image_alt" className="block text-sm font-medium text-gray-300">
          Attēla apraksts <span className="ml-1 text-xs text-gray-500">(pieejamībai)</span>
        </label>
        <input
          id="new-image_alt"
          name="image_alt"
          type="text"
          placeholder="piem., 62.izlaiduma absolventi"
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper placeholder:text-gray-600 focus:border-gray-400 focus:outline-none"
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

function EditForm({ item, onCancel }: { item: GraduateClass; onCancel: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateGraduateClassAction(item.id, fd, item.image_key);
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
          Nosaukums <span aria-hidden="true" className="text-red-400">*</span>
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
          Foto <span className="text-xs text-gray-500">(atstājiet tukšu, lai saglabātu esošo)</span>
        </label>
        {item.image_key && (
          <img
            src={mediaUrl(item.image_key)}
            alt={item.image_alt}
            className="mb-2 h-24 w-auto rounded border border-gray-700 object-cover"
          />
        )}
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-gray-700 file:px-3 file:py-1 file:text-sm file:text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">Attēla apraksts</label>
        <input
          name="image_alt"
          type="text"
          defaultValue={item.image_alt}
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
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

// ── Row ───────────────────────────────────────────────────────────────────────

function GraduateClassRow({ item }: { item: GraduateClass }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [gone, setGone] = useState(false);

  function handleDelete() {
    if (!confirm(`Dzēst izlaidumu "${item.title}"?`)) return;
    startTransition(async () => {
      const result = await deleteGraduateClassAction(item.id, item.image_key);
      if (!result.error) setGone(true);
    });
  }

  function handleTogglePublish() {
    startTransition(async () => {
      await toggleGraduateClassPublishAction(item.id, !item.published);
    });
  }

  if (gone) return null;

  return (
    <li className="rounded border border-gray-700 bg-gray-800/40">
      <div className="flex flex-wrap items-start gap-4 p-4">
        {item.image_key && (
          <img
            src={mediaUrl(item.image_key)}
            alt={item.image_alt}
            className="h-16 w-28 shrink-0 rounded object-cover"
          />
        )}

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

export default function AbsolventiManager({ items }: { items: GraduateClass[] }) {
  const [showForm, setShowForm] = useState(false);

  const sorted = [...items].sort((a, b) => a.display_order - b.display_order || b.title.localeCompare(a.title));

  return (
    <div className="space-y-8">
      <div>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="rounded bg-paper px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-gray-200"
          >
            + Pievienot izlaidumu
          </button>
        ) : (
          <div className="rounded border border-gray-700 bg-gray-800/50 p-5">
            <h2 className="mb-5 text-base font-semibold text-paper">Jauns izlaidums</h2>
            <CreateForm onCancel={() => setShowForm(false)} />
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400">Nav neviena izlaiduma. Pievienojiet pirmo augstāk.</p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((item) => (
            <GraduateClassRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
