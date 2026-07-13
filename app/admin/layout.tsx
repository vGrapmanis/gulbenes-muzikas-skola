import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Administrācija', template: '%s | GMS admin' },
  robots: { index: false, follow: false },
};

// Minimal wrapper — auth gating lives in app/admin/(protected)/layout.tsx
// so the login page (outside that group) is not blocked.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-sans">{children}</div>;
}
