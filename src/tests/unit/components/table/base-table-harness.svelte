<script lang="ts">
  import type { ColumnDef } from '@tanstack/table-core';
  import { createTable } from '$lib/components/table/helpers.svelte';
  import BaseTable from '$lib/components/table/base-table.svelte';

  // Builds a real tanstack table (createTable uses $effect.pre, so it must run
  // inside a component) and renders BaseTable with it. Types are intentionally
  // loose so tests can pass any row shape without fighting generic inference
  // through `@testing-library`'s `render`.
  interface Props {
    data: unknown[];
    // oxlint-disable-next-line no-explicit-any
    columns: ColumnDef<any>[];
    filterColumn?: string;
    hideFilter?: boolean;
    isLoading?: boolean;
    class?: string;
  }

  let {
    data,
    columns,
    filterColumn = 'name',
    hideFilter,
    isLoading,
    class: className
  }: Props = $props();

  // A real substring filter so the filter input can be exercised.
  const filterFn = (
    row: { getValue: (k: string) => unknown },
    _id: string,
    value: unknown
  ) =>
    String(row.getValue('name') ?? '')
      .toLowerCase()
      .includes(String(value ?? '').toLowerCase());

  let table = $derived(createTable(data, columns, filterFn as never));
</script>

<BaseTable {table} {filterColumn} {hideFilter} {isLoading} class={className} />
