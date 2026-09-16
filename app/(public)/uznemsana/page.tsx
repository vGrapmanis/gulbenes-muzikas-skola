import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PROGRAMS } from '@/lib/programs';
import ProgramsSection from '@/components/uznemsana/ProgramsSection';
import type { ProgramDocument } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Uzņemšana',
  description:
    'Gulbenes Mūzikas skola aicina topošos audzēkņus apgūt mūzikas instrumenta spēli. Uzzini par izglītības programmām un piesakies mācībām.',
};

export default async function UznemsanaPage() {
  const supabase = await createClient();
  const { data: programDocs } = await supabase
    .from('program_documents')
    .select('*');

  const docsByInstrument = (programDocs ?? []).reduce<Record<string, ProgramDocument[]>>(
    (acc, doc) => {
      if (!acc[doc.instrument_name]) acc[doc.instrument_name] = [];
      acc[doc.instrument_name].push(doc);
      return acc;
    },
    {}
  );

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="bg-paper border-b border-gray-300"
        aria-labelledby="uznemsana-heading"
      >
        <div className="max-w-container mx-auto px-4 md:px-6 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-6">
            <h1
              id="uznemsana-heading"
              className="font-heading font-bold text-ink leading-heading text-[3.25rem] md:text-[4rem] lg:text-[5rem]"
            >
              Uzņemšana
            </h1>
            <p className="text-scale-md text-gray-700 leading-body max-w-sm">
              Gulbenes Mūzikas skola aicina topošos audzēkņus apgūt mūzikas instrumenta spēli.
              Izvēlies izglītības programmu un piesakies mācībām.
            </p>
            <Link
              href="/kontakti"
              className="inline-flex items-center gap-2 bg-ink text-paper font-heading font-bold text-scale-base px-6 py-3 rounded-full w-fit hover:bg-gray-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Sazināties
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="flex items-center justify-center md:justify-end" aria-hidden="true">
            <Image
              src="/brand/piano-keys-fan.png"
              alt=""
              width={320}
              height={400}
              className="w-56 md:w-72 lg:w-80 h-auto select-none"
            />
          </div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section className="max-w-container mx-auto px-4 md:px-6 py-16" aria-labelledby="programs-heading">
        <div className="flex items-baseline justify-between mb-8">
          <h2
            id="programs-heading"
            className="font-heading font-bold text-scale-2xl text-ink leading-heading"
          >
            Izglītības programmas
          </h2>
          <span className="text-scale-sm text-gray-500 hidden sm:block">Ko iespējams apgūt</span>
        </div>

        <ProgramsSection programs={PROGRAMS} docsByInstrument={docsByInstrument} />
      </section>

      {/* ── Contact ── */}
      <section
        className="max-w-container mx-auto px-4 md:px-6 pb-20"
        aria-labelledby="contact-heading"
      >
        <div className="flex items-baseline justify-between mb-8">
          <h2
            id="contact-heading"
            className="font-heading font-bold text-scale-2xl text-ink leading-heading"
          >
            Kontaktinformācija
          </h2>
          <span className="text-scale-sm text-gray-500 hidden sm:block">
            Jautājumiem un pieteikumiem
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col gap-3">
            <p className="text-scale-sm font-medium text-gray-500 uppercase tracking-widest">
              Tālrunis
            </p>
            <div className="flex flex-col gap-1">
              <a
                href="tel:+37164471661"
                className="font-heading font-bold text-scale-2xl text-ink hover:text-gray-700 transition-colors"
              >
                +371 64471661
              </a>
              <a
                href="tel:+37125440582"
                className="font-heading font-bold text-scale-2xl text-ink hover:text-gray-700 transition-colors"
              >
                +371 25440582
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col gap-3">
            <p className="text-scale-sm font-medium text-gray-500 uppercase tracking-widest">
              E-pasts
            </p>
            <a
              href="mailto:muz.skola@gulbene.edu.lv"
              className="font-heading font-bold text-scale-2xl text-ink hover:text-gray-700 transition-colors break-all"
            >
              muz.skola@gulbene.edu.lv
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
