// NEXT_PUBLIC_* values are inlined at build time. Default to the same-origin
// R2 proxy route so a local build can never bake in a localhost URL.
const DEFAULT_MEDIA_BASE = '/api/media';

export function mediaUrl(key: string): string {
  const base = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || DEFAULT_MEDIA_BASE).replace(/\/$/, '');
  return `${base}/${key}`;
}
