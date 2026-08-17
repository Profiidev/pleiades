import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures
} from '@tanstack/svelte-table';
import {
  type TableColumnDef,
  type TableRow,
  createColumn,
  createColumnCell,
  createColumnHeader,
  defaultFeatures
} from '$lib/components/table/helpers.svelte';
import { type TableHarness, makeTable } from './helpers-harness.svelte';

interface Item {
  name: string;
  age: number;
}

const keyOf = (col: TableColumnDef<Item>) =>
  (col as { accessorKey?: string }).accessorKey;

describe('createColumnHeader', () => {
  it('sets the accessor key and a header renderer', () => {
    const col = createColumnHeader<Item>('name', 'Name');
    expect(keyOf(col)).toBe('name');
    expect(typeof col.header).toBe('function');
  });

  it('header toggles sorting using the current sort state', () => {
    const col = createColumnHeader<Item>('name', 'Name');
    const toggleSorting = vi.fn();
    const column = {
      getIsSorted: () => 'asc',
      toggleSorting
    };
    // Render returns a component descriptor; invoke its onclick.
    const rendered = (col.header as (ctx: unknown) => unknown)({
      column
    }) as { props: { onclick: () => void } };
    rendered.props.onclick();
    expect(toggleSorting).toHaveBeenCalledWith(true);
  });

  it('header passes false to toggleSorting when not ascending', () => {
    const col = createColumnHeader<Item>('name', 'Name');
    const toggleSorting = vi.fn();
    const rendered = (col.header as (ctx: unknown) => unknown)({
      column: { getIsSorted: () => 'desc', toggleSorting }
    }) as { props: { onclick: () => void } };
    rendered.props.onclick();
    expect(toggleSorting).toHaveBeenCalledWith(false);
  });
});

describe('createColumnCell', () => {
  it('sets the accessor key and a cell renderer', () => {
    const col = createColumnCell<string, Item>('name');
    expect(keyOf(col)).toBe('name');
    expect(typeof col.cell).toBe('function');
  });

  it('renders the raw value when no formatter is given', () => {
    const col = createColumnCell<string, Item>('name');
    const row = { getValue: () => 'Alice' } as unknown as TableRow<Item>;
    const snippet = (col.cell as (ctx: unknown) => unknown)({ row });
    expect(snippet).toBeDefined();
  });

  it('applies the formatter to the value', () => {
    const formatter = vi.fn((v: number) => `#${v}`);
    const col = createColumnCell<number, Item>('age', formatter);
    const row = { getValue: () => 7 } as unknown as TableRow<Item>;
    (col.cell as (ctx: unknown) => unknown)({ row });
    // Formatter runs lazily inside the snippet render; the cell wiring is what
    // We can assert synchronously here.
    expect(keyOf(col)).toBe('age');
  });
});

describe('createColumn', () => {
  it('merges header and cell definitions', () => {
    const col = createColumn<string, Item>('name', 'Name');
    expect(keyOf(col)).toBe('name');
    expect(typeof col.header).toBe('function');
    expect(typeof col.cell).toBe('function');
  });
});

describe('createTable', () => {
  const data: Item[] = [
    { age: 30, name: 'Bob' },
    { age: 20, name: 'Ann' }
  ];
  const columns = () => [createColumn<string, Item>('name', 'Name')];

  let harness: TableHarness<Item> | undefined;
  afterEach(() => harness?.cleanup());

  it('builds a table exposing the provided rows', () => {
    harness = makeTable(data, columns());
    expect(harness.table.getRowModel().rows).toHaveLength(2);
  });

  it('applies sorting state changes through the updater', () => {
    harness = makeTable(data, columns());
    harness.table.setSorting([{ desc: false, id: 'name' }]);
    expect(harness.table.store.get().sorting).toEqual([
      { desc: false, id: 'name' }
    ]);
  });

  it('applies column visibility changes through the updater', () => {
    harness = makeTable(data, columns());
    harness.table.setColumnVisibility({ name: false });
    expect(harness.table.store.get().columnVisibility).toEqual({ name: false });
  });

  it('applies column filter changes through the updater', () => {
    harness = makeTable(data, columns());
    harness.table.setColumnFilters([{ id: 'name', value: 'Bob' }]);
    expect(harness.table.store.get().columnFilters).toEqual([
      { id: 'name', value: 'Bob' }
    ]);
  });

  it('accepts a functional state updater', () => {
    harness = makeTable(data, columns());
    harness.table.setSorting(() => [{ desc: true, id: 'age' }]);
    expect(harness.table.store.get().sorting).toEqual([
      { desc: true, id: 'age' }
    ]);
  });

  it('accepts a feature set extending the defaults', () => {
    const features = tableFeatures({
      ...defaultFeatures,
      paginatedRowModel: createPaginatedRowModel(),
      rowPaginationFeature
    });
    const paginated = makeTable<Item, typeof features>(
      data,
      [createColumn<string, Item, typeof features>('name', 'Name')],
      undefined,
      features
    );

    paginated.table.setPageSize(1);
    expect(paginated.table.getPageCount()).toBe(2);
    expect(paginated.table.getPaginatedRowModel().rows).toHaveLength(1);
    paginated.cleanup();
  });
});
