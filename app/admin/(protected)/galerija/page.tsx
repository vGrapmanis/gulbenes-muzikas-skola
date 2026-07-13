import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import GalerijaManager from '@/components/admin/GalerijaManager';

export const metadata: Metadata = { title: 'Galerija — Admin' };

export default async function AdminGalerijaPage() {
  const supabase = await createClient();
  const { data: albums, error } = await supabase
    .from('gallery_albums')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Failed to load albums', error);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 font-heading text-3xl font-bold text-paper">Galerija</h1>
      <GalerijaManager albums={albums ?? []} />
    </main>
  );
}
