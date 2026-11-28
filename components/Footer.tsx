import Link from 'next/link';



const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-black text-paper border-t border-gray-900">

      {/* Bottom bar */}
      <div className="border-t border-gray-900">
        <div className="max-w-container mx-auto px-4 md:px-6 py-5 grid grid-cols-1 sm:grid-cols-3 items-center gap-3 text-xs text-gray-700">
          <p className="sm:justify-self-start">
            &copy; {YEAR} Gulbenes Mūzikas Skola. Visas tiesības aizsargātas.
          </p>
          <nav aria-label="Juridiskā informācija" className="sm:justify-self-center">
            <Link
              href="/privatuma-politika"
              className="hover:text-gray-500 transition-colors focus-visible:underline"
            >
              Privātuma politika
            </Link>
          </nav>
          <p lang="en" className="sm:justify-self-end">
            Built by ITVGSolutions.
          </p>
        </div>
      </div>
    </footer>
  );
}
