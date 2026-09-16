// Single source of truth for the Uzņemšana programs + instruments list.
// Shared by the public /uznemsana page and the admin Uznemšana manager.

export type Program = {
  name: string;
  instruments: string[];
  duration: string;
  details: string;
};

export const PROGRAMS: Program[] = [
  {
    name: 'Taustiņinstrumentu spēle',
    instruments: ['Klavieres'],
    duration: 'Profesionālās ievirzes programmas apmācība 8 gadi (1. – 8.klasei).',
    details: 'Papildus instrumentu spēlei apgūst solfedžo no 1. līdz 8.klasei, mūzikas literatūru no 5. līdz 8.klasei, klavieru ansambli / koncertmeistara praksi / izvēles mācību priekšmetu no 6. līdz 7.klasei.',
  },
  {
    name: 'Stīgu instrumentu spēle',
    instruments: ['Vijole', 'Kokle'],
    duration: 'Profesionālās ievirzes programmas apmācība 8 gadi (1. – 8.klasei).',
    details: 'Papildus instrumentu spēlei apgūst solfedžo no 1. līdz 8.klasei, mūzikas literatūru no 5. līdz 8.klasei, vispārējās klavieres no 3. līdz 8.klasei, kolektīvo muzicēšanu no 3. līdz 8.klasei.',
  },
  {
    name: 'Sitaminstrumentu spēle',
    instruments: ['Sitaminstrumenti'],
    duration: 'Profesionālās ievirzes programmas apmācība 8 gadi (1. – 8.klasei).',
    details: 'Papildus instrumentu spēlei apgūst solfedžo no 1. līdz 8.klasei, mūzikas literatūru no 5. līdz 8.klasei, vispārējās klavieres no 3.-8.klasei, kolektīvo muzicēšanu / pūtēju orķestri no 3. līdz 8.klasei.',
  },
  {
    name: 'Pūšaminstrumentu spēle',
    instruments: ['Flauta', 'Saksofons', 'Klarnete', 'Tuba', 'Eifonijs', 'Mežrags', 'Trompete'],
    duration: 'Profesionālās ievirzes programmas apmācība 8 gadi (1. – 8.klasei).',
    details: 'Papildus instrumentu spēlei apgūst solfedžo no 1. līdz 8.klasei, mūzikas literatūru no 5. līdz 8.klasei, vispārējās klavieres no 3. līdz 8.klasei, kolektīvo muzicēšanu / pūtēju orķestri no 3. līdz 8.klasei.',
  },
];
