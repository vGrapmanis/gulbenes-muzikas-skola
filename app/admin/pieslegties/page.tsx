import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pieslēgties' };

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-scale-2xl font-bold mb-8 text-center">
          Pieslēgties
        </h1>
        <p className="text-muted text-center text-sm">
          Pieslēgšanās forma (drīzumā)
        </p>
      </div>
    </main>
  );
}
