import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privātuma politika',
  description:
    'Informācija par to, kā Gulbenes Mūzikas skolas tīmekļvietne apstrādā personas datus un sīkdatnes.',
};

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-gray-200 text-ink px-1 py-0.5 font-medium not-italic">
      {children}
    </mark>
  );
}

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="pt-10">
      <h2
        id={id}
        className="font-heading text-scale-xl font-bold text-ink mb-4 pb-2 border-b-2 border-ink"
      >
        {number}. {title}
      </h2>
      <div className="space-y-4 text-scale-base text-ink leading-body">{children}</div>
    </section>
  );
}

export default function PrivatumaPolitikaPage() {
  return (
    <div className="max-w-container mx-auto px-4 md:px-6 py-16">
      <h1 className="font-heading text-scale-4xl font-bold text-ink leading-heading mb-6">
        Privātuma politika
      </h1>

      <div className="max-w-3xl divide-y divide-gray-300">
        <Section id="parzinis" number={1} title="Pārzinis un kontaktinformācija">
          <p>
            Personas datu apstrādes pārzinis ir Gulbenes Mūzikas skola, O.
            Kalpaka iela 43, Gulbene, Gulbenes novads, LV-4401. Skolas
            dibinātājs ir Gulbenes novada pašvaldība.
          </p>
          <p>
            Kontaktinformācija:{' '}
            <a
              href="mailto:muz.skola@gulbene.edu.lv"
              className="underline underline-offset-2 hover:text-gray-700 transition-colors"
            >
              muz.skola@gulbene.edu.lv
            </a>
            ,{' '}
            <a
              href="tel:+37164471661"
              className="underline underline-offset-2 hover:text-gray-700 transition-colors"
            >
              +371 64471661
            </a>
            .
          </p>
        </Section>

        <Section id="dati" number={2} title="Kādi dati tiek apstrādāti un kāpēc">
          <p>
            Apmeklējot vietni, tiek apstrādāti tehniski dati (piemēram, IP
            adrese, pieprasījuma informācija) vietnes darbības un drošības
            nodrošināšanai. Šajā vietnē nav saziņas formas, tāpēc apmeklētāju
            personas dati šādā veidā netiek vākti.
          </p>
          <p>
            Publiski pieejamajā saturā (piemēram, sasniegumu aprakstos,
            fotogalerijā, pasākumu afišās) var tikt publicēti izglītojamo vai
            darbinieku personas dati (vārds, uzvārds, fotoattēls). Šāda
            publicēšana notiek skolas sabiedrības informēšanas uzdevuma
            ietvaros.
          </p>
        </Section>

        <Section id="sikdatnes" number={3} title="Sīkdatnes un piekrišana">
          <p>
            Vietne izmanto vienu nepieciešamo sīkdatni, kas saglabā jūsu
            izvēli par sīkdatņu piekrišanu (&bdquo;Piekrist&rdquo; vai
            &bdquo;Noraidīt&rdquo;). Šī sīkdatne ir nepieciešama vietnes
            darbībai, un tā netiek izmantota izsekošanai.
          </p>
          <p>
            Savu izvēli var mainīt, dzēšot pārlūkprogrammas saglabātos vietnes
            datus un no jauna ielādējot lapu — tad sīkdatņu piekrišanas
            paziņojums parādīsies atkārtoti.
          </p>
        </Section>

        <Section id="sanemeji" number={4} title="Datu saņēmēji un apstrādātāji">
          <p>
            Vietnes darbības nodrošināšanai tiek izmantoti šādi datu
            apstrādātāji:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cloudflare — vietnes mitināšana un failu glabāšana.</li>
            <li>Supabase — datubāze un administratora autentifikācija.</li>
          </ul>
          <p>Dati netiek nodoti ārpus Eiropas Savienības/EEZ.</p>
        </Section>

        <Section id="glabasana" number={5} title="Datu glabāšanas termiņi">
          <p>
            Sasniegumu un galerijas ieraksti pēc noklusējuma tiek rādīti
            publiski 2 gadus no publicēšanas datuma, pēc tam tie tiek
            automātiski noņemti no publiskās piekļuves.
          </p>
        </Section>

        <Section id="tiesibas" number={6} title="Datu subjekta tiesības">
          <p>
            Jums ir tiesības pieprasīt piekļuvi saviem personas datiem, to
            labošanu, dzēšanu, apstrādes ierobežošanu, iebilst pret apstrādi,
            kā arī tiesības uz datu pārnesamību. Lai īstenotu šīs tiesības,
            lūdzam sazināties, izmantojot 1. sadaļā norādīto
            kontaktinformāciju.
          </p>
        </Section>

        <Section id="sudzibas" number={7} title="Tiesības iesniegt sūdzību">
          <p>
            Ja uzskatāt, ka jūsu personas dati tiek apstrādāti neatbilstoši,
            jums ir tiesības iesniegt sūdzību Datu valsts inspekcijā
            (www.dvi.gov.lv).
          </p>
        </Section>

        <Section
          id="fotoattelu-dzesana"
          number={8}
          title="Fotoattēlu vai personas datu dzēšanas pieprasījums"
        >
          <p>
            Ja esat ievērojuši sevi vai savu bērnu publicētā fotoattēlā vai
            citā saturā un vēlaties, lai tas tiktu noņemts, lūdzam sazināties,
            izmantojot 1. sadaļā norādīto kontaktinformāciju. Pieprasījumu
            izskatīsim un saturu noņemsim no publiskās skatīšanās.
          </p>
        </Section>

        <Section id="izmainas" number={9} title="Izmaiņas šajā politikā">
          <p>
            Šī politika pēdējoreiz atjaunota 13.11.2026
            Izmaiņas tiks publicētas šajā lapā, atjauninot norādīto datumu.
          </p>
        </Section>
      </div>

      <p className="max-w-3xl mt-10 text-scale-sm text-gray-700">
        Skatiet arī:{' '}
        <Link
          href="/pieejamiba"
          className="underline underline-offset-2 hover:text-gray-500 transition-colors"
        >
          Pieejamības paziņojumu
        </Link>
        .
      </p>
    </div>
  );
}
