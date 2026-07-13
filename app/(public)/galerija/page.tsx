import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { mediaUrl } from '@/lib/media-url';
import type { GalleryAlbum } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Galerija',
  description: 'Foto albumi no Gulbenes Mūzikas skolas pasākumiem un konkursiem.',
};

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Intl.DateTimeFormat('lv-LV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(y, m - 1, d));
}

function AlbumCard({ album }: { album: GalleryAlbum }) {
  return (
    <Link
      href={`/galerija/${album.slug}`}
      className="group block overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <div className="aspect-[4/3] overflow-hidden border-2 border-black bg-gray-100">
        {album.cover_key ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(album.cover_key)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <circle cx="12" cy="14" r="3" />
              <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
        )}
      </div>

      <div className="pt-3">
        <h2 className="font-heading text-scale-md font-semibold text-ink leading-snug group-hover:underline underline-offset-2">
          {album.title}
        </h2>
        {album.event_date && (
          <p className="mt-1 text-scale-sm text-gray-700">{formatDate(album.event_date)}</p>
        )}
      </div>
    </Link>
  );
}

export default async function GalerijaPage() {
  const supabase = await createClient();
  const { data: albums, error } = await supabase
    .from('gallery_albums')
    .select('*')
    .eq('published', true)
    .order('event_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) console.error('Failed to load albums', error);

  return (
    <div className="max-w-container mx-auto px-4 md:px-6 py-16">
      <h1 className="font-heading text-scale-4xl font-bold text-ink leading-heading mb-10">
        Galerija
      </h1>

      {!albums || albums.length === 0 ? (
        <p className="text-gray-700">Pagaidām nav neviena albuma.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {albums.map((album) => (
            <li key={album.id}>
              <AlbumCard album={album} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
