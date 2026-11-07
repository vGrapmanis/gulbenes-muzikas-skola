import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSupabaseMock, type SupabaseOp } from '@/lib/test-utils/supabase-mock';
import { newAchievementKey, uploadToR2 } from '@/lib/r2';

const deleteFromR2 = vi.fn(async (key: string) => { void key; });
const createClient = vi.fn();

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({ createClient: () => createClient() }));
vi.mock('@/lib/r2', () => ({
  uploadToR2: vi.fn(),
  deleteFromR2: (key: string) => deleteFromR2(key),
  newAchievementKey: vi.fn(),
}));

// jsdom's File doesn't implement arrayBuffer(), and FormData coerces
// non-Blob values to strings — build a minimal FormData stand-in instead,
// exposing only the `.get()` subset the actions actually use.
function photoFile(): File {
  return {
    type: 'image/jpeg',
    size: 1,
    arrayBuffer: async () => new ArrayBuffer(1),
  } as unknown as File;
}

function makeFormData(fields: Record<string, unknown>): FormData {
  return { get: (key: string) => fields[key] ?? null } as unknown as FormData;
}

const NOW = new Date('2026-09-16T12:00:00.000Z');

const ACHIEVEMENTS = [
  { id: 'fresh-1', image_key: 'achievements/2026/fresh.jpg', event_date: '2026-01-01', created_at: '2026-01-01T00:00:00.000Z', published: true },
  { id: 'expired-1', image_key: 'achievements/2020/old.jpg', event_date: '2020-01-01', created_at: '2020-01-01T00:00:00.000Z', published: true },
  { id: 'expired-2', image_key: null, event_date: null, created_at: '2019-06-01T00:00:00.000Z', published: true },
  { id: 'expired-draft', image_key: 'achievements/2019/draft.jpg', event_date: '2019-01-01', created_at: '2019-01-01T00:00:00.000Z', published: false },
];

describe('deleteExpiredAchievementsAction', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    deleteFromR2.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetModules();
  });

  it('deletes only expired achievements and their R2 images', async () => {
    const deletedIds: unknown[] = [];
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        if (op.table !== 'achievements') throw new Error(`unexpected table ${op.table}`);
        if (op.type === 'select') return { data: ACHIEVEMENTS, error: null };
        if (op.type === 'delete') {
          deletedIds.push(...(op.filters.in[0]?.[1] ?? []));
          return { error: null };
        }
        throw new Error(`unexpected op ${op.type}`);
      })
    );

    const { deleteExpiredAchievementsAction } = await import('./actions');
    const result = await deleteExpiredAchievementsAction();

    expect(result.error).toBeUndefined();
    expect(deletedIds.sort()).toEqual(['expired-1', 'expired-2']);
    expect(deleteFromR2).toHaveBeenCalledTimes(1);
    expect(deleteFromR2).toHaveBeenCalledWith('achievements/2020/old.jpg');
  });

  it('never deletes an unpublished draft, even with an old event_date', async () => {
    const deletedIds: unknown[] = [];
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        if (op.table !== 'achievements') throw new Error(`unexpected table ${op.table}`);
        if (op.type === 'select') return { data: ACHIEVEMENTS, error: null };
        if (op.type === 'delete') {
          deletedIds.push(...(op.filters.in[0]?.[1] ?? []));
          return { error: null };
        }
        throw new Error(`unexpected op ${op.type}`);
      })
    );

    const { deleteExpiredAchievementsAction } = await import('./actions');
    await deleteExpiredAchievementsAction();

    expect(deletedIds).not.toContain('expired-draft');
    expect(deleteFromR2).not.toHaveBeenCalledWith('achievements/2019/draft.jpg');
  });

  it('does nothing when no achievements are expired', async () => {
    const deleteOp = vi.fn();
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        if (op.type === 'select') return { data: [ACHIEVEMENTS[0]], error: null };
        deleteOp(op);
        return { error: null };
      })
    );

    const { deleteExpiredAchievementsAction } = await import('./actions');
    const result = await deleteExpiredAchievementsAction();

    expect(result.error).toBeUndefined();
    expect(deleteOp).not.toHaveBeenCalled();
    expect(deleteFromR2).not.toHaveBeenCalled();
  });

  it('surfaces a Latvian error and stops when the lookup query fails', async () => {
    const deleteOp = vi.fn();
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        if (op.type === 'select') return { data: null, error: { message: 'boom' } };
        deleteOp(op);
        return { error: null };
      })
    );

    const { deleteExpiredAchievementsAction } = await import('./actions');
    const result = await deleteExpiredAchievementsAction();

    expect(result.error).toBe('Novecojušo ierakstu meklēšana neizdevās.');
    expect(deleteOp).not.toHaveBeenCalled();
    expect(deleteFromR2).not.toHaveBeenCalled();
  });

  it('surfaces a Latvian error and skips R2 cleanup when the delete fails', async () => {
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        if (op.type === 'select') return { data: ACHIEVEMENTS, error: null };
        if (op.type === 'delete') return { error: { message: 'boom' } };
        throw new Error(`unexpected op ${op.type}`);
      })
    );

    const { deleteExpiredAchievementsAction } = await import('./actions');
    const result = await deleteExpiredAchievementsAction();

    expect(result.error).toBe('Dzēšana neizdevās.');
    expect(deleteFromR2).not.toHaveBeenCalled();
  });
});

