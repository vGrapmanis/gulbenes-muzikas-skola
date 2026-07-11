import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Gulbenes Mūzikas Skola',
    template: '%s | Gulbenes Mūzikas Skola',
  },
  description:
    'Gulbenes Mūzikas Skola — profesionālās ievirzes izglītības iestāde Gulbenē.',
  metadataBase: new URL('https://gulbenesms.lv'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lv" className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-paper text-ink antialiased">
        {/* Skip-to-content — WCAG 2.4.1, visible on focus */}
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
      </body>
    </html>
  );
}
