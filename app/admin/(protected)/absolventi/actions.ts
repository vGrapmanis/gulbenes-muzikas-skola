'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { uploadToR2, deleteFromR2, newGraduateClassKey } from '@/lib/r2';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type ActionResult = { error?: string };

function revalidate() {
  revalidatePath('/admin/absolventi');
  revalidatePath('/absolventi');
}

export async function createGraduateClassAction(formData: FormData): Promise<ActionResult> {
  const title = (formData.get('title') as string | null)?.trim();
  if (!title) return { error: 'Nosaukums ir obligāts.' };

  const image = formData.get('image') as File | null;
  let imageKey: string | null = null;

  if (image && image.size > 0) {
    if (!ALLOWED_TYPES.has(image.type))
      return { error: 'Atļauts tikai JPEG, PNG vai WebP formāts.' };
    if (image.size > MAX_IMAGE_BYTES)
      return { error: 'Attēls pārsniedz 8 MB ierobežojumu.' };

    imageKey = newGraduateClassKey(image.type);
    try {
      await uploadToR2(imageKey, new Uint8Array(await image.arrayBuffer()), image.type);
    } catch (e) {
      console.error('R2 upload error', e);
      return { error: 'Attēla augšupielāde neizdevās.' };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from('graduate_classes').insert({
    title,
    image_key: imageKey,
    image_alt: (formData.get('image_alt') as string | null)?.trim() ?? '',
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

export async function updateGraduateClassAction(
  id: string,
  formData: FormData,
  oldImageKey: string | null
): Promise<ActionResult> {
  const title = (formData.get('title') as string | null)?.trim();
  if (!title) return { error: 'Nosaukums ir obligāts.' };

  const image = formData.get('image') as File | null;
  let newImageKey: string | null = null;

  if (image && image.size > 0) {
    if (!ALLOWED_TYPES.has(image.type))
      return { error: 'Atļauts tikai JPEG, PNG vai WebP formāts.' };
    if (image.size > MAX_IMAGE_BYTES)
      return { error: 'Attēls pārsniedz 8 MB ierobežojumu.' };

    newImageKey = newGraduateClassKey(image.type);
    try {
      await uploadToR2(newImageKey, new Uint8Array(await image.arrayBuffer()), image.type);
    } catch (e) {
      console.error('R2 upload error', e);
      return { error: 'Attēla augšupielāde neizdevās.' };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('graduate_classes')
    .update({
      title,
      image_alt: (formData.get('image_alt') as string | null)?.trim() ?? '',
      ...(newImageKey ? { image_key: newImageKey } : {}),
      updated_at: new Date().toISOString(),
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

export async function deleteGraduateClassAction(
  id: string,
  imageKey: string | null
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('graduate_classes').delete().eq('id', id);
  if (error) return { error: 'Dzēšana neizdevās.' };

  if (imageKey) await deleteFromR2(imageKey).catch((e) => console.error('R2 delete', e));

  revalidate();
  return {};
}

export async function toggleGraduateClassPublishAction(
  id: string,
  published: boolean
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('graduate_classes')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { error: 'Statusa maiņa neizdevās.' };

  revalidate();
  return {};
}
