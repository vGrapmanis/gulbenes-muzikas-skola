import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import JaunumiManager from '@/components/admin/JaunumiManager';

export const metadata: Metadata = { title: 'Jaunumi — Admin' };

export default async function AdminJaunumiPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('news')
    .select('*')
    .order('event_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  return (
    <main className="max-w-container mx-auto px-4 py-12">
      <h1 className="font-heading text-scale-3xl mb-8 font-bold">Jaunumi</h1>
      <JaunumiManager items={data ?? []} />
    </main>
  );
}
