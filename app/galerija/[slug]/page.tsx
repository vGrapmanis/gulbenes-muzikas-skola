import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Albums' };

export default function AlbumsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  void params;
  return (
    <div className="max-w-container mx-auto px-4 py-16">
      <h1 className="font-heading text-scale-4xl font-bold">Albums</h1>
    </div>
  );
}
