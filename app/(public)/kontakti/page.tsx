import type { Metadata } from 'next';
import MapEmbed from '@/components/MapEmbed';

export const metadata: Metadata = {
  title: 'Kontakti',
  description: 'Gulbenes Mūzikas skolas kontaktinformācija, adrese, tālruņi un rekvizīti.',
};

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-6 py-3 border-b border-gray-300 last:border-0">
      <dt className="text-scale-sm font-medium text-gray-700 uppercase tracking-wide sm:w-44 shrink-0">
        {label}
      </dt>
      <dd className="text-scale-base text-ink leading-body mt-1 sm:mt-0">{children}</dd>
    </div>
  );
}

export default function KontaktiPage() {
  return (
    <div className="max-w-container mx-auto px-4 md:px-6 py-16">
      <h1 className="font-heading text-scale-4xl font-bold text-ink leading-heading mb-12">
        Kontakti
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* ── Contact information ── */}
        <div className="space-y-10">
          {/* Basic contact */}
          <section aria-labelledby="contact-basic">
            <h2
              id="contact-basic"
              className="font-heading text-scale-xl font-bold text-ink mb-4 pb-2 border-b-2 border-ink"
            >
              Kontaktinformācija
            </h2>
            <dl>
              <ContactRow label="Adrese">
                <address className="not-italic">
                  O. Kalpaka iela 43
                  <br />
                  Gulbene, LV-4401
                </address>
              </ContactRow>
              <ContactRow label="Papildu telpas">
                <address className="not-italic space-y-1">
                  <span className="block">Vidus iela 7, Gulbene</span>
                  <span className="block">Ābeļu iela 2, Gulbene</span>
                </address>
              </ContactRow>
              <ContactRow label="Tālrunis">
                <a
                  href="tel:+37164471661"
                  className="block underline underline-offset-2 hover:text-gray-700 transition-colors"
                >
                  +371 64471661
                </a>
                <a
                  href="tel:+37125440582"
                  className="block underline underline-offset-2 hover:text-gray-700 transition-colors"
                >
                  +371 25440582
                </a>
              </ContactRow>
              <ContactRow label="E-pasts">
                <a
                  href="mailto:muz.skola@gulbene.edu.lv"
                  className="underline underline-offset-2 hover:text-gray-700 transition-colors break-all"
                >
                  muz.skola@gulbene.edu.lv
                </a>
              </ContactRow>
            </dl>
          </section>

          {/* Leadership */}
          <section aria-labelledby="contact-leadership">
            <h2
              id="contact-leadership"
              className="font-heading text-scale-xl font-bold text-ink mb-4 pb-2 border-b-2 border-ink"
            >
              Vadība
            </h2>
            <dl>
              <ContactRow label="Direktore">Ilona Matīsa</ContactRow>
              <ContactRow label="Direktores vietniece">Vēsma Kļaviņa</ContactRow>
            </dl>
          </section>

          {/* Bank requisites */}
          <section aria-labelledby="contact-requisites">
            <h2
              id="contact-requisites"
              className="font-heading text-scale-xl font-bold text-ink mb-4 pb-2 border-b-2 border-ink"
            >
              Rekvizīti
            </h2>
            <dl>
              <ContactRow label="Reģistrācijas Nr.">90009116327</ContactRow>
              <ContactRow label="SEB banka">
                <span className="block font-mono text-scale-sm">LV03UNLA0050014339919</span>
                <span className="text-scale-sm text-gray-700">UNLALV2X</span>
              </ContactRow>
              <ContactRow label="Citadele banka">
                <span className="block font-mono text-scale-sm">LV41PARX0012592250001</span>
                <span className="text-scale-sm text-gray-700">PARXLV22</span>
              </ContactRow>
              <ContactRow label="Swedbank">
                <span className="block font-mono text-scale-sm">LV52HABA0551026528581</span>
                <span className="text-scale-sm text-gray-700">HABALV22</span>
              </ContactRow>
            </dl>
            <p className="mt-4 text-scale-sm text-gray-700 leading-body">
              Maksājuma mērķis:{' '}
              <strong className="text-ink">MUZ-… Vecāku līdzfinansējums par mūzikas skolu </strong>.
            </p>
          </section>
        </div>

        {/* ── Map ── */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-scale-xl font-bold text-ink pb-2 border-b-2 border-ink">
            Atrašanās vieta
          </h2>
          <p className="text-scale-sm text-gray-700">O. Kalpaka iela 43, Gulbene, LV-4401</p>
          <MapEmbed />
          <p className="text-scale-sm text-gray-500">
            Karte tiek ielādēta no Google Maps (trešās puses pakalpojums).
          </p>
        </div>
      </div>
    </div>
  );
}
