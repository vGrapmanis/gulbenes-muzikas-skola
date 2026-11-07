import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/site';

// Static public routes. Keep in sync with app/(public)/*.
const STATIC_PATHS = [
  '',
  '/par-skolu',
  '/jaunumi',
  '/sasniegumi',
  '/galerija',
  '/uznemsana',
  '/dokumenti',
  '/kontakti',
  '/privatuma-politika',
  '/pieejamiba',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // RLS already hides unpublished and expired rows from the anon role, so a
  // plain "published" query mirrors exactly what a visitor can reach — no
  // need to re-derive the 2-year expiry rule here (see docs/schemas.md).
  const [{ data: achievements }, { data: albums }] = await Promise.all([
    supabase
      .from('achievements')
      .select('id, event_date, created_at')
      .eq('published', true),
    supabase
      .from('gallery_albums')
      .select('slug, event_date, created_at')
      .eq('published', true),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const achievementRoutes: MetadataRoute.Sitemap = (achievements ?? []).map((item) => ({
    url: `${SITE_URL}/sasniegumi/${item.id}`,
    lastModified: new Date(item.event_date ?? item.created_at),
  }));

  const albumRoutes: MetadataRoute.Sitemap = (albums ?? []).map((album) => ({
    url: `${SITE_URL}/galerija/${album.slug}`,
    lastModified: new Date(album.event_date ?? album.created_at),
  }));

  return [...staticRoutes, ...achievementRoutes, ...albumRoutes];
}
