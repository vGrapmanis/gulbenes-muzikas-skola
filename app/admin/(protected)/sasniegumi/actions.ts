'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { uploadToR2, deleteFromR2, newAchievementKey } from '@/lib/r2';
import { isContentExpired } from '@/lib/content-expiry';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type ActionResult = { error?: string };

function revalidate() {
  revalidatePath('/admin/sasniegumi');
  revalidatePath('/sasniegumi');
}

export async function createAchievementAction(formData: FormData): Promise<ActionResult> {
  const title = (formData.get('title') as string | null)?.trim();
  if (!title) return { error: 'Nosaukums ir obligāts.' };

  const image = formData.get('image') as File | null;
  const imageAlt = (formData.get('image_alt') as string | null)?.trim() || null;
  let imageKey: string | null = null;

  if (image && image.size > 0) {
    if (!imageAlt) return { error: 'Alt teksts ir obligāts, ja ir pievienota bilde.' };
    if (!ALLOWED_TYPES.has(image.type))
      return { error: 'Atļauts tikai JPEG, PNG vai WebP formāts.' };
    if (image.size > MAX_IMAGE_BYTES)
      return { error: 'Attēls pārsniedz 8 MB ierobežojumu.' };

    imageKey = newAchievementKey(image.type);
    try {
      await uploadToR2(imageKey, new Uint8Array(await image.arrayBuffer()), image.type);
    } catch (e) {
      console.error('R2 upload error', e);
      return { error: 'Attēla augšupielāde neizdevās.' };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from('achievements').insert({
    title,
    student_name: '',
    event_date: (formData.get('event_date') as string | null)?.trim() || null,
    description: (formData.get('description') as string | null)?.trim() || null,
    teacher_note: (formData.get('teacher_note') as string | null)?.trim() || null,
    image_key: imageKey,
    image_alt: imageKey ? imageAlt : null,
    published: false,
    display_order: 0,
  });

  if (error) {
    if (imageKey) await deleteFromR2(imageKey).catch(() => {});
    console.error('DB insert error', error);
    return { error: 'Ieraksta saglabāšana neizdevās.' };
  }

  revalidate();
  return {};
}

export async function updateAchievementAction(
  id: string,
  formData: FormData,
  oldImageKey: string | null
): Promise<ActionResult> {
  const title = (formData.get('title') as string | null)?.trim();
  if (!title) return { error: 'Nosaukums ir obligāts.' };

  const image = formData.get('image') as File | null;
  const imageAlt = (formData.get('image_alt') as string | null)?.trim() || null;
  const hasImage = (image && image.size > 0) || !!oldImageKey;
  if (hasImage && !imageAlt) {
    return { error: 'Alt teksts ir obligāts, ja ir pievienota bilde.' };
  }

  let newImageKey: string | null = null;

  if (image && image.size > 0) {
    if (!ALLOWED_TYPES.has(image.type))
      return { error: 'Atļauts tikai JPEG, PNG vai WebP formāts.' };
    if (image.size > MAX_IMAGE_BYTES)
      return { error: 'Attēls pārsniedz 8 MB ierobežojumu.' };

    newImageKey = newAchievementKey(image.type);
    try {
      await uploadToR2(newImageKey, new Uint8Array(await image.arrayBuffer()), image.type);
    } catch (e) {
      console.error('R2 upload error', e);
      return { error: 'Attēla augšupielāde neizdevās.' };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('achievements')
    .update({
      title,
      event_date: (formData.get('event_date') as string | null)?.trim() || null,
      description: (formData.get('description') as string | null)?.trim() || null,
      teacher_note: (formData.get('teacher_note') as string | null)?.trim() || null,
      image_alt: hasImage ? imageAlt : null,
      ...(newImageKey ? { image_key: newImageKey } : {}),
    })
    .eq('id', id);

  if (error) {
    if (newImageKey) await deleteFromR2(newImageKey).catch(() => {});
    console.error('DB update error', error);
    return { error: 'Saglabāšana neizdevās.' };
  }

  if (newImageKey && oldImageKey) {
    await deleteFromR2(oldImageKey).catch((e) => console.error('R2 delete old', e));
  }

  revalidate();
  return {};
}

export async function deleteAchievementAction(
  id: string,
  imageKey: string | null
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('achievements').delete().eq('id', id);
  if (error) return { error: 'Dzēšana neizdevās.' };

  if (imageKey) await deleteFromR2(imageKey).catch((e) => console.error('R2 delete', e));

  revalidate();
  return {};
}

export async function toggleAchievementPublishAction(
  id: string,
  published: boolean
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('achievements').update({ published }).eq('id', id);
  if (error) return { error: 'Statusa maiņa neizdevās.' };

  revalidate();
  return {};
}

export async function deleteExpiredAchievementsAction(): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: all, error: selectError } = await supabase
    .from('achievements')
    .select('id, image_key, event_date, created_at');

  if (selectError) return { error: 'Novecojušo ierakstu meklēšana neizdevās.' };

  const expired = (all ?? []).filter((item) => isContentExpired(item));
  if (expired.length === 0) return {};

  const { error: deleteError } = await supabase
    .from('achievements')
    .delete()
    .in('id', expired.map((e) => e.id));

  if (deleteError) return { error: 'Dzēšana neizdevās.' };

  await Promise.all(
    expired
      .filter((e) => e.image_key)
      .map((e) => deleteFromR2(e.image_key as string).catch((err) => console.error('R2 delete', err)))
  );

  revalidate();
  return {};
}
