import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Vadības panelis' };

export default function AdminDashboardPage() {
  return (
    <main className="max-w-container mx-auto px-4 py-12">
      <h1 className="font-heading text-scale-3xl font-bold mb-8">
        Vadības panelis
      </h1>
      <p className="text-muted">Laipni lūgti administrācijas panelī.</p>
    </main>
  );
}
