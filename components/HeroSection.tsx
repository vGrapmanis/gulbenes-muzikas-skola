import Image from 'next/image';

// Decorative edge bar — vertical strips evoking piano keys (amber/red/teal).
// aria-hidden, never affects text contrast.
function EdgeBar({ side }: { side: 'left' | 'right' }) {
  const strips = [
    { w: 14, colors: 'from-amber-400/20 via-amber-300/10 to-transparent' },
    { w: 10, colors: 'from-red-500/15 via-red-400/8 to-transparent' },
    { w: 12, colors: 'from-teal-400/18 via-teal-300/10 to-transparent' },
    { w: 8,  colors: 'from-amber-300/12 via-transparent to-transparent' },
    { w: 10, colors: 'from-red-400/10 via-transparent to-transparent' },
  ];

  const ordered = side === 'right' ? [...strips].reverse() : strips;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-y-0 ${side === 'left' ? 'left-0' : 'right-0'} z-0 flex pointer-events-none`}
    >
      {ordered.map((s, i) => (
        <div
          key={i}
          style={{ width: s.w }}
          className={`h-full bg-gradient-to-b ${s.colors} opacity-80`}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] bg-black flex flex-col items-center justify-center overflow-hidden"
      aria-label="Sākumlapa"
    >
      <EdgeBar side="left" />
      <EdgeBar side="right" />

      {/* Content — above decorative bars */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 gap-6 max-w-3xl mx-auto">

        {/* School title */}
        <h1 className="font-heading font-bold text-paper uppercase tracking-[0.18em] text-2xl sm:text-3xl md:text-4xl leading-tight">
          Gulbenes Mūzikas Skola
        </h1>

        {/* Piano-key fan graphic */}
        <div className="w-full max-w-xl mx-auto select-none" style={{ isolation: 'isolate' }}>
          <Image
            src="/brand/piano-keys-wide.png"
            alt=""
            width={820}
            height={280}
            priority
            className="w-full h-auto"
            style={{ mixBlendMode: 'screen', filter: 'invert(1) brightness(2.5) contrast(0.9)' }}
          />
        </div>

        {/* Motto */}
        <blockquote className="flex flex-col items-center gap-3">
          <p className="font-heading font-bold text-paper text-lg sm:text-xl md:text-2xl leading-relaxed max-w-lg">
            <span className="text-gray-400 text-2xl leading-none align-text-top mr-1">&ldquo;</span>
            Caur pasauli iet mūžīgs nošu raksts
            <span className="text-gray-400 text-2xl leading-none align-text-bottom ml-1">&rdquo;</span>
          </p>
          <footer className="font-sans text-gray-400 text-sm tracking-wider italic">
            / Ojārs Vācietis /
          </footer>
        </blockquote>

      </div>
    </section>
  );
}
