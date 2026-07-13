'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { uploadToR2, deleteFromR2, newDocumentKey } from '@/lib/r2';

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

export type ActionResult = { error?: string };

export async function uploadDocumentAction(formData: FormData): Promise<ActionResult> {
  const title = (formData.get('title') as string | null)?.trim();
  const file = formData.get('file') as File | null;

  if (!title) return { error: 'Nosaukums ir obligāts.' };
  if (!file || file.size === 0) return { error: 'Lūdzu izvēlieties PDF failu.' };
  if (file.type !== 'application/pdf') return { error: 'Atļauts tikai PDF formāts.' };
  if (file.size > MAX_FILE_BYTES) return { error: 'Fails pārsniedz 20 MB ierobežojumu.' };

  const key = newDocumentKey();
  const bytes = new Uint8Array(await file.arrayBuffer());

  try {
    await uploadToR2(key, bytes, 'application/pdf');
  } catch (e) {
    console.error('R2 upload error', e);
    return { error: 'Failu augšupielāde neizdevās. Pārbaudiet R2 iestatījumus.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('documents').insert({
    title,
    file_key: key,
    file_size: file.size,
    published: true,
    display_order: 0,
  });

  if (error) {
    // Best-effort cleanup of the orphaned R2 object.
    await deleteFromR2(key).catch(() => {});
    console.error('Supabase insert error', error);
    return { error: 'Datubāzes ieraksts neizdevās.' };
  }

  revalidatePath('/admin/dokumenti');
  revalidatePath('/dokumenti');
  return {};
}

export async function deleteDocumentAction(id: string, fileKey: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) return { error: 'Dzēšana neizdevās.' };

  await deleteFromR2(fileKey).catch((e) => console.error('R2 delete error', e));

  revalidatePath('/admin/dokumenti');
  revalidatePath('/dokumenti');
  return {};
}

export async function togglePublishAction(id: string, published: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('documents')
    .update({ published })
    .eq('id', id);
  if (error) return { error: 'Statusa maiņa neizdevās.' };

  revalidatePath('/admin/dokumenti');
  revalidatePath('/dokumenti');
  return {};
}

export async function updateDocumentMetaAction(
  id: string,
  data: { title: string; category?: string; description?: string; display_order: number }
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('documents')
    .update({
      title: data.title,
      category: data.category || null,
      description: data.description || null,
      display_order: data.display_order,
    })
    .eq('id', id);
  if (error) return { error: 'Saglabāšana neizdevās.' };

  revalidatePath('/admin/dokumenti');
  revalidatePath('/dokumenti');
  return {};
}
