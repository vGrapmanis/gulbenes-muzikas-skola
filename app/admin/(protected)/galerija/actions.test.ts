import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSupabaseMock, type SupabaseOp } from '@/lib/test-utils/supabase-mock';

const deleteFromR2 = vi.fn(async (key: string) => { void key; });
const createClient = vi.fn();

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({ createClient: () => createClient() }));
vi.mock('@/lib/r2', () => ({
  uploadToR2: vi.fn(),
  deleteFromR2: (key: string) => deleteFromR2(key),
}));

const NOW = new Date('2026-09-16T12:00:00.000Z');

const ALBUMS = [
  { id: 'fresh-1', event_date: '2026-01-01', created_at: '2026-01-01T00:00:00.000Z' },
  { id: 'expired-1', event_date: '2020-01-01', created_at: '2020-01-01T00:00:00.000Z' },
  { id: 'expired-2', event_date: null, created_at: '2019-06-01T00:00:00.000Z' },
];

const ALBUM_COVERS: Record<string, string | null> = {
  'expired-1': 'gallery/expired-1/cover.jpg',
  'expired-2': null,
};

const ALBUM_IMAGES: Record<string, string[]> = {
  'expired-1': ['gallery/expired-1/a.jpg', 'gallery/expired-1/b.jpg'],
  'expired-2': [],
};

/** Mirrors the multi-table chain deleteAlbumAction() drives for each expired album. */
function makeGalleryHandler() {
  const deletedAlbumIds: string[] = [];

  const handler = (op: SupabaseOp) => {
    if (op.table === 'gallery_albums') {
      if (op.type === 'select' && op.filters.eq.length === 0) {
        return { data: ALBUMS, error: null };
      }
      if (op.type === 'select' && op.single) {
        const id = op.filters.eq.find(([col]) => col === 'id')?.[1] as string;
        return { data: { cover_key: ALBUM_COVERS[id] ?? null }, error: null };
      }
      if (op.type === 'delete') {
        const id = op.filters.eq.find(([col]) => col === 'id')?.[1] as string;
        deletedAlbumIds.push(id);
        return { error: null };
      }
    }
    if (op.table === 'gallery_images' && op.type === 'select') {
      const albumId = op.filters.eq.find(([col]) => col === 'album_id')?.[1] as string;
      return { data: (ALBUM_IMAGES[albumId] ?? []).map((image_key) => ({ image_key })), error: null };
    }
    throw new Error(`unexpected op ${JSON.stringify(op)}`);
  };

  return { handler, deletedAlbumIds };
}

describe('deleteExpiredAlbumsAction', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    deleteFromR2.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetModules();
  });

  it('cascades: deletes expired albums, their images, and covers from R2', async () => {
    const { handler, deletedAlbumIds } = makeGalleryHandler();
    createClient.mockReturnValue(createSupabaseMock(handler));

    const { deleteExpiredAlbumsAction } = await import('./actions');
    const result = await deleteExpiredAlbumsAction();

    expect(result.error).toBeUndefined();
    expect(deletedAlbumIds.sort()).toEqual(['expired-1', 'expired-2']);

    const deletedKeys = deleteFromR2.mock.calls.map((call) => call[0]).sort();
    expect(deletedKeys).toEqual([
      'gallery/expired-1/a.jpg',
      'gallery/expired-1/b.jpg',
      'gallery/expired-1/cover.jpg',
    ]);
  });

  it('leaves the non-expired album untouched', async () => {
    const { handler, deletedAlbumIds } = makeGalleryHandler();
    createClient.mockReturnValue(createSupabaseMock(handler));

    const { deleteExpiredAlbumsAction } = await import('./actions');
    await deleteExpiredAlbumsAction();

    expect(deletedAlbumIds).not.toContain('fresh-1');
  });

  it('does nothing when no albums are expired', async () => {
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        if (op.table === 'gallery_albums' && op.type === 'select' && op.filters.eq.length === 0) {
          return { data: [ALBUMS[0]], error: null };
        }
        throw new Error(`unexpected op ${JSON.stringify(op)}`);
      })
    );

    const { deleteExpiredAlbumsAction } = await import('./actions');
    const result = await deleteExpiredAlbumsAction();

    expect(result.error).toBeUndefined();
    expect(deleteFromR2).not.toHaveBeenCalled();
  });

  it('surfaces a Latvian error when the lookup query fails', async () => {
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        if (op.type === 'select' && op.filters.eq.length === 0) {
          return { data: null, error: { message: 'boom' } };
        }
        throw new Error(`unexpected op ${JSON.stringify(op)}`);
      })
    );

    const { deleteExpiredAlbumsAction } = await import('./actions');
    const result = await deleteExpiredAlbumsAction();

    expect(result.error).toBe('Novecojušo albumu meklēšana neizdevās.');
    expect(deleteFromR2).not.toHaveBeenCalled();
  });

  it('stops and surfaces the error if deleting one expired album fails', async () => {
    const handler = (op: SupabaseOp) => {
      if (op.table === 'gallery_albums') {
        if (op.type === 'select' && op.filters.eq.length === 0) return { data: ALBUMS, error: null };
        if (op.type === 'select' && op.single) return { data: { cover_key: null }, error: null };
        if (op.type === 'delete') return { error: { message: 'boom' } };
      }
      if (op.table === 'gallery_images' && op.type === 'select') return { data: [], error: null };
      throw new Error(`unexpected op ${JSON.stringify(op)}`);
    };
    createClient.mockReturnValue(createSupabaseMock(handler));

    const { deleteExpiredAlbumsAction } = await import('./actions');
    const result = await deleteExpiredAlbumsAction();

    expect(result.error).toBe('Dzēšana neizdevās.');
  });
});
