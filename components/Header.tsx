'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const NAV = [
  { label: 'PAR SKOLU', href: '/par-skolu' },
  { label: 'JAUNUMI', href: '/jaunumi' },
  { label: 'SASNIEGUMI', href: '/sasniegumi' },
  { label: 'GALERIJA', href: '/galerija' },
  { label: 'UZŅEMŠANA', href: '/uznemsana' },
  { label: 'DOKUMENTI', href: '/dokumenti' },
  { label: 'KONTAKTI', href: '/kontakti' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-900">
      <div className="max-w-container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0 focus-visible:ring-2 ring-focus ring-offset-2 ring-offset-black rounded-sm">
          <Image
            src="/brand/logo-horizontal-light.png"
            alt="Gulbenes Mūzikas Skola"
            width={172}
            height={44}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Galvenā navigācija" className="hidden md:flex items-center gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-bold tracking-widest text-paper uppercase hover:text-gray-300 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.facebook.com/gulbene.lv"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Gulbenes Mūzikas skola Facebook profilā (atveras jaunā cilnē)"
            className="text-paper hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.878h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
            </svg>
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-paper p-2 -mr-2 focus-visible:ring-2 ring-focus rounded"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Aizvērt izvēlni' : 'Atvērt izvēlni'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobilā navigācija"
          className="md:hidden bg-gray-900 border-t border-gray-700 px-4 py-4 flex flex-col gap-1"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-2 py-2 text-xs font-bold tracking-widest text-paper uppercase hover:text-gray-300 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.facebook.com/gulbene.lv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2 py-2 text-xs font-bold tracking-widest text-paper uppercase hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.878h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
            </svg>
            Facebook
          </a>
        </nav>
      )}
    </header>
  );
}
