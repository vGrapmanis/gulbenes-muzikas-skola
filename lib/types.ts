// Convenience row-type aliases derived from the generated Database type.
// This file is safe to keep — it is NOT overwritten by `pnpm db:types`.
import type { Database } from '@/lib/database.types';

type Tables = Database['public']['Tables'];

export type Page          = Tables['pages']['Row'];
export type Graduate      = Tables['graduates']['Row'];
export type NewsItem      = Tables['news']['Row'];
export type Achievement   = Tables['achievements']['Row'];
export type GalleryAlbum  = Tables['gallery_albums']['Row'];
export type GalleryImage  = Tables['gallery_images']['Row'];
export type Document      = Tables['documents']['Row'];
