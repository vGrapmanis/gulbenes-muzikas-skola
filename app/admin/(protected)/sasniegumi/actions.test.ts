import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSupabaseMock, type SupabaseOp } from '@/lib/test-utils/supabase-mock';

const deleteFromR2 = vi.fn(async (key: string) => { void key; });
const createClient = vi.fn();

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({ createClient: () => createClient() }));
vi.mock('@/lib/r2', () => ({
  uploadToR2: vi.fn(),
  deleteFromR2: (key: string) => deleteFromR2(key),
  newAchievementKey: vi.fn(),
}));

const NOW = new Date('2026-09-16T12:00:00.000Z');

const ACHIEVEMENTS = [
  { id: 'fresh-1', image_key: 'achievements/2026/fresh.jpg', event_date: '2026-01-01', created_at: '2026-01-01T00:00:00.000Z' },
  { id: 'expired-1', image_key: 'achievements/2020/old.jpg', event_date: '2020-01-01', created_at: '2020-01-01T00:00:00.000Z' },
  { id: 'expired-2', image_key: null, event_date: null, created_at: '2019-06-01T00:00:00.000Z' },
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
