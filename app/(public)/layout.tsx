import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Skip-to-content — WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-paper focus:text-ink focus:font-bold focus:text-sm focus:rounded focus:shadow-lg"
      >
        Pāriet uz galveno saturu
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
