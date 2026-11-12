import Link from 'next/link';



const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-black text-paper border-t border-gray-900">

      {/* Bottom bar */}
      <div className="border-t border-gray-900">
        <div className="max-w-container mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-700">
          <p>
            &copy; {YEAR} Gulbenes Mūzikas Skola. Visas tiesības aizsargātas.
          </p>
          <nav aria-label="Juridiskā informācija" className="flex items-center gap-4">
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
