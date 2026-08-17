import type { RowData } from '@tanstack/svelte-table';
import {
  type DefaultTableFeatures,
  type TableColumnDef,
  type TableInstance,
  type TableRow,
  createTable
} from '$lib/components/table/helpers.svelte';

// `createTable` -> `createSvelteTable` uses `$effect.pre`, so it must be
// Constructed inside an effect context. This `.svelte.ts` harness wraps it in
// An `$effect.root` (kept alive) so plain `.spec.ts` files can drive it.
export interface TableHarness<
  C extends RowData,
  F extends DefaultTableFeatures = DefaultTableFeatures
> {
  table: TableInstance<C, F>;
  cleanup: () => void;
}

export const makeTable = <
  C extends RowData,
  F extends DefaultTableFeatures = DefaultTableFeatures
>(
  data: C[],
  columns: TableColumnDef<C, F>[],
  filterFn: (
    row: TableRow<C, F>,
    id: string,
    filterValues: unknown
  ) => boolean = () => true,
  features?: F
): TableHarness<C, F> => {
  let table!: TableInstance<C, F>;
  const cleanup = $effect.root(() => {
    table = createTable(data, columns, filterFn, features);
  });
  return { cleanup, table };
};
