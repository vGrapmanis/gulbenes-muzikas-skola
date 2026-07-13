import type { Metadata } from 'next';
import { loginAction } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Pieslēgties' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ klaida?: string }>;
}) {
  const { klaida } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo mark */}
        <div className="mb-8 text-center">
          <p className="font-heading font-bold text-paper text-xs tracking-widest uppercase">
            Gulbenes Mūzikas Skola
          </p>
          <p className="text-gray-500 text-xs mt-1">Administrācija</p>
        </div>

        <form action={loginAction} className="flex flex-col gap-4">

          {klaida === '1' && (
            <div role="alert" className="bg-danger/10 border border-danger/40 text-danger text-sm px-4 py-3 rounded-sm">
              Nepareizs e-pasts vai parole.
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-bold tracking-widest uppercase text-gray-400">
              E-pasts
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="bg-gray-800 border border-gray-700 text-paper px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-focus focus:ring-1 focus:ring-focus"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-bold tracking-widest uppercase text-gray-400">
              Parole
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="bg-gray-800 border border-gray-700 text-paper px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:border-focus focus:ring-1 focus:ring-focus"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-paper text-ink font-bold text-sm py-2.5 px-4 rounded-sm hover:bg-gray-300 focus-visible:ring-2 ring-focus ring-offset-2 ring-offset-gray-900 transition-colors"
          >
            Pieslēgties
          </button>

        </form>
      </div>
    </div>
  );
}
