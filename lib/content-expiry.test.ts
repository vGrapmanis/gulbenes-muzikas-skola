import { describe, expect, it } from 'vitest';
import { EXPIRY_YEARS, effectiveDate, expiryCutoff, isContentExpired } from './content-expiry';

const NOW = new Date('2026-09-16T12:00:00.000Z');

describe('effectiveDate', () => {
  it('uses event_date when set', () => {
    const item = { event_date: '2020-01-01', created_at: '2025-01-01T00:00:00.000Z' };
    expect(effectiveDate(item)).toEqual(new Date('2020-01-01'));
  });

  it('falls back to created_at when event_date is null', () => {
    const item = { event_date: null, created_at: '2025-01-01T00:00:00.000Z' };
    expect(effectiveDate(item)).toEqual(new Date('2025-01-01T00:00:00.000Z'));
  });
});

describe('expiryCutoff', () => {
  it('is exactly EXPIRY_YEARS before `now`', () => {
    const cutoff = expiryCutoff(NOW);
    expect(cutoff.getUTCFullYear()).toBe(NOW.getUTCFullYear() - EXPIRY_YEARS);
    expect(cutoff.getUTCMonth()).toBe(NOW.getUTCMonth());
    expect(cutoff.getUTCDate()).toBe(NOW.getUTCDate());
  });

  it('defaults to the current time when no `now` is given', () => {
    const before = Date.now();
    const cutoff = expiryCutoff();
    const after = Date.now();
    expect(cutoff.getTime()).toBeGreaterThanOrEqual(before - 365 * 2 * 24 * 60 * 60 * 1000 - 1000);
    expect(cutoff.getTime()).toBeLessThanOrEqual(after - 365 * 2 * 24 * 60 * 60 * 1000 + 1000);
  });
});

describe('isContentExpired', () => {
  it('is not expired when event_date is recent', () => {
    const item = { event_date: '2026-09-01', created_at: '2020-01-01T00:00:00.000Z' };
    expect(isContentExpired(item, NOW)).toBe(false);
  });

  it('is expired when event_date is more than 2 years old', () => {
    const item = { event_date: '2024-09-01', created_at: '2026-01-01T00:00:00.000Z' };
    expect(isContentExpired(item, NOW)).toBe(true);
  });

  it('treats the exact 2-year boundary as expired (inclusive cutoff)', () => {
    const item = { event_date: '2024-09-16', created_at: '2024-09-16T12:00:00.000Z' };
    expect(isContentExpired(item, NOW)).toBe(true);
  });

  it('is not expired one day before the 2-year boundary', () => {
    const item = { event_date: '2024-09-17', created_at: '2024-09-17T12:00:00.000Z' };
    expect(isContentExpired(item, NOW)).toBe(false);
  });

  it('falls back to created_at when event_date is null', () => {
    const expired = { event_date: null, created_at: '2024-01-01T00:00:00.000Z' };
    const fresh = { event_date: null, created_at: '2026-01-01T00:00:00.000Z' };
    expect(isContentExpired(expired, NOW)).toBe(true);
    expect(isContentExpired(fresh, NOW)).toBe(false);
  });

  it('prefers event_date over created_at even when created_at is old', () => {
    // admin backfilled an old achievement today but gave it a recent event_date
    const item = { event_date: '2026-09-01', created_at: '2019-01-01T00:00:00.000Z' };
    expect(isContentExpired(item, NOW)).toBe(false);
  });

  it('never expires a future-dated item', () => {
    const item = { event_date: '2030-01-01', created_at: '2026-01-01T00:00:00.000Z' };
    expect(isContentExpired(item, NOW)).toBe(false);
  });
});
