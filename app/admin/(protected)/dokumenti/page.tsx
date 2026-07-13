import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import DocumentsManager from '@/components/admin/DocumentsManager';

export const metadata: Metadata = { title: 'Dokumenti — Admin' };

export default async function AdminDokumentiPage() {
  const supabase = await createClient();
  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) console.error('Failed to load documents', error);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 font-heading text-3xl font-bold text-paper">Dokumenti</h1>
      <DocumentsManager documents={documents ?? []} />
    </main>
  );
}
