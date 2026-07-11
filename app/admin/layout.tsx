import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Administrācija', template: '%s | GMS admin' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 text-ink">
      {children}
    </div>
  );
}
