import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AlbumImageGrid from '@/components/AlbumImageGrid';

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Intl.DateTimeFormat('lv-LV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(y, m - 1, d));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('gallery_albums')
    .select('title, description')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  return {
    title: data?.title ? `${data.title} — Galerija` : 'Galerija',
    description: data?.description ?? undefined,
  };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: album, error } = await supabase
    .from('gallery_albums')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !album) notFound();

  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('album_id', album.id)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });

  return (
    <div className="max-w-container mx-auto px-4 md:px-6 py-16">
      <Link
        href="/galerija"
        className="inline-flex items-center gap-1 text-scale-sm text-gray-700 transition-colors hover:text-ink mb-8"
      >
        ← Galerija
      </Link>

      <header className="mb-8">
        <h1 className="font-heading text-scale-4xl font-bold text-ink leading-heading">
          {album.title}
        </h1>
        {album.event_date && (
          <p className="mt-2 text-scale-sm text-gray-700">{formatDate(album.event_date)}</p>
        )}
        {album.description && (
          <p className="mt-3 text-scale-base text-gray-700 leading-body whitespace-pre-line break-words">
            {album.description}
          </p>
        )}
      </header>

      {!images || images.length === 0 ? (
        <p className="text-gray-700">Albums ir tukšs.</p>
      ) : (
        <AlbumImageGrid images={images} />
      )}
    </div>
  );
}
