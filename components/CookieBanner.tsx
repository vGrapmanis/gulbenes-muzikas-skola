'use client';

import { useState, useEffect } from 'react';

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

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Sīkdatņu piekrišana"
      className="fixed bottom-0 inset-x-0 z-50 bg-gray-900 border-t border-gray-700 px-4 py-4 sm:px-6"
    >
      <div className="max-w-container mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
          Šī vietne izmanto sīkdatnes, lai nodrošinātu labāku lietošanas pieredzi.
          Turpinot pārlūkošanu, jūs piekrītat sīkdatņu izmantošanai.
        </p>
        <button
          onClick={accept}
          className="shrink-0 bg-paper text-ink font-bold text-sm px-6 py-2.5 rounded-sm hover:bg-gray-300 focus-visible:ring-2 ring-focus ring-offset-2 ring-offset-gray-900 transition-colors"
        >
          Piekrist
        </button>
      </div>
    </div>
  );
}
