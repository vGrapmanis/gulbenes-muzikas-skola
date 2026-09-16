import Image from 'next/image';

// Decorative color streaks — thin vertical bars grouped in clusters near the
// far left/right edges, evoking piano keys lit from below. Each cluster has
// one saturated accent bar and a few near-invisible companion bars; all fade
// in from transparent at the top and glow brightest at the foot of the hero,
// like stage uplighting. Center third stays clear behind the title/graphic.
// aria-hidden, decorative only, never affects text contrast.
function ColorStreaks() {
  // dir 'up' = glows in from the bottom (uplight); 'down' = glows in from the
  // top, so the field isn't just a mirrored pair of symmetric halves.
  type Line = { left: number; top: number; bottom: number; w: number; blur: number; color: string; dir?: 'up' | 'down' };

  const NEUTRAL = 'rgba(215,215,225,0.38)';
  const lineOffsets = [0, 1.8, 3.6, 5.4]; // % spacing within a cluster

  const clusters: { start: number; accentIndex: number; accent: string; dir?: 'up' | 'down' }[] = [
    { start: 9.5,  accentIndex: 1, accent: 'rgba(255,205,170,1)'  },              // left-inner: warm peach
    { start: 22.5, accentIndex: 0, accent: 'rgba(230,110,110,0.9)', dir: 'down' }, // left-outer: rose, lit from the top
    { start: 68.4, accentIndex: 3, accent: 'rgba(70,190,190,0.9)'  },              // right-outer: teal (mirrors left-outer, but still uplit)
    { start: 85.4, accentIndex: 2, accent: 'rgba(245,125,60,1)'  },                // right-inner: rust (mirrors left-inner)
  ];

  const lines: Line[] = clusters.flatMap((c) =>
    lineOffsets.map((offset, i) => ({
      left: c.start + offset,
      top: 0,
      bottom: 0,
      w: i === c.accentIndex ? 7 : 3,
      blur: i === c.accentIndex ? 1.5 : 2,
      color: i === c.accentIndex ? c.accent : NEUTRAL,
      dir: i === c.accentIndex ? c.dir : undefined,
    }))
  );

  // Extra irregular bars scattered through the same outer bands — varied
  // left position, length (via top/bottom insets), color/opacity and glow
  // direction, so the field reads as organic rather than a strict repeating
  // grid. Still purely vertical and confined to the outer bands either side
  // of the centered content.
  const extras: Line[] = [
    { left: 5,    top: 48, bottom: 0,  w: 4, blur: 1.5, color: 'rgba(200,200,210,0.6)', dir: 'up'   },
    { left: 18,   top: 8,  bottom: 52, w: 3, blur: 2,   color: 'rgba(255,210,175,0.75)', dir: 'down' },
    { left: 31,   top: 38, bottom: 4,  w: 4, blur: 1.5, color: 'rgba(235,140,140,0.8)', dir: 'up'  },
    { left: 39.5, top: 60, bottom: 0,  w: 3, blur: 2,   color: 'rgba(245,145,85,0.7)', dir: 'up'   },
    { left: 60.5, top: 15, bottom: 62, w: 3, blur: 2,   color: 'rgba(80,195,195,0.75)', dir: 'down'  },
    { left: 69,   top: 42, bottom: 0,  w: 3, blur: 1.5, color: 'rgba(255,210,175,0.75)', dir: 'down' },
    { left: 82,   top: 6,  bottom: 48, w: 4, blur: 1.5, color: 'rgba(235,140,140,0.75)', dir: 'up'   },
    { left: 95,   top: 55, bottom: 0,  w: 4, blur: 1.5, color: 'rgba(200,200,210,0.6)', dir: 'up'   },
  ];

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {[...lines, ...extras].map((s, i) => {
        const gradient =
          s.dir === 'down'
            ? `linear-gradient(to bottom, ${s.color} 0%, ${s.color} 40%, transparent 85%, transparent 100%)`
            : `linear-gradient(to bottom, transparent 0%, transparent 15%, ${s.color} 60%, ${s.color} 100%)`;
        return (
          <div
            key={i}
            style={{
              left: `${s.left}%`,
              width: s.w,
              top: `${s.top}%`,
              bottom: `${s.bottom}%`,
              filter: `blur(${s.blur}px)`,
              background: gradient,
            }}
            className="absolute"
            />
        );
      })}
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
