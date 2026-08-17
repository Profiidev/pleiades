<script
  lang="ts"
  generics="T extends RowData, F extends DefaultTableFeatures = DefaultTableFeatures"
>
  import * as Table from '../ui/table/index.js';
  import * as Dropdown from '../ui/dropdown-menu/index.js';
  import { FlexRender } from '@tanstack/svelte-table';
  import { Input } from '../ui/input/index.js';
  import { ScrollArea } from '../ui/scroll-area/index.js';
  import type {
    DefaultTableFeatures,
    TableInstance
  } from './helpers.svelte.js';
  import type { RowData } from '@tanstack/svelte-table';
  import { Button } from '../ui/button/index.js';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import type { Snippet } from 'svelte';
  import { cn } from '../../utils.js';

  interface Props {
    table: TableInstance<T, F>;
    children?: Snippet;
    filter?: Snippet;
    filterColumn: string;
    class?: string;
    hideFilter?: boolean;
    isLoading?: boolean;
  }

  let {
    table,
    children,
    filter,
    filterColumn,
    class: className,
    hideFilter,
    isLoading
  }: Props = $props();

  // cast required because of tanstack idk
  let base = $derived(table as unknown as TableInstance<T>);
</script>

<div class={cn('flex w-full flex-col', className)}>
  {#if !hideFilter}
    <div class="flex items-center py-4">
      <Input
        placeholder="Filter entries"
        value={(base.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
        oninput={(e) =>
          base.getColumn(filterColumn)?.setFilterValue(e.currentTarget.value)}
        onchange={(e) =>
          base.getColumn(filterColumn)?.setFilterValue(e.currentTarget.value)}
        class="mr-2 max-w-full"
      />
      <Dropdown.Root>
        <Dropdown.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="outline">
              Columns
              <ChevronDown class="ml-2 size-4" />
            </Button>
          {/snippet}
        </Dropdown.Trigger>
        <Dropdown.Content align="end">
          {#each base
            .getAllColumns()
            .filter((col) => col.getCanHide()) as column}
            <Dropdown.CheckboxItem
              class="capitalize"
              bind:checked={() => column.getIsVisible(), () => {}}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </Dropdown.CheckboxItem>
          {/each}
        </Dropdown.Content>
      </Dropdown.Root>
      {@render children?.()}
    </div>
  {/if}
  {#if filter}
    {@render filter()}
  {/if}
  <ScrollArea class="grid min-h-0 flex-1 rounded-md border" orientation="both">
    <Table.Root
      class={`min-w-[${base.getHeaderGroups()[0].headers.length * 100}px]`}
    >
      <Table.Header>
        {#each base.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head>
                {#if !header.isPlaceholder}
                  <FlexRender {header} />
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each base.getRowModel().rows as row (row.id)}
          <Table.Row data-state={row.getIsSelected() && 'selected'}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell class="group">
                <div
                  class="last-group:justify-end last-group:text-center last-group:h-full group-last:flex"
                >
                  <FlexRender {cell} />
                </div>
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell
              colspan={base.getAllColumns().length}
              class="h-24 text-center"
            >
              {isLoading ? 'Loading...' : 'No results.'}
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </ScrollArea>
</div>
