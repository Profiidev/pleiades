import {
  type ColumnDef,
  type Row,
  type RowData,
  type Table,
  type TableOptions,
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createSortedRowModel,
  createTable as createSvelteTable,
  filterFn_includesString,
  renderComponent,
  renderSnippet,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures
} from '@tanstack/svelte-table';
import { createRawSnippet } from 'svelte';
import TableHead from './table-head.svelte';

export const defaultFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  filterFns: {
    includesString: filterFn_includesString
  },
  filteredRowModel: createFilteredRowModel(),
  rowSelectionFeature,
  rowSortingFeature,
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text
  },
  sortedRowModel: createSortedRowModel()
});

export type DefaultTableFeatures = typeof defaultFeatures;

export type TableColumnDef<
  C extends RowData,
  F extends DefaultTableFeatures = DefaultTableFeatures
> = ColumnDef<F, C>;
export type TableRow<
  C extends RowData,
  F extends DefaultTableFeatures = DefaultTableFeatures
> = Row<F, C>;
export type TableInstance<
  C extends RowData,
  F extends DefaultTableFeatures = DefaultTableFeatures
> = Table<F, C>;

// Required because of tanstack idk
const widen = <C extends RowData, F extends DefaultTableFeatures>(
  def: TableColumnDef<C>
): TableColumnDef<C, F> =>
  // oxlint-disable-next-line no-unsafe-type-assertion
  def as TableColumnDef<C, F>;

export const createColumnHeader = <
  C extends RowData,
  F extends DefaultTableFeatures = DefaultTableFeatures
>(
  key: string,
  title: string
): TableColumnDef<C, F> =>
  widen<C, F>({
    accessorKey: key,
    header: ({ column }) =>
      renderComponent(TableHead, {
        onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        title
      })
  });

export const createColumnCell = <
  // oxlint-disable-next-line no-unnecessary-type-parameters
  T,
  C extends RowData,
  F extends DefaultTableFeatures = DefaultTableFeatures
>(
  key: string,
  formatter?: (value: T) => string
): TableColumnDef<C, F> =>
  widen<C, F>({
    accessorKey: key,
    cell: ({ row }) => {
      const value_raw: T = row.getValue(key);
      const valueSnippet = createRawSnippet<[T]>(() => {
        let value = '';
        if (formatter) {
          value = formatter(value_raw);
        } else {
          // oxlint-disable-next-line no-unsafe-type-assertion
          value = value_raw as string;
        }

        return {
          render: () =>
            `<div class="ml-4 truncate h-full w-full text-wrap">${value}</div>`
        };
      });

      return renderSnippet(valueSnippet);
    }
  });

export const createColumn = <
  // oxlint-disable-next-line no-unnecessary-type-parameters
  T,
  C extends RowData,
  F extends DefaultTableFeatures = DefaultTableFeatures
>(
  key: string,
  title: string,
  formatter?: (value: T) => string
): TableColumnDef<C, F> => ({
  ...createColumnHeader<C, F>(key, title),
  ...createColumnCell<T, C, F>(key, formatter)
});

export const createTable = <
  C extends RowData,
  F extends DefaultTableFeatures = DefaultTableFeatures
>(
  data: C[],
  columns: TableColumnDef<C, F>[],
  filterFn?: (row: TableRow<C, F>, id: string, filterValues: any) => boolean,
  // oxlint-disable-next-line no-unsafe-type-assertion
  features: F = defaultFeatures as F
): TableInstance<C, F> => {
  const options = {
    columns,
    data,
    defaultColumn: {
      enableSorting: true,
      filterFn
    },
    features
  };

  // Required because of tanstack idk
  // oxlint-disable-next-line no-unsafe-type-assertion
  return createSvelteTable(options as unknown as TableOptions<F, C>);
};
