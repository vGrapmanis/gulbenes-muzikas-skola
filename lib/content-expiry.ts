// Shared 2-year public-visibility expiry rule for Sasniegumi (achievements)
// and Galerija (gallery albums). Mirrors the RLS predicate in
// supabase/migrations/20260917000001_expire_old_content.sql — keep both in
// sync if this ever changes. See docs/schemas.md "Content expiry".

export const EXPIRY_YEARS = 2;

export type ExpirableContent = {
  event_date: string | null;
  created_at: string;
};

/** The effective date used for expiry: event_date if set, else created_at. */
export function effectiveDate(item: ExpirableContent): Date {
  return new Date(item.event_date ?? item.created_at);
}

/** The instant before which content counts as expired, relative to `now`. */
export function expiryCutoff(now: Date = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setFullYear(cutoff.getFullYear() - EXPIRY_YEARS);
  return cutoff;
}

/** True once an item's effective date is on/before the 2-year cutoff. */
export function isContentExpired(item: ExpirableContent, now: Date = new Date()): boolean {
  return effectiveDate(item) <= expiryCutoff(now);
}
