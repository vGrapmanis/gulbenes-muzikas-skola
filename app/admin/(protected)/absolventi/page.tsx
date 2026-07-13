import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Absolventi' };

export default function AdminAbsolventiPage() {
  return (
    <main className="max-w-container mx-auto px-4 py-12">
      <h1 className="font-heading text-scale-3xl font-bold">Absolventi</h1>
    </main>
  );
}
