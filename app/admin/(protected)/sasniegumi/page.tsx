import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import SasniegumiiManager from '@/components/admin/SasniegumiiManager';

export const metadata: Metadata = { title: 'Sasniegumi — Admin' };

export default async function AdminSasniegumiiPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from('achievements')
    .select('*')
    .order('display_order', { ascending: true })
    .order('event_date', { ascending: false });

  if (error) console.error('Failed to load achievements', error);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 font-heading text-3xl font-bold text-paper">Sasniegumi</h1>
      <SasniegumiiManager items={items ?? []} />
    </main>
  );
}
