import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Par skolu' };

export default function ParSkoluPage() {
  return (
    <div className="max-w-container mx-auto px-4 py-16">
      <h1 className="font-heading text-scale-4xl font-bold">Par skolu</h1>
    </div>
  );
}
