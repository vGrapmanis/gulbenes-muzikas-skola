import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sasniegumi' };

export default function AdminSasniegumiiPage() {
  return (
    <main className="max-w-container mx-auto px-4 py-12">
      <h1 className="font-heading text-scale-3xl font-bold">Sasniegumi</h1>
    </main>
  );
}
