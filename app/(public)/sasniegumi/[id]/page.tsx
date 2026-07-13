import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { mediaUrl } from '@/lib/media-url';

type Params = Promise<{ id: string }>;

function formatDate(d: string): string {
  const [y, m, day] = d.split('-').map(Number);
  return new Intl.DateTimeFormat('lv-LV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(y, m - 1, day));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('achievements')
    .select('title, description')
    .eq('id', id)
    .eq('published', true)
    .single();
  return {
    title: data?.title ? `${data.title} — Sasniegumi` : 'Sasniegumi',
    description: data?.description ?? undefined,
  };
}

export default async function AchievementDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();

  if (error || !item) notFound();

  const teacherNote = (item as typeof item & { teacher_note: string | null }).teacher_note;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <Link
        href="/sasniegumi"
        className="mb-8 inline-flex items-center gap-1 text-sm text-gray-700 transition-colors hover:text-ink"
      >
        ← Sasniegumi
      </Link>

      <article>
        {item.image_key && (
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <img
              src={mediaUrl(item.image_key)}
              alt=""
              className="w-full object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          {item.event_date && (
            <p className="mb-3 text-sm text-gray-500">{formatDate(item.event_date)}</p>
          )}
          <h1 className="font-heading text-scale-3xl font-bold leading-heading text-ink">
            {item.title}
          </h1>
        </header>

        {item.description && (
          <div className="prose-lv mb-8">
            <p className="text-base leading-body text-gray-800 whitespace-pre-line">
              {item.description}
            </p>
          </div>
        )}

        {teacherNote && (
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm italic leading-relaxed text-gray-600">
              {teacherNote}
            </p>
          </div>
        )}
      </article>
    </div>
  );
}
