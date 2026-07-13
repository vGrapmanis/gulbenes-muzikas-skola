'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

type NavChild = { label: string; href: string };
type NavItem =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: NavChild[] };

const NAV: NavItem[] = [
  {
    label: 'PAR SKOLU',
    children: [
      { label: 'Vēsture', href: '/par-skolu' },
      { label: 'Absolventi', href: '/par-skolu#absolventi' },
    ],
  },
  { label: 'JAUNUMI', href: '/jaunumi' },
  { label: 'SASNIEGUMI', href: '/sasniegumi' },
  { label: 'GALERIJA', href: '/galerija' },
  { label: 'UZŅEMŠANA', href: '/uznemsana' },
  { label: 'DOKUMENTI', href: '/dokumenti' },
  { label: 'KONTAKTI', href: '/kontakti' },
];

function DropdownItem({
  item,
}: {
  item: { label: string; children: { label: string; href: string }[] };
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1 text-xs font-bold tracking-widest text-paper uppercase hover:text-gray-300 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 min-w-[160px] bg-gray-900 border border-gray-700 py-1 z-50">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block px-4 py-2 text-sm text-paper hover:bg-gray-700 transition-colors"
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
          {NAV.map((item) =>
            item.children ? (
              <DropdownItem
                key={item.label}
                item={{ label: item.label, children: item.children }}
              />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-bold tracking-widest text-paper uppercase hover:text-gray-300 transition-colors"
              >
                {item.label}
              </Link>
            ),
          )}
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
          {NAV.flatMap((item) =>
            item.children
              ? [
                  <p key={item.label} className="px-2 pt-3 pb-1 text-xs font-bold tracking-widest text-gray-500 uppercase">
                    {item.label}
                  </p>,
                  ...item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-paper hover:bg-gray-700 rounded transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  )),
                ]
              : [
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-2 py-2 text-xs font-bold tracking-widest text-paper uppercase hover:text-gray-300 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>,
                ],
          )}
        </nav>
      )}
    </header>
  );
}
