'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'gms_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Sīkdatņu piekrišana"
      className="fixed bottom-0 inset-x-0 z-50 bg-gray-900 border-t border-gray-700 px-4 py-4 sm:px-6"
    >
      <div className="max-w-container mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
          Šī vietne izmanto nepieciešamo sīkdatni, lai saglabātu jūsu izvēli.
          Vairāk informācijas:{' '}
          <Link
            href="/privatuma-politika"
            className="underline underline-offset-2 hover:text-paper transition-colors"
          >
            Privātuma politika
          </Link>
          .
        </p>
        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={decline}
            className="bg-transparent text-paper font-bold text-sm px-6 py-2.5 rounded-sm border border-gray-500 hover:bg-gray-800 focus-visible:ring-2 ring-focus ring-offset-2 ring-offset-gray-900 transition-colors"
          >
            Noraidīt
          </button>
          <button
            onClick={accept}
            className="bg-paper text-ink font-bold text-sm px-6 py-2.5 rounded-sm hover:bg-gray-300 focus-visible:ring-2 ring-focus ring-offset-2 ring-offset-gray-900 transition-colors"
          >
            Piekrist
          </button>
        </div>
      </div>
    </div>
  );
}
