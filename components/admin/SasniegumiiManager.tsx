'use client';

import { useRef, useState, useTransition } from 'react';
import type { Achievement } from '@/lib/types';
import { mediaUrl } from '@/lib/media-url';
import { EXPIRY_YEARS, isContentExpired } from '@/lib/content-expiry';
import {
  createAchievementAction,
  updateAchievementAction,
  deleteAchievementAction,
  toggleAchievementPublishAction,
  deleteExpiredAchievementsAction,
} from '@/app/admin/(protected)/sasniegumi/actions';

// ── Create form ───────────────────────────────────────────────────────────────

function CreateForm({ onCancel }: { onCancel: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const image = fd.get('image') as File | null;
    const imageAlt = (fd.get('image_alt') as string | null)?.trim();
    if (image && image.size > 0 && !imageAlt) {
      setError('Alt teksts ir obligāts, ja ir pievienota bilde.');
      return;
    }
    startTransition(async () => {
      const result = await createAchievementAction(fd);
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
          Nosaukums <span aria-hidden="true" className="text-red-400">*</span>
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
          Datums
        </label>
        <input
          id="new-event_date"
          name="event_date"
          type="date"
          className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="new-description" className="block text-sm font-medium text-gray-300">
          Par sasniegumu
        </label>
        <textarea
          id="new-description"
          name="description"
          rows={3}
          className="w-full resize-y rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="new-teacher_note" className="block text-sm font-medium text-gray-300">
          Pateicība pedagogiem
        </label>
        <textarea
          id="new-teacher_note"
          name="teacher_note"
          rows={2}
          className="w-full resize-y rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="new-image" className="block text-sm font-medium text-gray-300">
          Foto <span className="ml-1 text-xs text-gray-500">(JPEG/PNG/WebP, maks. 8 MB)</span>
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
          Alt teksts{' '}
          <span className="text-xs text-gray-500">
            (aprakstiet attēlu — tiks lasīts ekrāna lasītājiem; obligāts, ja ir bilde)
          </span>
        </label>
        <input
          id="new-image_alt"
          name="image_alt"
          type="text"
          placeholder="Piem. Skolniece saņem diplomu konkursā"
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper placeholder-gray-600 focus:border-gray-400 focus:outline-none"
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

function EditForm({ item, onCancel }: { item: Achievement; onCancel: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const image = fd.get('image') as File | null;
    const imageAlt = (fd.get('image_alt') as string | null)?.trim();
    const hasImage = (image && image.size > 0) || !!item.image_key;
    if (hasImage && !imageAlt) {
      setError('Alt teksts ir obligāts, ja ir pievienota bilde.');
      return;
    }
    startTransition(async () => {
      const result = await updateAchievementAction(item.id, fd, item.image_key);
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
        <label className="block text-sm font-medium text-gray-300">Datums</label>
        <input
          name="event_date"
          type="date"
          defaultValue={item.event_date ?? ''}
          className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">Par sasniegumu</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={item.description ?? ''}
          className="w-full resize-y rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">Pateicība pedagogiem</label>
        <textarea
          name="teacher_note"
          rows={2}
          defaultValue={item.teacher_note ?? ''}
          className="w-full resize-y rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">
          Foto{' '}
          <span className="text-xs text-gray-500">(atstājiet tukšu, lai saglabātu esošo)</span>
        </label>
        {item.image_key && (
          <img
            src={mediaUrl(item.image_key)}
            alt={item.image_alt ?? ''}
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
        <label className="block text-sm font-medium text-gray-300">
          Alt teksts{' '}
          <span className="text-xs text-gray-500">
            (aprakstiet attēlu — tiks lasīts ekrāna lasītājiem; obligāts, ja ir bilde)
          </span>
        </label>
        <input
          name="image_alt"
          type="text"
          defaultValue={item.image_alt ?? ''}
          placeholder="Piem. Skolniece saņem diplomu konkursā"
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper placeholder-gray-600 focus:border-gray-400 focus:outline-none"
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

// ── Achievement row ───────────────────────────────────────────────────────────

function AchievementRow({ item }: { item: Achievement }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [gone, setGone] = useState(false);

  function handleDelete() {
    if (!confirm(`Dzēst sasniegumu "${item.title}"?`)) return;
    startTransition(async () => {
      const result = await deleteAchievementAction(item.id, item.image_key);
      if (!result.error) setGone(true);
    });
  }

  function handleTogglePublish() {
    startTransition(async () => {
      await toggleAchievementPublishAction(item.id, !item.published);
    });
  }

  if (gone) return null;

  return (
    <li className="rounded border border-gray-700 bg-gray-800/40">
      <div className="flex flex-wrap items-start gap-4 p-4">
        {item.image_key && (
          <img
            src={mediaUrl(item.image_key)}
            alt={item.image_alt ?? ''}
            className="h-16 w-16 shrink-0 rounded object-cover"
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
            {item.published && isContentExpired(item) && (
              <span className="rounded bg-amber-900/60 px-2 py-0.5 text-xs font-medium text-amber-300">
                Vecāks par {EXPIRY_YEARS} gadiem
              </span>
            )}
          </div>
          {item.event_date && (
            <p className="mt-0.5 text-sm text-gray-400">{item.event_date}</p>
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

export default function SasniegumiiManager({ items }: { items: Achievement[] }) {
  const [showForm, setShowForm] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [pendingCleanup, startCleanupTransition] = useTransition();
  const [cleanupError, setCleanupError] = useState<string | null>(null);

  const visibleItems = items.filter((item) => !removedIds.has(item.id));
  const expiredItems = visibleItems.filter((item) => item.published && isContentExpired(item));

  const sorted = [...visibleItems].sort(
    (a, b) =>
      a.display_order - b.display_order ||
      (b.event_date ?? '').localeCompare(a.event_date ?? '')
  );

  function handleDeleteExpired() {
    if (
      !confirm(
        `Dzēst ${expiredItems.length} novecojušus ierakstus (vecāki par ${EXPIRY_YEARS} gadiem)? Šo darbību nevar atsaukt.`
      )
    )
      return;
    setCleanupError(null);
    startCleanupTransition(async () => {
      const result = await deleteExpiredAchievementsAction();
      if (result.error) setCleanupError(result.error);
      else setRemovedIds(new Set(expiredItems.map((e) => e.id)));
    });
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-400">
        &quot;Paslēpt&quot; noņem ierakstu no publiskās vietnes, bet attēls paliek
        pieejams ikvienam, kam jau ir tā tiešā saite. Ja attēls jāpadara
        pilnībā nepieejams (piemēram, pēc kāda lūguma), izmantojiet &quot;Dzēst&quot;.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="rounded bg-paper px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-gray-200"
          >
            + Pievienot sasniegumu
          </button>
        ) : (
          <div className="w-full rounded border border-gray-700 bg-gray-800/50 p-5">
            <h2 className="mb-5 text-base font-semibold text-paper">Jauns sasniegums</h2>
            <CreateForm onCancel={() => setShowForm(false)} />
          </div>
        )}

        {!showForm && expiredItems.length > 0 && (
          <button
            onClick={handleDeleteExpired}
            disabled={pendingCleanup}
            className="rounded border border-amber-800/60 px-4 py-2.5 text-sm text-amber-400 transition hover:border-amber-600 disabled:opacity-50"
          >
            {pendingCleanup
              ? 'Dzēš…'
              : `Dzēst novecojušos ierakstus (${expiredItems.length})`}
          </button>
        )}
      </div>

      {cleanupError && (
        <p role="alert" className="rounded bg-red-900/40 px-4 py-2 text-sm text-red-300">
          {cleanupError}
        </p>
      )}

      {visibleItems.length === 0 ? (
        <p className="text-gray-400">Nav neviena sasnieguma. Pievienojiet pirmo augstāk.</p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((item) => (
            <AchievementRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
