import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import JaunumiSlideshow from '@/components/JaunumiSlideshow';

export const metadata: Metadata = { title: 'Jaunumi' };

export default async function JaunumiPage() {
  const today = new Date().toISOString().split('T')[0];
  const supabase = await createClient();
  const { data } = await supabase
    .from('news')
    .select('id, poster_key, poster_alt, body, event_date')
    .eq('published', true)
    .gte('event_date', today)
    .order('event_date', { ascending: true });

  const items = data ?? [];

  return (
    <div className="max-w-container mx-auto px-4 py-16">

      {items.length === 0 ? (
        <p className="text-scale-lg text-gray-500">Šobrīd nav plānotu pasākumu.</p>
      ) : (
        <JaunumiSlideshow items={items} />
      )}
    </div>
  );
}
