'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { uploadToR2, deleteFromR2, newProgramDocumentKey } from '@/lib/r2';
import type { ProgramDocumentType } from '@/lib/types';

const MAX_FILE_BYTES = 20 * 1024 * 1024;

export type ActionResult = { error?: string };

export async function uploadInstrumentDocumentAction(
  instrumentName: string,
  documentType: ProgramDocumentType,
  formData: FormData
): Promise<ActionResult> {
  const file = formData.get('file') as File | null;

  if (!file || file.size === 0) return { error: 'Lūdzu izvēlieties PDF failu.' };
  if (file.type !== 'application/pdf') return { error: 'Atļauts tikai PDF formāts.' };
  if (file.size > MAX_FILE_BYTES) return { error: 'Fails pārsniedz 20 MB ierobežojumu.' };

  const key = newProgramDocumentKey();
  const bytes = new Uint8Array(await file.arrayBuffer());

  try {
    await uploadToR2(key, bytes, 'application/pdf');
  } catch (e) {
    console.error('R2 upload error', e);
    return { error: 'Failu augšupielāde neizdevās. Pārbaudiet R2 iestatījumus.' };
  }

  const supabase = await createClient();

  // Upsert: if a row already exists for this instrument+type, replace it.
  const { data: existing } = await supabase
    .from('program_documents')
    .select('id, file_key')
    .eq('instrument_name', instrumentName)
    .eq('document_type', documentType)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('program_documents')
      .update({ file_key: key, file_size: file.size })
      .eq('id', existing.id);
    if (error) {
      await deleteFromR2(key).catch(() => {});
      return { error: 'Datubāzes ieraksts neizdevās.' };
    }
    await deleteFromR2(existing.file_key).catch((e) => console.error('R2 old key delete error', e));
  } else {
    const { error } = await supabase.from('program_documents').insert({
      instrument_name: instrumentName,
      document_type: documentType,
      file_key: key,
      file_size: file.size,
    });
    if (error) {
      await deleteFromR2(key).catch(() => {});
      return { error: 'Datubāzes ieraksts neizdevās.' };
    }
  }

  revalidatePath('/admin/uznemsana');
  revalidatePath('/uznemsana');
  return {};
}

export async function deleteInstrumentDocumentAction(id: string, fileKey: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('program_documents').delete().eq('id', id);
  if (error) return { error: 'Dzēšana neizdevās.' };

  await deleteFromR2(fileKey).catch((e) => console.error('R2 delete error', e));

  revalidatePath('/admin/uznemsana');
  revalidatePath('/uznemsana');
  return {};
}