describe('createAchievementAction', () => {
  afterEach(() => {
    vi.resetModules();
    vi.mocked(newAchievementKey).mockReset();
    vi.mocked(uploadToR2).mockReset();
  });

  it('rejects a photo upload with no alt text, without inserting or uploading', async () => {
    const insertOp = vi.fn();
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        insertOp(op);
        return { error: null };
      })
    );

    const { createAchievementAction } = await import('./actions');
    const fd = makeFormData({ title: 'Konkurss', image: photoFile() });

    const result = await createAchievementAction(fd);

    expect(result.error).toBe('Alt teksts ir obligāts, ja ir pievienota bilde.');
    expect(insertOp).not.toHaveBeenCalled();
    expect(uploadToR2).not.toHaveBeenCalled();
  });

  it('uploads the photo and stores image_alt when alt text is provided', async () => {
    vi.mocked(newAchievementKey).mockReturnValue('achievements/2026/new.jpg');
    let inserted: Record<string, unknown> | undefined;
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        inserted = op.values as Record<string, unknown>;
        return { error: null };
      })
    );

    const { createAchievementAction } = await import('./actions');
    const fd = makeFormData({
      title: 'Konkurss',
      image: photoFile(),
      image_alt: 'Skolniece saņem diplomu',
    });

    const result = await createAchievementAction(fd);

    expect(result.error).toBeUndefined();
    expect(uploadToR2).toHaveBeenCalledTimes(1);
    expect(inserted?.image_key).toBe('achievements/2026/new.jpg');
    expect(inserted?.image_alt).toBe('Skolniece saņem diplomu');
  });

  it('allows saving without alt text when no photo is attached', async () => {
    let inserted: Record<string, unknown> | undefined;
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        inserted = op.values as Record<string, unknown>;
        return { error: null };
      })
    );

    const { createAchievementAction } = await import('./actions');
    const fd = makeFormData({ title: 'Konkurss' });

    const result = await createAchievementAction(fd);

    expect(result.error).toBeUndefined();
    expect(inserted?.image_key).toBeNull();
    expect(inserted?.image_alt).toBeNull();
  });
});

describe('updateAchievementAction', () => {
  afterEach(() => {
    vi.resetModules();
    vi.mocked(newAchievementKey).mockReset();
    vi.mocked(uploadToR2).mockReset();
  });

  it('rejects clearing alt text while keeping an existing photo', async () => {
    const updateOp = vi.fn();
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        updateOp(op);
        return { error: null };
      })
    );

    const { updateAchievementAction } = await import('./actions');
    const fd = makeFormData({ title: 'Konkurss' });

    const result = await updateAchievementAction('id-1', fd, 'achievements/2026/existing.jpg');

    expect(result.error).toBe('Alt teksts ir obligāts, ja ir pievienota bilde.');
    expect(updateOp).not.toHaveBeenCalled();
  });

  it('persists updated alt text alongside a newly uploaded photo', async () => {
    vi.mocked(newAchievementKey).mockReturnValue('achievements/2026/replacement.jpg');
    let updated: Record<string, unknown> | undefined;
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        updated = op.values as Record<string, unknown>;
        return { error: null };
      })
    );

    const { updateAchievementAction } = await import('./actions');
    const fd = makeFormData({
      title: 'Konkurss',
      image: photoFile(),
      image_alt: 'Jauns apraksts',
    });

    const result = await updateAchievementAction('id-1', fd, 'achievements/2026/old.jpg');

    expect(result.error).toBeUndefined();
    expect(updated?.image_key).toBe('achievements/2026/replacement.jpg');
    expect(updated?.image_alt).toBe('Jauns apraksts');
  });

  it('allows saving without alt text when there is no photo at all', async () => {
    let updated: Record<string, unknown> | undefined;
    createClient.mockReturnValue(
      createSupabaseMock((op: SupabaseOp) => {
        updated = op.values as Record<string, unknown>;
        return { error: null };
      })
    );

    const { updateAchievementAction } = await import('./actions');
    const fd = makeFormData({ title: 'Konkurss' });

    const result = await updateAchievementAction('id-1', fd, null);

    expect(result.error).toBeUndefined();
    expect(updated?.image_alt).toBeNull();
  });
});
