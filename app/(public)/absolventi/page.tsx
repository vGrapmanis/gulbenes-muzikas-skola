import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { mediaUrl } from '@/lib/media-url';

export const metadata: Metadata = {
  title: 'Absolventi — Gulbenes Mūzikas skola',
  description: 'Gulbenes Mūzikas skolas absolventu izlaidumu foto galerija.',
};

export default async function AbsolventiPage() {
  const supabase = await createClient();
  const { data: classes } = await supabase
    .from('graduate_classes')
    .select('id, title, image_key, image_alt, display_order')
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('title', { ascending: false });

  const items = classes ?? [];

  return (
    <div className="max-w-container mx-auto px-4 py-16">
      <h1 className="font-heading text-scale-4xl font-bold mb-12">Absolventi</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Pagaidām nav pievienotu izlaidumu.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col">
              <div className="aspect-[3/2] w-full overflow-hidden rounded bg-gray-100">
                {item.image_key ? (
                  <img
                    src={mediaUrl(item.image_key)}
                    alt={item.image_alt || item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200" aria-hidden="true" />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
