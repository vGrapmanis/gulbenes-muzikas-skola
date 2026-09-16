'use client';

import { useRef, useState, useTransition } from 'react';
import type { ProgramDocument, ProgramDocumentType } from '@/lib/types';
import { PROGRAM_DOCUMENT_TYPES } from '@/lib/types';
import { PROGRAMS } from '@/lib/programs';
import {
  uploadInstrumentDocumentAction,
  deleteInstrumentDocumentAction,
} from '@/app/admin/(protected)/uznemsana/actions';

// ── Single document slot ─────────────────────────────────────────────────────

function DocumentSlot({
  instrumentName,
  docType,
  label,
  existing,
}: {
  instrumentName: string;
  docType: ProgramDocumentType;
  label: string;
  existing: ProgramDocument | undefined;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await uploadInstrumentDocumentAction(instrumentName, docType, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setShowUpload(false);
        formRef.current?.reset();
      }
    });
  }

  function handleDelete() {
    if (!existing) return;
    if (!confirm(`Dzēst dokumentu "${label}" instrumentam "${instrumentName}"?`)) return;
    startTransition(async () => {
      await deleteInstrumentDocumentAction(existing.id, existing.file_key);
    });
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-300">{label}</p>

      {existing ? (
        <div className="flex items-center gap-3 rounded border border-gray-700 bg-gray-800/50 px-3 py-2">
          <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <span className="flex-1 text-sm text-paper truncate">{label}</span>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowUpload((v) => !v)}
              disabled={pending}
              className="rounded border border-gray-600 px-2 py-1 text-xs text-gray-300 transition hover:border-gray-400 disabled:opacity-50"
            >
              Mainīt
            </button>
            <button
              onClick={handleDelete}
              disabled={pending}
              className="rounded border border-red-800/60 px-2 py-1 text-xs text-red-400 transition hover:border-red-600 disabled:opacity-50"
            >
              Dzēst
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 italic">Nav pievienots</span>
          <button
            onClick={() => setShowUpload((v) => !v)}
            disabled={pending}
            className="rounded border border-gray-600 px-2 py-1 text-xs text-gray-300 transition hover:border-gray-400 disabled:opacity-50"
          >
            + Pievienot
          </button>
        </div>
      )}

      {showUpload && (
        <form ref={formRef} onSubmit={handleUpload} className="space-y-3 rounded border border-gray-700 bg-gray-800/50 p-3">
          {error && (
            <p role="alert" className="rounded bg-red-900/40 px-3 py-1.5 text-xs text-red-300">
              {error}
            </p>
          )}
          <div className="space-y-1">
            <label className="block text-xs text-gray-400">
              PDF fails <span aria-hidden="true" className="text-red-400">*</span>
              <span className="ml-1 text-gray-500">(maks. 20 MB)</span>
            </label>
            <input
              name="file"
              type="file"
              accept="application/pdf,.pdf"
              required
              className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 file:mr-2 file:rounded file:border-0 file:bg-gray-700 file:px-2 file:py-0.5 file:text-xs file:text-paper focus:border-gray-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded bg-paper px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-gray-200 disabled:opacity-50"
            >
              {pending ? 'Augšupielādē…' : 'Augšupielādēt'}
            </button>
            <button
              type="button"
              onClick={() => { setShowUpload(false); setError(null); }}
              className="rounded px-3 py-1.5 text-xs text-gray-400 transition hover:text-paper"
            >
              Atcelt
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Instrument card ───────────────────────────────────────────────────────────

function InstrumentCard({
  name,
  docs,
}: {
  name: string;
  docs: ProgramDocument[];
}) {
  const byType = Object.fromEntries(docs.map((d) => [d.document_type, d]));

  return (
    <div className="rounded border border-gray-700 bg-gray-800/30 p-5 space-y-4">
      <h3 className="font-heading text-base font-semibold text-paper">{name}</h3>
      <div className="space-y-4">
        {PROGRAM_DOCUMENT_TYPES.map(({ key, label }) => (
          <DocumentSlot
            key={key}
            instrumentName={name}
            docType={key}
            label={label}
            existing={byType[key]}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main manager ─────────────────────────────────────────────────────────────

export default function UznemsanaManager({ documents }: { documents: ProgramDocument[] }) {
  const byInstrument = documents.reduce<Record<string, ProgramDocument[]>>((acc, doc) => {
    if (!acc[doc.instrument_name]) acc[doc.instrument_name] = [];
    acc[doc.instrument_name].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      {PROGRAMS.map((program) => (
        <section key={program.name} className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-paper border-b border-gray-700 pb-2">
            {program.name}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {program.instruments.map((instrument) => (
              <InstrumentCard
                key={instrument}
                name={instrument}
                docs={byInstrument[instrument] ?? []}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
