import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { mediaUrl } from '@/lib/r2';

export const metadata: Metadata = { title: 'Dokumenti' };

export default async function DokumentiPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('title', { ascending: true });

  const docs = documents ?? [];

  return (
    <div className="max-w-container mx-auto px-4 py-16">
      <h1 className="font-heading text-scale-4xl font-bold mb-10">Dokumenti</h1>

      {docs.length === 0 ? (
        <p className="text-gray-500">Pagaidām nav pievienotu dokumentu.</p>
      ) : (
        <ul className="space-y-2">
          {docs.map((doc) => (
            <li key={doc.id}>
              <a
                href={mediaUrl(doc.file_key)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-md px-3 py-2.5 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-ink"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-ink group-hover:underline">
                    {doc.title}
                  </span>
                </span>
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
