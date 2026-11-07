import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Vēsture — Par skolu — Gulbenes Mūzikas skola',
  description:
    'Gulbenes Mūzikas skola dibināta 1959. gadā. Uzzini par skolas vēsturi, direktoriem, kolektīviem un nozīmīgiem absolventiem.',
};

const directors = [
  { years: '1959–1961', name: 'Astrīda Rutka' },
  { years: '1961–1962', name: 'Andrejs Baumanis' },
  { years: '1962–1974', name: 'Vilnis Beitiks' },
  { years: '1973–1978', name: 'Alberts Pavlovskis' },
  { years: '1978–2015', name: 'Austra Veikšāne' },
  { years: 'No 2015', name: 'Ilona Matīsa' },
];

function StaticHistory() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-16 flex flex-col gap-12">
      {/* Founding */}
      <section aria-labelledby="founding-heading">
        <h2
          id="founding-heading"
          className="font-heading font-bold text-scale-xl text-ink leading-heading mb-4"
        >
          Dibināšana (1959)
        </h2>
        <div className="flex flex-col gap-4 text-base leading-body text-gray-800">
          <p>
            Gulbenes Mūzikas skola tika izveidota 1959. gadā. No 40 kandidātiem pieņēma
            25 audzēkņus — galvenokārt 7–10 gadus vecus bērnus. Sākotnēji mācības notika
            Gulbenes 7-gadīgās skolas telpās.
          </p>
          <p>
            Tika atvērta arī vakara nodaļa, kurā mācījās pieaugušie — vecākajam studentam
            bija 40 gadu. Audzēkņi apguva klavieru, vijoles, akordeona un pūšamo
            instrumentu spēli.
          </p>
          <p>
            Pirmā direktore bija <strong>Astrīda Rutka</strong>. Pirmais iestājas eksāmens
            bija Andrim Baumānim, kurš vēlāk kļuva izcils vijolnieks un pedagogs.
          </p>
        </div>
      </section>

      {/* Locations */}
      <section aria-labelledby="locations-heading">
        <h2
          id="locations-heading"
          className="font-heading font-bold text-scale-xl text-ink leading-heading mb-4"
        >
          Telpas (1959–1973)
        </h2>
        <div className="flex flex-col gap-4 text-base leading-body text-gray-800">
          <p>
            Ar vienu iedalīto telpu Gulbenes 7-gadīgajā skolā mācībām bija par maz.
            Vadība piešķīra kabinetus kultūras namā un Gulbenes 2. vidusskolā. Uz 14 gadiem
            mācības notika trīs dažādās ēkās.
          </p>
        </div>
      </section>

      {/* New building */}
      <section aria-labelledby="building-heading">
        <h2
          id="building-heading"
          className="font-heading font-bold text-scale-xl text-ink leading-heading mb-4"
        >
          Jaunā ēka (1973)
        </h2>
        <div className="flex flex-col gap-4 text-base leading-body text-gray-800">
          <p>
            1973. gada 1. septembrī svinīgi atklāja jauno skolu{' '}
            <strong>Oskara Kalpaka ielā 43, Gulbenē</strong> (bijusī Sarkanarmijas iela 43).
            Ēka bija veltīta tikai mūzikas izglītībai, un tajā skola darbojas joprojām.
          </p>
        </div>
      </section>

      {/* Ensembles */}
      <section aria-labelledby="ensembles-heading">
        <h2
          id="ensembles-heading"
          className="font-heading font-bold text-scale-xl text-ink leading-heading mb-4"
        >
          Kolektīvi un sasniegumi
        </h2>
        <div className="flex flex-col gap-4 text-base leading-body text-gray-800">
          <p>
            Skola izveidoja zēnu kori, pūtēju orķestri, kamerorķestri, vijolnieku un
            akordeonistu ansamblus. Zēnu koris koncertēja ārzemēs un piedalījās Latvijas
            Skolu jaunatnes Dziesmu svētkos (V–IX izdevumos).
          </p>
          <p>
            Veidota sadarbība ar Gulbenes Mākslas skolu. Laika gaitā izveidotas filiāles
            Lizumā, Rankā, Stāķos un Lejasciemā, nesot mūzikas izglītību novada pagastos.
          </p>
        </div>
      </section>

      {/* Directors */}
      <section aria-labelledby="directors-heading">
        <h2
          id="directors-heading"
          className="font-heading font-bold text-scale-xl text-ink leading-heading mb-6"
        >
          Direktori
        </h2>
        <ol className="flex flex-col divide-y divide-gray-200 border-y border-gray-200">
          {directors.map(({ years, name }) => (
            <li key={name} className="flex items-baseline gap-6 py-4">
              <span className="w-28 shrink-0 text-scale-sm text-gray-500 tabular-nums">
                {years}
              </span>
              <span className="font-heading font-bold text-scale-base text-ink">{name}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Graduates */}
      <section aria-labelledby="graduates-heading">
        <h2
          id="graduates-heading"
          className="font-heading font-bold text-scale-xl text-ink leading-heading mb-4"
        >
          Absolventi
        </h2>
        <div className="flex flex-col gap-4 text-base leading-body text-gray-800">
          <p>
            Aptuveni 2000 mūziķu ir beiguši skolu, no kuriem gandrīz 200 izvēlējušies
            mūziku kā profesiju. Starp pazīstamiem absolventiem ir Zane Gailīte,
            Juris Svemps, Zigismunds Katkevičs, Vilis Bērziņš un citi mākslinieki.
          </p>
          <p>
            Mūzikas mīlestība vieno un bagātina muzikālajām tradīcijām vēsturiski bagāto
            Gulbenes novadu.
          </p>
        </div>
      </section>

    </div>
  );
}

export default async function ParSkoluPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('pages')
    .select('title, body')
    .eq('slug', 'about_history')
    .single();

  return (
    <div>
      {/* Hero */}
      <section
        className="bg-paper border-b border-gray-300"
        aria-labelledby="par-skolu-heading"
      >
        <div className="max-w-container mx-auto px-4 md:px-6 py-16 md:py-20">
          <p className="text-scale-sm text-gray-500 uppercase tracking-widest mb-3">
            Par skolu
          </p>
          <h1
            id="par-skolu-heading"
            className="font-heading font-bold text-ink leading-heading text-[3.25rem] md:text-[4rem] lg:text-[5rem]"
          >
            Vēsture
          </h1>
          <p className="text-scale-md text-gray-700 leading-body max-w-prose mt-6">
            Gulbenes Mūzikas skola darbojas kopš 1959. gada, nesot mūzikas izglītību
            Gulbenes novadam jau vairāk nekā 65 gadus.
          </p>
        </div>
      </section>

      {/* Content — DB body takes precedence over static fallback */}
      {data?.body ? (
        <section className="max-w-3xl mx-auto px-4 md:px-6 py-16">
          {data.title && (
            <h2 className="font-heading font-bold text-scale-2xl text-ink leading-heading mb-8">
              {data.title}
            </h2>
          )}
          <div className="text-base leading-body text-gray-800 whitespace-pre-line">
            {data.body}
          </div>
        </section>
      ) : (
        <StaticHistory />
      )}
    </div>
  );
}
