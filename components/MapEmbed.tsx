'use client';

import { useState } from 'react';

export default function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  const src =
    'https://maps.google.com/maps?q=O.Kalpaka+iela+43,+Gulbene,+LV-4401,+Latvia&output=embed&z=16';

  return (
    <div className="relative w-full h-80 md:h-96 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
      {!loaded ? (
        <button
          onClick={() => setLoaded(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 w-full h-full text-ink hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          aria-label="Ielādēt Google Maps karti"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="text-scale-sm font-medium text-gray-700">
            Noklikšķiniet, lai ielādētu karti
          </span>
          <span className="text-scale-sm text-gray-500">
            (Google Maps — trešās puses pakalpojums)
          </span>
        </button>
      ) : (
        <iframe
          src={src}
          title="Gulbenes Mūzikas skolas atrašanās vieta kartē"
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  );
}
