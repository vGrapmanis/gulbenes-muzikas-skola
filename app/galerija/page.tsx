import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Galerija' };

export default function GalerijaPage() {
  return (
    <div className="max-w-container mx-auto px-4 py-16">
      <h1 className="font-heading text-scale-4xl font-bold">Galerija</h1>
    </div>
  );
}
