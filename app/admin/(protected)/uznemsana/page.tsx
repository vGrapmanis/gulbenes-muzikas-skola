import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import UznemsanaManager from '@/components/admin/UznemsanaManager';

export const metadata: Metadata = { title: 'Uzņemšana — Admin' };

export default async function AdminUznemsanaPage() {
  const supabase = await createClient();
  const { data: documents, error } = await supabase
    .from('program_documents')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) console.error('Failed to load program documents', error);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 font-heading text-3xl font-bold text-paper">Uzņemšana</h1>
      <p className="mb-8 text-sm text-gray-400">
        Pievienojiet vai noņemiet instrumentu dokumentus. Katram instrumentam var būt viens
        &ldquo;Izglītības programma&rdquo; PDF un viens &ldquo;Mācību priekšmeta programma&rdquo; PDF.
        Tos redzēs apmeklētāji, nospiežot uz instrumenta Uzņemšanas lapā.
      </p>
      <UznemsanaManager documents={documents ?? []} />
    </main>
  );
}
