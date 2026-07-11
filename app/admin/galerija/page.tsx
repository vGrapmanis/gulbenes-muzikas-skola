import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Galerija' };

export default function AdminGalerijaPage() {
  return (
    <main className="max-w-container mx-auto px-4 py-12">
      <h1 className="font-heading text-scale-3xl font-bold">Galerija</h1>
    </main>
  );
}
