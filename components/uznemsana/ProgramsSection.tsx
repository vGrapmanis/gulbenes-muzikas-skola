'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { mediaUrl } from '@/lib/media-url';
import { PROGRAM_DOCUMENT_TYPES } from '@/lib/types';
import type { ProgramDocument } from '@/lib/types';
import type { Program } from '@/lib/programs';

// ── Document link (used inside the popup) ───────────────────────────────────

function PdfLink({ doc, label }: { doc: ProgramDocument | undefined; label: string }) {
  if (!doc) {
    return (
      <span className="flex items-center gap-2 text-scale-sm text-gray-400">
        <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
        <span className="italic">{label} — nav pievienots</span>
      </span>
    );
  }

  return (
    <a
      href={mediaUrl(doc.file_key)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-md border border-gray-200 px-3 py-2.5 text-scale-sm text-ink hover:border-gray-400 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-ink" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
      <span className="flex-1 font-medium">{label}</span>
      <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
      </svg>
    </a>
  );
}

// ── Instrument popup ─────────────────────────────────────────────────────────

function InstrumentModal({
  instrument,
  duration,
  details,
  docs,
  onClose,
}: {
  instrument: string;
  duration?: string;
  details?: string;
  docs: ProgramDocument[];
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const byType = Object.fromEntries(docs.map((d) => [d.document_type, d]));

  useEffect(() => {
    closeRef.current?.focus();
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="instrument-modal-heading"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Aizvērt"
          className="absolute top-3 right-3 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <h3
          id="instrument-modal-heading"
          className="font-heading font-bold text-scale-lg text-ink leading-heading pr-8 mb-4"
        >
          {instrument}
        </h3>

        {(duration || details) && (
          <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-gray-200">
            {duration && (
              <p className="font-heading font-bold text-scale-sm text-ink leading-heading">
                {duration}
              </p>
            )}
            {details && (
              <p className="text-scale-sm text-gray-600 leading-body">{details}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {PROGRAM_DOCUMENT_TYPES.map(({ key, label }) => (
            <PdfLink key={key} doc={byType[key]} label={label} />
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Program card ──────────────────────────────────────────────────────────────

function ProgramCard({
  program,
  onSelectInstrument,
}: {
  program: Program;
  onSelectInstrument: (instrument: string) => void;
}) {
  const { name, instruments } = program;

  return (
    <article className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col gap-4">
      <h3 className="font-heading font-bold text-scale-lg text-ink leading-heading">{name}</h3>
      <ul className="flex flex-wrap gap-2" aria-label="Instrumenti">
        {instruments.map((instr) => (
          <li key={instr}>
            <button
              type="button"
              onClick={() => onSelectInstrument(instr)}
              className="text-scale-sm text-ink bg-gray-100 rounded-full px-3 py-1 leading-none hover:bg-gray-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              {instr}
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function ProgramsSection({
  programs,
  docsByInstrument,
}: {
  programs: Program[];
  docsByInstrument: Record<string, ProgramDocument[]>;
}) {
  const [selected, setSelected] = useState<{ program: Program; instrument: string } | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {programs.map((prog) => (
          <ProgramCard
            key={prog.name}
            program={prog}
            onSelectInstrument={(instrument) => setSelected({ program: prog, instrument })}
          />
        ))}
      </div>

      {selected && (
        <InstrumentModal
          instrument={selected.instrument}
          duration={selected.program.duration}
          details={selected.program.details}
          docs={docsByInstrument[selected.instrument] ?? []}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
