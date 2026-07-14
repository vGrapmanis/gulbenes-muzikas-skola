import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import AbsolventiManager from '@/components/admin/AbsolventiManager';

export const metadata: Metadata = { title: 'Absolventi — Admin' };

export default async function AdminAbsolventiPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from('graduate_classes')
    .select('*')
    .order('display_order', { ascending: true })
    .order('title', { ascending: false });

  if (error) console.error('Failed to load graduate classes', error);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 font-heading text-3xl font-bold text-paper">Absolventi</h1>
      <AbsolventiManager items={items ?? []} />
    </main>
  );
}
