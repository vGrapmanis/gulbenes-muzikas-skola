import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lv" className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
