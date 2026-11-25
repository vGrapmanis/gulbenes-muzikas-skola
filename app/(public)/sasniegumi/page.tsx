import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { mediaUrl } from '@/lib/media-url';
import type { Achievement } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Sasniegumi — Gulbenes Mūzikas skola',
  description: 'Gulbenes Mūzikas skolas audzēkņu sasniegumi konkursos un skatēs.',
};

type AchievementRow = Achievement & { teacher_note: string | null };

function formatDate(d: string): string {
  const [y, m, day] = d.split('-').map(Number);
  return new Intl.DateTimeFormat('lv-LV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(y, m - 1, day));
}

// ── Featured (newest) post — full-width horizontal card ───────────────────────

function FeaturedCard({ item }: { item: AchievementRow }) {
  return (
    <Link
      href={`/sasniegumi/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition hover:shadow-md sm:flex-row"
    >
      {item.image_key ? (
        <div className="relative shrink-0 overflow-hidden bg-gray-100 sm:w-[55%]">
          <div className="aspect-[4/3] sm:aspect-auto sm:h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(item.image_key)}
              alt={item.image_alt ?? ''}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      ) : (
        <div className="shrink-0 bg-gray-100 sm:w-[55%]" />
      )}

      <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
        <div>
          {item.event_date && (
            <p className="mb-2 text-sm text-gray-500">{formatDate(item.event_date)}</p>
          )}
          <h2 className="font-heading text-2xl font-bold leading-snug text-ink transition group-hover:opacity-80 sm:text-3xl">
            {item.title}
          </h2>
        </div>
        {item.description && (
          <p className="line-clamp-4 text-base leading-relaxed text-gray-700">
            {item.description}
          </p>
        )}
        <span className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-medium text-ink underline-offset-2 group-hover:underline">
          Lasīt vairāk →
        </span>
      </div>
    </Link>
  );
}

// ── Small grid card — photo + title only ──────────────────────────────────────

function GridCard({ item }: { item: AchievementRow }) {
  return (
    <Link
      href={`/sasniegumi/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        {item.image_key ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(item.image_key)}
            alt={item.image_alt ?? ''}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>
      <div className="px-4 py-3">
        <h2 className="font-heading text-base font-semibold leading-snug text-ink line-clamp-2 group-hover:opacity-80">
          {item.title}
        </h2>
        {item.event_date && (
          <p className="mt-1 text-xs text-gray-500">{formatDate(item.event_date)}</p>
        )}
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function SasniegumiiPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) console.error('Failed to load achievements', error);

  const items = (data ?? []) as AchievementRow[];
  const [featured, ...rest] = items;

  return (
    <div className="mx-auto max-w-container px-4 py-16 md:px-6">
      <h1 className="mb-10 font-heading text-scale-4xl font-bold text-ink">Sasniegumi</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Pašlaik nav publicētu sasniegumu.</p>
      ) : (
        <div className="space-y-10">
          <FeaturedCard item={featured} />

          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((item) => (
                <GridCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
