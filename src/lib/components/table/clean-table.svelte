<script lang="ts" generics="T extends RowData, CD">
  import {
    type TableColumnDef,
    createTable
  } from '$lib/components/table/helpers.svelte';
  import BaseTable from './base-table.svelte';
  import type { RowData } from '@tanstack/svelte-table';
  import Input from '../ui/input/input.svelte';

  type Props = {
    data?: T[] | Promise<T[] | undefined>;
    class?: string;
    searchColumns?: (keyof T)[];
  } & (
    | {
        columns: (columnData: CD) => TableColumnDef<T>[];
        columnData: CD;
      }
    | {
        columns: () => TableColumnDef<T>[];
        columnData?: undefined;
      }
  );

  let {
    class: className,
    data,
    columns,
    columnData,
    searchColumns
  }: Props = $props();

  let rows = $state<T[]>([]);
  let searchTerm = $state('');
  let isLoading = $state(true);

  let filteredRows = $derived.by(() => {
    let search = searchTerm.trim().toLowerCase();
    if (!searchColumns || !search) return rows;

    return rows.filter((row) => {
      return searchColumns.some((column) => {
        return String(row[column]).toLowerCase().includes(search);
      });
    });
  });

  $effect(() => {
    if (data instanceof Promise) {
      isLoading = true;
      data.then((d) => {
        rows = d || [];
        isLoading = false;
      });
    } else if (data) {
      rows = data;
      isLoading = false;
    }
  });

  let table = $derived(
    createTable(filteredRows, columns(columnData as any), () => true)
  );
</script>

<BaseTable {table} filterColumn="" hideFilter {isLoading} class={className}>
  {#snippet filter()}
    {#if searchColumns}
      <Input
        bind:value={searchTerm}
        class="mb-2"
        placeholder="Search..."
        autofocus
      />
    {/if}
  {/snippet}
</BaseTable>
