// Convenience row-type aliases derived from the generated Database type.
// This file is safe to keep — it is NOT overwritten by `pnpm db:types`.
import type { Database } from '@/lib/database.types';

type Tables = Database['public']['Tables'];

export type Page           = Tables['pages']['Row'];
export type NewsItem       = Tables['news']['Row'];
export type Achievement    = Tables['achievements']['Row'];
export type GalleryAlbum   = Tables['gallery_albums']['Row'];
export type GalleryImage   = Tables['gallery_images']['Row'];
export type Document       = Tables['documents']['Row'];
export type ProgramDocument = Tables['program_documents']['Row'];

export const PROGRAM_DOCUMENT_TYPES = [
  { key: 'izglitibas_programa',       label: 'Izglītības programma' },
  { key: 'macibu_prieksmeta_programa', label: 'Mācību priekšmeta programma' },
] as const;

export type ProgramDocumentType = typeof PROGRAM_DOCUMENT_TYPES[number]['key'];
