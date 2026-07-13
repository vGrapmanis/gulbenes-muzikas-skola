import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Vadības panelis' };

type TableName = 'graduates' | 'news' | 'achievements' | 'gallery_albums' | 'documents';

const SECTIONS: { label: string; href: string; table?: TableName; description?: string }[] = [
  { label: 'Lapu teksti',  href: '/admin/lapas',      description: 'Galvenā lapa, Vēsture, Uzņemšana, Kontakti' },
  { label: 'Absolventi',   href: '/admin/absolventi',  table: 'graduates'      },
  { label: 'Jaunumi',      href: '/admin/jaunumi',     table: 'news'           },
  { label: 'Sasniegumi',   href: '/admin/sasniegumi',  table: 'achievements'   },
  { label: 'Galerija',     href: '/admin/galerija',    table: 'gallery_albums' },
  { label: 'Dokumenti',    href: '/admin/dokumenti',   table: 'documents'      },
];

type Counts = Record<TableName, { total: number; published: number }>;

async function getCounts(supabase: Awaited<ReturnType<typeof createClient>>): Promise<Counts> {
  const [graduates, news, achievements, gallery_albums, documents] = await Promise.all([
    supabase.from('graduates').select('published'),
    supabase.from('news').select('published'),
    supabase.from('achievements').select('published'),
    supabase.from('gallery_albums').select('published'),
    supabase.from('documents').select('published'),
  ]);

  function tally(data: { published: boolean }[] | null) {
    const rows = data ?? [];
    return { total: rows.length, published: rows.filter((r) => r.published).length };
  }

  return {
    graduates:      tally(graduates.data),
    news:           tally(news.data),
    achievements:   tally(achievements.data),
    gallery_albums: tally(gallery_albums.data),
    documents:      tally(documents.data),
  };
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const counts = await getCounts(supabase);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-heading font-bold text-2xl text-paper mb-8">
        Vadības panelis
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map((section) => {
          const stat = section.table ? counts[section.table] : null;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group block bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-sm p-5 transition-colors"
            >
              <p className="font-heading font-bold text-paper text-sm mb-1 group-hover:underline">
                {section.label}
              </p>
              {stat ? (
                <p className="text-xs text-gray-500">
                  {stat.published} publicēts / {stat.total} kopā
                </p>
              ) : (
                <p className="text-xs text-gray-500">{section.description}</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
