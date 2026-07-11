import Image from 'next/image';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Sākumlapa', href: '/' },
  { label: 'Vēsture', href: '/par-skolu' },
  { label: 'Absolventi', href: '/par-skolu#absolventi' },
  { label: 'Jaunumi', href: '/jaunumi' },
  { label: 'Sasniegumi', href: '/sasniegumi' },
  { label: 'Galerija', href: '/galerija' },
  { label: 'Uzņemšana', href: '/uznemsana' },
  { label: 'Dokumenti', href: '/dokumenti' },
  { label: 'Kontakti', href: '/kontakti' },
];

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-black text-paper border-t border-gray-900">
      {/* Main footer body */}
      <div className="max-w-container mx-auto px-4 md:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

        {/* Column 1 — logo + identity */}
        <div className="flex flex-col gap-5">
          <Link href="/" aria-label="Gulbenes Mūzikas Skola — sākumlapa">
            <Image
              src="/brand/logo-horizontal-light.png"
              alt="Gulbenes Mūzikas Skola"
              width={172}
              height={44}
              className="h-10 w-auto"
            />
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[22ch]">
            Profesionālās ievirzes mūzikas izglītības iestāde Gulbenē kopš 1959. gada.
          </p>
          <p className="text-xs text-gray-700 leading-relaxed">
            Dibinātājs un finansētājs:<br />
            Gulbenes novada pašvaldība
          </p>
        </div>

        {/* Column 2 — navigation */}
        <nav aria-label="Kājenes navigācija">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">
            Navigācija
          </h2>
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-paper transition-colors focus-visible:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Column 3 — contact */}
        <address className="not-italic flex flex-col gap-4 text-sm">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500">
            Kontakti
          </h2>

          <div className="flex flex-col gap-1 text-gray-300 leading-relaxed">
            <span>O. Kalpaka iela 43</span>
            <span>Gulbene, LV-4401</span>
            <span>Latvija</span>
          </div>

          <a
            href="tel:+37164471659"
            className="text-gray-300 hover:text-paper transition-colors focus-visible:underline"
          >
            +371 64471659
          </a>

          {/* Email is managed via the Kontakti page CMS entry */}
        </address>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-900">
        <div className="max-w-container mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-700">
          <p>
            &copy; {YEAR} Gulbenes Mūzikas Skola. Visas tiesības aizsargātas.
          </p>
          <nav aria-label="Juridiskā informācija" className="flex items-center gap-4">
            <Link
              href="/pieejamiba"
              className="hover:text-gray-500 transition-colors focus-visible:underline"
            >
              Pieejamības paziņojums
            </Link>
            <Link
              href="/privatuma-politika"
              className="hover:text-gray-500 transition-colors focus-visible:underline"
            >
              Privātuma politika
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
