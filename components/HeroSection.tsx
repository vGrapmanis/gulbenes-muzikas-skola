import Image from 'next/image';

// Decorative color streaks — irregular vertical bands scattered across the
// hero, faded top/bottom, evoking soft stage light through piano keys.
// aria-hidden, low opacity, never affects text contrast.
function ColorStreaks() {
  const streaks = [
    { left: '4%',  w: 6, h: '92%', top: '4%',  blur: 6, color: 'rgba(217,119,6,0.30)' },   // amber
    { left: '12%', w: 3, h: '55%', top: '20%', blur: 4, color: 'rgba(180,180,180,0.15)' }, // gray
    { left: '19%', w: 2, h: '45%', top: '30%', blur: 3, color: 'rgba(220,38,38,0.16)' },   // red
    { left: '27%', w: 3, h: '60%', top: '15%', blur: 4, color: 'rgba(13,148,136,0.18)' },  // teal
    { left: '73%', w: 3, h: '55%', top: '22%', blur: 4, color: 'rgba(13,148,136,0.18)' },  // teal
    { left: '81%', w: 2, h: '48%', top: '28%', blur: 3, color: 'rgba(220,38,38,0.16)' },   // red
    { left: '88%', w: 3, h: '58%', top: '18%', blur: 4, color: 'rgba(180,180,180,0.15)' }, // gray
    { left: '96%', w: 6, h: '90%', top: '5%',  blur: 6, color: 'rgba(217,119,6,0.30)' },   // amber
  ];

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {streaks.map((s, i) => (
        <div
          key={i}
          style={{
            left: s.left,
            width: s.w,
            top: s.top,
            height: s.h,
            filter: `blur(${s.blur}px)`,
            background: `linear-gradient(to bottom, transparent, ${s.color}, transparent)`,
          }}
          className="absolute"
          />
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] bg-black flex flex-col items-center justify-center overflow-hidden"
      aria-label="Galvenā lapa"
    >
      <ColorStreaks />

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
            //style={{ mixBlendMode: 'screen', filter: 'invert(1) brightness(2.5) contrast(0.9)' }}
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
