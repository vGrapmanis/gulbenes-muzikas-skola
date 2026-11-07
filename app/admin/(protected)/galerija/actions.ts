'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { uploadToR2, deleteFromR2 } from '@/lib/r2';
import { isContentExpired } from '@/lib/content-expiry';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export type ActionResult = { error?: string };

function toSlug(title: string): string {
  const map: Record<string, string> = {
    ā: 'a', č: 'c', ē: 'e', ģ: 'g', ī: 'i', ķ: 'k',
    ļ: 'l', ņ: 'n', ŗ: 'r', š: 's', ū: 'u', ž: 'z',
  };
  return title
    .toLowerCase()
    .replace(/[āčēģīķļņŗšūž]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function galleryImageKey(albumSlug: string, mime: string): string {
  return `gallery/${albumSlug}/${crypto.randomUUID()}.${EXT_MAP[mime] ?? 'jpg'}`;
}

function revalidateGallery(albumId?: string) {
  revalidatePath('/admin/galerija');
  revalidatePath('/galerija');
  if (albumId) {
    revalidatePath(`/admin/galerija/${albumId}`);
    revalidatePath(`/galerija`);
  }
}

// ── Album CRUD ────────────────────────────────────────────────────────────────

export async function createAlbumAction(
  formData: FormData
): Promise<ActionResult & { id?: string }> {
  const title = (formData.get('title') as string | null)?.trim();
  if (!title) return { error: 'Nosaukums ir obligāts.' };

  const description = (formData.get('description') as string | null)?.trim() || null;
  const eventDate = (formData.get('event_date') as string | null)?.trim() || null;
  const slug = `${toSlug(title)}-${crypto.randomUUID().slice(0, 8)}`;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('gallery_albums')
    .insert({ title, slug, description, event_date: eventDate, published: false })
    .select('id')
    .single();

  if (error || !data) return { error: 'Albums netika izveidots.' };

  revalidateGallery();
  return { id: data.id };
}

export async function updateAlbumMetaAction(
  id: string,
  data: { title: string; description?: string; event_date?: string }
): Promise<ActionResult> {
  if (!data.title.trim()) return { error: 'Nosaukums ir obligāts.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('gallery_albums')
    .update({
      title: data.title.trim(),
      description: data.description?.trim() || null,
      event_date: data.event_date || null,
    })
    .eq('id', id);

  if (error) return { error: 'Saglabāšana neizdevās.' };

  revalidateGallery(id);
  return {};
}

export async function togglePublishAlbumAction(
  id: string,
  published: boolean
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('gallery_albums')
    .update({ published })
    .eq('id', id);

  if (error) return { error: 'Statusa maiņa neizdevās.' };

  revalidateGallery(id);
  return {};
}

export async function deleteAlbumAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const [{ data: images }, { data: album }] = await Promise.all([
    supabase.from('gallery_images').select('image_key').eq('album_id', id),
    supabase.from('gallery_albums').select('cover_key').eq('id', id).single(),
  ]);

  const { error } = await supabase.from('gallery_albums').delete().eq('id', id);
  if (error) return { error: 'Dzēšana neizdevās.' };

  const keys = new Set<string>();
  if (album?.cover_key) keys.add(album.cover_key);
  for (const img of images ?? []) keys.add(img.image_key);
  await Promise.all([...keys].map((k) => deleteFromR2(k).catch((e) => console.error('R2 delete', k, e))));

  revalidateGallery();
  return {};
}

// ── Image upload / delete / cover ─────────────────────────────────────────────

export async function uploadImagesAction(formData: FormData): Promise<ActionResult> {
  const albumId = (formData.get('album_id') as string | null)?.trim();
  if (!albumId) return { error: 'Albums nav norādīts.' };

  const files = formData.getAll('files') as File[];
  const validFiles = files.filter((f) => f.size > 0);
  if (validFiles.length === 0) return { error: 'Izvēlieties vismaz vienu attēlu.' };

  for (const file of validFiles) {
    if (!ALLOWED_TYPES.has(file.type))
      return { error: `Neatļauts formāts: ${file.name}. Atļauts: JPEG, PNG, WebP, GIF.` };
    if (file.size > MAX_IMAGE_BYTES)
      return { error: `"${file.name}" pārsniedz 10 MB ierobežojumu.` };
  }

  const supabase = await createClient();
  const { data: album } = await supabase
    .from('gallery_albums')
    .select('slug')
    .eq('id', albumId)
    .single();
  if (!album) return { error: 'Albums nav atrasts.' };

  const alt = (formData.get('alt') as string | null)?.trim() ?? '';
  const uploaded: string[] = [];

  try {
    for (const file of validFiles) {
      const key = galleryImageKey(album.slug, file.type);
      await uploadToR2(key, new Uint8Array(await file.arrayBuffer()), file.type);
      uploaded.push(key);
    }
  } catch (e) {
    console.error('R2 upload error', e);
    await Promise.all(uploaded.map((k) => deleteFromR2(k).catch(() => {})));
    return { error: 'Attēlu augšupielāde neizdevās.' };
  }

  const rows = uploaded.map((key, i) => ({
    album_id: albumId,
    image_key: key,
    alt,
    display_order: i,
  }));

  const { error: dbError } = await supabase.from('gallery_images').insert(rows);
  if (dbError) {
    console.error('DB insert error', dbError);
    await Promise.all(uploaded.map((k) => deleteFromR2(k).catch(() => {})));
    return { error: 'Datubāzes ieraksts neizdevās.' };
  }

  revalidateGallery(albumId);
  return {};
}

export async function deleteImageAction(
  id: string,
  imageKey: string,
  albumId: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: album } = await supabase
    .from('gallery_albums')
    .select('cover_key')
    .eq('id', albumId)
    .single();

  const { error } = await supabase.from('gallery_images').delete().eq('id', id);
  if (error) return { error: 'Dzēšana neizdevās.' };

  if (album?.cover_key === imageKey) {
    await supabase.from('gallery_albums').update({ cover_key: null }).eq('id', albumId);
  }

  await deleteFromR2(imageKey).catch((e) => console.error('R2 delete', imageKey, e));

  revalidateGallery(albumId);
  return {};
}

export async function setCoverAction(albumId: string, imageKey: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('gallery_albums')
    .update({ cover_key: imageKey })
    .eq('id', albumId);

  if (error) return { error: 'Vāka iestatīšana neizdevās.' };

  revalidateGallery(albumId);
  return {};
}

// ── Expired albums cleanup ─────────────────────────────────────────────────────

export async function deleteExpiredAlbumsAction(): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: all, error: selectError } = await supabase
    .from('gallery_albums')
    .select('id, event_date, created_at, published');

  if (selectError) return { error: 'Novecojušo albumu meklēšana neizdevās.' };

  const expired = (all ?? []).filter((item) => item.published && isContentExpired(item));
  if (expired.length === 0) return {};

  for (const album of expired) {
    const result = await deleteAlbumAction(album.id);
    if (result.error) return result;
  }

  return {};
}
