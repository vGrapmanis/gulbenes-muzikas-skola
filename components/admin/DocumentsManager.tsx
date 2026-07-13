'use client';

import { useRef, useState, useTransition } from 'react';
import type { Document } from '@/lib/types';
import {
  uploadDocumentAction,
  deleteDocumentAction,
} from '@/app/admin/(protected)/dokumenti/actions';

// ── Upload form ──────────────────────────────────────────────────────────────

function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await uploadDocumentAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        formRef.current?.reset();
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
      {success && (
        <p role="status" className="rounded bg-green-900/40 px-4 py-2 text-sm text-green-300">
          Dokuments veiksmīgi augšupielādēts.
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="doc-title" className="block text-sm font-medium text-gray-300">
          Nosaukums <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <input
          id="doc-title"
          name="title"
          required
          type="text"
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-paper focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="doc-file" className="block text-sm font-medium text-gray-300">
          PDF fails <span aria-hidden="true" className="text-red-400">*</span>
          <span className="ml-2 text-xs text-gray-500">(maks. 20 MB)</span>
        </label>
        <input
          id="doc-file"
          name="file"
          type="file"
          accept="application/pdf,.pdf"
          required
          className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-gray-700 file:px-3 file:py-1 file:text-sm file:text-paper focus:border-gray-400 focus:outline-none"
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

// ── Document row ─────────────────────────────────────────────────────────────

function DocumentRow({ doc }: { doc: Document }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Dzēst "${doc.title}"?`)) return;
    startTransition(async () => {
      await deleteDocumentAction(doc.id, doc.file_key);
    });
  }

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded px-2 py-3 odd:bg-gray-800/30">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-paper">{doc.title}</p>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          onClick={handleDelete}
          disabled={pending}
          className="rounded border border-red-800/60 px-3 py-1 text-xs text-red-400 transition hover:border-red-600 disabled:opacity-50"
        >
          Dzēst
        </button>
      </div>
    </li>
  );
}

// ── Main manager ─────────────────────────────────────────────────────────────

export default function DocumentsManager({ documents }: { documents: Document[] }) {
  const [showForm, setShowForm] = useState(false);

  const sorted = [...documents].sort(
    (a, b) => a.display_order - b.display_order || a.title.localeCompare(b.title, 'lv')
  );

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded bg-paper px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-gray-200"
        >
          {showForm ? '✕ Aizvērt' : '+ Pievienot dokumentu'}
        </button>
        {showForm && (
          <div className="mt-4 rounded border border-gray-700 bg-gray-800/50 p-5">
            <h2 className="mb-4 text-base font-semibold text-paper">Jauns dokuments</h2>
            <UploadForm />
          </div>
        )}
      </div>

      {documents.length === 0 ? (
        <p className="text-gray-400">Nav neviena dokumenta. Pievienojiet pirmo dokumentu augstāk.</p>
      ) : (
        <ul className="space-y-0.5">
          {sorted.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} />
          ))}
        </ul>
      )}
    </div>
  );
}
