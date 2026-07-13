import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Jaunumi' };

export default function JaunumiPage() {
  return (
    <div className="max-w-container mx-auto px-4 py-16">
      <h1 className="font-heading text-scale-4xl font-bold">Jaunumi</h1>
    </div>
  );
}
