import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dokumenti' };

export default function AdminDokumentiPage() {
  return (
    <main className="max-w-container mx-auto px-4 py-12">
      <h1 className="font-heading text-scale-3xl font-bold">Dokumenti</h1>
    </main>
  );
}
