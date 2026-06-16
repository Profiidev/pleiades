import type { ColumnDef, Row, Table } from '@tanstack/table-core';
import { createTable } from '$lib/components/table/helpers.svelte';

// `createTable` -> `createSvelteTable` uses `$effect.pre`, so it must be
// Constructed inside an effect context. This `.svelte.ts` harness wraps it in
// An `$effect.root` (kept alive) so plain `.spec.ts` files can drive it.
export interface TableHarness<C> {
  table: Table<C>;
  cleanup: () => void;
}

export const makeTable = <C>(
  data: C[],
  columns: ColumnDef<C>[],
  filterFn: (row: Row<C>, id: string, filterValues: unknown) => boolean = () =>
    true
): TableHarness<C> => {
  let table!: Table<C>;
  const cleanup = $effect.root(() => {
    table = createTable(data, columns, filterFn);
  });
  return { cleanup, table };
};
