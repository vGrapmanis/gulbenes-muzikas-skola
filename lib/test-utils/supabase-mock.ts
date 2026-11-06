// Minimal fake Supabase query builder for unit-testing server actions without
// a real database. Supports the small subset of the PostgREST chain our
// actions use: from().select()/.delete()/.update()/.insert(), .eq(), .in(),
// .single(), and awaiting the chain directly (thenable).

export type SupabaseOp = {
  type: 'select' | 'delete' | 'update' | 'insert';
  table: string;
  columns?: string;
  values?: unknown;
  filters: { eq: Array<[string, unknown]>; in: Array<[string, unknown[]]> };
  single: boolean;
};

export type SupabaseOpResult = { data?: unknown; error?: unknown };

export function createSupabaseMock(handler: (op: SupabaseOp) => SupabaseOpResult) {
  function builder(table: string) {
    const op: SupabaseOp = { type: 'select', table, filters: { eq: [], in: [] }, single: false };

    const chain = {
      select(columns?: string) {
        op.type = 'select';
        op.columns = columns;
        return chain;
      },
      delete() {
        op.type = 'delete';
        return chain;
      },
      update(values: unknown) {
        op.type = 'update';
        op.values = values;
        return chain;
      },
      insert(values: unknown) {
        op.type = 'insert';
        op.values = values;
        return chain;
      },
      eq(column: string, value: unknown) {
        op.filters.eq.push([column, value]);
        return chain;
      },
      in(column: string, values: unknown[]) {
        op.filters.in.push([column, values]);
        return chain;
      },
      single() {
        op.single = true;
        return chain;
      },
      then(
        onFulfilled?: ((value: SupabaseOpResult) => unknown) | null,
        onRejected?: ((reason: unknown) => unknown) | null
      ) {
        return Promise.resolve(handler(op)).then(onFulfilled, onRejected);
      },
    };

    return chain;
  }

  return { from: builder };
}
