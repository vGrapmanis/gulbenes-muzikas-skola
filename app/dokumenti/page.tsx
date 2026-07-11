import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dokumenti' };

export default function DokumentiPage() {
  return (
    <div className="max-w-container mx-auto px-4 py-16">
      <h1 className="font-heading text-scale-4xl font-bold">Dokumenti</h1>
    </div>
  );
}
