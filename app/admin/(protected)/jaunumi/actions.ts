'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { uploadToR2, deleteFromR2, newNewsKey } from '@/lib/r2';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

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

function revalidate() {
  revalidatePath('/admin/jaunumi');
  revalidatePath('/jaunumi');
}

async function uploadPoster(file: File, label: string): Promise<{ key: string } | { error: string }> {
  if (!ALLOWED_TYPES.has(file.type))
    return { error: `${label}: atļauts tikai JPEG, PNG vai WebP formāts.` };
  if (file.size > MAX_IMAGE_BYTES)
    return { error: `${label}: fails pārsniedz 10 MB ierobežojumu.` };

  const key = newNewsKey(file.type);
  try {
    await uploadToR2(key, new Uint8Array(await file.arrayBuffer()), file.type);
    return { key };
  } catch (e) {
    console.error('R2 upload error', e);
    return { error: `${label}: augšupielāde neizdevās.` };
  }
}

export async function createNewsAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const title = (formData.get('title') as string | null)?.trim();
  if (!title) return { error: 'Nosaukums ir obligāts.' };

  const eventDate = (formData.get('event_date') as string | null)?.trim();
  if (!eventDate) return { error: 'Pasākuma datums ir obligāts.' };

  const landscapeFile = formData.get('poster_landscape') as File | null;
  const portraitFile = formData.get('poster_portrait') as File | null;

  if (!landscapeFile || landscapeFile.size === 0)
    return { error: 'Ainavas plakāts ir obligāts.' };
  if (!portraitFile || portraitFile.size === 0)
    return { error: 'Portreta plakāts ir obligāts.' };

  const landscapeResult = await uploadPoster(landscapeFile, 'Ainavas plakāts');
  if ('error' in landscapeResult) return { error: landscapeResult.error };

  const portraitResult = await uploadPoster(portraitFile, 'Portreta plakāts');
  if ('error' in portraitResult) {
    await deleteFromR2(landscapeResult.key).catch(() => {});
    return { error: portraitResult.error };
  }

  const slug = `${toSlug(title)}-${crypto.randomUUID().slice(0, 8)}`;
  const supabase = await createClient();
  const { error } = await supabase.from('news').insert({
    title,
    slug,
    event_date: eventDate,
    poster_key: landscapeResult.key,
    poster_alt: title,
    poster_portrait_key: portraitResult.key,
    poster_portrait_alt: title,
    published: false,
  });

  if (error) {
    await deleteFromR2(landscapeResult.key).catch(() => {});
    await deleteFromR2(portraitResult.key).catch(() => {});
    console.error('DB insert error', error);
    return { error: 'Ieraksta saglabāšana neizdevās.' };
  }

  revalidate();
  return {};
}

export async function updateNewsAction(
  id: string,
  formData: FormData,
  oldLandscapeKey: string,
  oldPortraitKey: string | null,
): Promise<ActionResult> {
  await requireAdmin();

  const title = (formData.get('title') as string | null)?.trim();
  if (!title) return { error: 'Nosaukums ir obligāts.' };

  const eventDate = (formData.get('event_date') as string | null)?.trim();
  if (!eventDate) return { error: 'Pasākuma datums ir obligāts.' };

  const landscapeFile = formData.get('poster_landscape') as File | null;
  const portraitFile = formData.get('poster_portrait') as File | null;

  let newLandscapeKey: string | null = null;
  let newPortraitKey: string | null = null;

  if (landscapeFile && landscapeFile.size > 0) {
    const result = await uploadPoster(landscapeFile, 'Ainavas plakāts');
    if ('error' in result) return { error: result.error };
    newLandscapeKey = result.key;
  }

  if (portraitFile && portraitFile.size > 0) {
    const result = await uploadPoster(portraitFile, 'Portreta plakāts');
    if ('error' in result) {
      if (newLandscapeKey) await deleteFromR2(newLandscapeKey).catch(() => {});
      return { error: result.error };
    }
    newPortraitKey = result.key;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('news')
    .update({
      title,
      event_date: eventDate,
      poster_alt: title,
      poster_portrait_alt: title,
      ...(newLandscapeKey ? { poster_key: newLandscapeKey } : {}),
      ...(newPortraitKey ? { poster_portrait_key: newPortraitKey } : {}),
    })
    .eq('id', id);

  if (error) {
    if (newLandscapeKey) await deleteFromR2(newLandscapeKey).catch(() => {});
    if (newPortraitKey) await deleteFromR2(newPortraitKey).catch(() => {});
    console.error('DB update error', error);
    return { error: 'Saglabāšana neizdevās.' };
  }

  if (newLandscapeKey) await deleteFromR2(oldLandscapeKey).catch((e) => console.error('R2 delete landscape', e));
  if (newPortraitKey && oldPortraitKey) await deleteFromR2(oldPortraitKey).catch((e) => console.error('R2 delete portrait', e));

  revalidate();
  return {};
}

export async function deleteNewsAction(
  id: string,
  landscapeKey: string,
  portraitKey: string | null,
): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) return { error: 'Dzēšana neizdevās.' };

  await deleteFromR2(landscapeKey).catch((e) => console.error('R2 delete landscape', e));
  if (portraitKey) await deleteFromR2(portraitKey).catch((e) => console.error('R2 delete portrait', e));

  revalidate();
  return {};
}

export async function toggleNewsPublishAction(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from('news')
    .update({
      published,
      ...(published ? { published_at: new Date().toISOString() } : {}),
    })
    .eq('id', id);

  if (error) return { error: 'Statusa maiņa neizdevās.' };

  revalidate();
  return {};
}
