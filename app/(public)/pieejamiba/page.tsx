import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pieejamības paziņojums',
  description:
    'Gulbenes Mūzikas skolas tīmekļvietnes pieejamības paziņojums saskaņā ar WCAG 2.1 AA prasībām.',
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
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="pt-10">
      <h2
        id={id}
        className="font-heading text-scale-xl font-bold text-ink mb-4 pb-2 border-b-2 border-ink"
      >
        {title}
      </h2>
      <div className="space-y-4 text-scale-base text-ink leading-body">{children}</div>
    </section>
  );
}

export default function PieejamibasPazinojumsPage() {
  return (
    <div className="max-w-container mx-auto px-4 md:px-6 py-16">
      <h1 className="font-heading text-scale-4xl font-bold text-ink leading-heading mb-6">
        Pieejamības paziņojums
      </h1>

      <p className="text-scale-base text-ink leading-body max-w-3xl">
        Gulbenes Mūzikas skola apņemas nodrošināt šīs tīmekļvietnes
        (<strong>gulbenesms.lv</strong>) pieejamību saskaņā ar{' '}
        <Placeholder>
          JĀPĀRBAUDA SKOLAI: precīzs normatīvā akta nosaukums (ES Tīmekļvietņu
          pieejamības direktīvas pārņemšanas noteikumi)
        </Placeholder>
        . Šis paziņojums attiecas tikai uz vietni gulbenesms.lv.
      </p>

      <div className="max-w-3xl divide-y divide-gray-300">
        <Section id="atbilstibas-statuss" title="Atbilstības statuss">
          <p>
            Šī tīmekļvietne <strong>daļēji atbilst</strong> WCAG 2.1 AA līmeņa
            prasībām. Neatbilstības ir uzskaitītas sadaļā &bdquo;Nepieejamais
            saturs&rdquo; zemāk.
          </p>
        </Section>

        <Section id="nepieejamais-saturs" title="Nepieejamais saturs">
          <p>
            Daži senāki dokumenti (PDF) sadaļā &bdquo;Dokumenti&rdquo; var
            nebūt pilnībā pieejami (piemēram, bez atpazīstama teksta slāņa vai
            dokumenta struktūras tagiem).
          </p>
          <p>
            <Placeholder>
              JĀPĀRBAUDA SKOLAI: pārbaudīt Dokumenti sadaļas PDF sarakstu un
              precizēt, kuri dokumenti nav pilnībā pieejami
            </Placeholder>
          </p>
        </Section>

        <Section id="panemsana" title="Paziņojuma sagatavošana">
          <p>
            Šis paziņojums sagatavots{' '}
            <Placeholder>JĀPĀRBAUDA SKOLAI: datums</Placeholder>, pamatojoties
            uz pašnovērtējumu.
          </p>
        </Section>

        <Section id="atsauksmes" title="Atsauksmes un kontaktinformācija">
          <p>
            Ja konstatējat šīs vietnes pieejamības problēmu, lūdzam ziņot:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              E-pasts:{' '}
              <a
                href="mailto:muz.skola@gulbene.edu.lv"
                className="underline underline-offset-2 hover:text-gray-700 transition-colors"
              >
                muz.skola@gulbene.edu.lv
              </a>
            </li>
            <li>
              Tālrunis:{' '}
              <a
                href="tel:+37164471661"
                className="underline underline-offset-2 hover:text-gray-700 transition-colors"
              >
                +371 64471661
              </a>
            </li>
          </ul>
          <p>
            Atbildi uz ziņojumu sniegsim{' '}
            <Placeholder>JĀPĀRBAUDA SKOLAI: atbildes termiņš</Placeholder>.
          </p>
        </Section>

        <Section id="izpildes-procedura" title="Izpildes procedūra">
          <p>
            Ja neesat apmierināts ar atbildi uz savu ziņojumu, jums ir
            tiesības vērsties:{' '}
            <Placeholder>
              JĀPĀRBAUDA SKOLAI: atbildīgās uzraudzības iestādes nosaukums un
              kontaktinformācija
            </Placeholder>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
