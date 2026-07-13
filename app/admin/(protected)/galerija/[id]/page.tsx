import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AlbumEditor from '@/components/admin/AlbumEditor';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('gallery_albums')
    .select('title')
    .eq('id', id)
    .single();
  return { title: data?.title ? `${data.title} — Galerija` : 'Albums — Galerija' };
}

export default async function AdminAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [albumResult, imagesResult] = await Promise.all([
    supabase.from('gallery_albums').select('*').eq('id', id).single(),
    supabase
      .from('gallery_images')
      .select('*')
      .eq('album_id', id)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true }),
  ]);

  if (albumResult.error || !albumResult.data) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <AlbumEditor album={albumResult.data} images={imagesResult.data ?? []} />
    </main>
  );
}
