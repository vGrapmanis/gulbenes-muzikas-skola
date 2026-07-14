'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/admin/actions';

const LINKS = [
  { label: 'Vadības panelis', href: '/admin' },
  { label: 'Absolventi',      href: '/admin/absolventi' },
  { label: 'Jaunumi',         href: '/admin/jaunumi' },
  { label: 'Sasniegumi',      href: '/admin/sasniegumi' },
  { label: 'Galerija',        href: '/admin/galerija' },
  { label: 'Dokumenti',       href: '/admin/dokumenti' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex flex-col h-full bg-gray-900 border-r border-gray-800 w-56 shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-800">
        <p className="font-heading font-bold text-paper text-xs tracking-widest uppercase leading-tight">
          GMS
        </p>
        <p className="text-gray-600 text-xs mt-0.5">Administrācija</p>
      </div>

      {/* Nav links */}
      <nav aria-label="Administrācijas navigācija" className="flex-1 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-0.5 px-2">
          {LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm transition-colors
                    ${active
                      ? 'bg-gray-700 text-paper font-medium'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-paper'
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-800">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-paper hover:bg-gray-800 rounded-sm transition-colors"
          >
            Iziet
          </button>
        </form>
      </div>
    </aside>
  );
}
