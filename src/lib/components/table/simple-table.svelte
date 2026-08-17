<script
  lang="ts"
  generics="CV extends ZodValidationSchema, EV extends ZodValidationSchema, DV extends ZodValidationSchema, T extends RowData, CD"
>
  import type { Error, FormValue } from '../form/types.js';
  import {
    type TableColumnDef,
    type TableRow,
    createTable
  } from '../table/helpers.svelte';
  import Table from '../table/base-table.svelte';
  import type { RowData } from '@tanstack/svelte-table';
  import { toast } from 'svelte-sonner';
  import { RequestError } from '$lib/backend/types.svelte';
  import type { Snippet, SvelteComponent } from 'svelte';
  import type { SuperForm } from 'sveltekit-superforms';
  import FormDialog from '../form/form-dialog.svelte';
  import { type ZodValidationSchema } from 'sveltekit-superforms/adapters';

  interface Props {
    data: T[] | undefined;
    filter_keys: string[];
    columns: (
      editFn: (id: string) => void,
      deleteFn: (id: string) => void,
      data: CD
    ) => TableColumnDef<T>[];
    label: string;
    createItemFn: (form: FormValue<CV>) => Promise<RequestError | undefined>;
    editItemFn: (item: T) => Promise<RequestError | undefined>;
    deleteItemFn: (id: string) => Promise<RequestError | undefined>;
    toId: (item: T) => string;
    display: (item: T | undefined) => string | undefined;
    title: string;
    description: string;
    editDialog?: Snippet<
      [
        {
          props: {
            disabled: boolean;
            formData: SuperForm<FormValue<EV>>;
          };
          item: T;
        }
      ]
    >;
    createDialog?: Snippet<
      [
        {
          props: {
            disabled: boolean;
            formData: SuperForm<FormValue<CV>>;
          };
        }
      ]
    >;
    createButtonDisabled: boolean;
    createSchema: CV;
    editSchema: EV;
    deleteSchema: DV;
    startCreate?: () => boolean | Promise<boolean>;
    startEdit?: (item: T) => void | Promise<void>;
    createClass?: string;
    editClass?: string;
    errorMappings?: {
      [key in RequestError]?: Error<any>;
    };
    columnData: CD;
  }

  let {
    data,
    filter_keys,
    columns,
    label,
    createItemFn,
    editItemFn,
    deleteItemFn,
    toId,
    display,
    title,
    description,
    editDialog,
    createDialog,
    createButtonDisabled,
    startCreate,
    startEdit,
    createClass,
    editClass,
    errorMappings,
    columnData,
    createSchema,
    editSchema,
    deleteSchema
  }: Props = $props();

  let isLoading = $state(false);
  let labelLower = $derived(label.toLocaleLowerCase());
  let fieldProps = $derived({ disabled: isLoading });

  let selected: T | undefined = $state();
  let editOpen = $state(false);
  let deleteOpen = $state(false);

  let editComp: SvelteComponent | undefined = $state();
  let setEditValue: (value: T) => void = $derived(
    editComp?.setValue || (() => {})
  );

  const filterFn = (row: TableRow<T>, id: string, filterValues: any) => {
    const info = filter_keys
      .map((k) => (row.original as any)[k] as string)
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    let searchTerms = Array.isArray(filterValues)
      ? filterValues
      : [filterValues];
    return searchTerms.some((term) => info.includes(term.toLowerCase()));
  };

  const editItem = (id: string) => {
    selected = data?.find((item) => toId(item) === id);
    if (selected) {
      setEditValue(selected);
      startEdit?.(selected);
    }
    editOpen = true;
  };

  const deleteItem = (id: string) => {
    selected = data?.find((item) => toId(item) === id);
    deleteOpen = true;
  };

  let table = $derived(
    createTable(data || [], columns(editItem, deleteItem, columnData), filterFn)
  );

  const createItem = async (form: FormValue<CV>) => {
    let ret = await createItemFn(form);

    if (ret) {
      if (errorMappings && errorMappings[ret]) {
        return errorMappings[ret];
      } else {
        return { error: `Error while creating ${labelLower}` };
      }
    } else {
      toast.success(`Created ${label}`);
    }
  };

  const editItemConfirm = async (form: FormValue<EV>) => {
    selected = {
      ...selected,
      ...form
    } as any;

    if (!selected) {
      return;
    }

    let ret = await editItemFn(selected);

    if (ret) {
      if (errorMappings && errorMappings[ret]) {
        return errorMappings[ret];
      } else {
        return { error: `Error while updating ${labelLower}` };
      }
    } else {
      toast.success(`${label} updated`);
    }
  };

  const deleteItemConfirm = async () => {
    if (!selected) {
      return;
    }

    let ret = await deleteItemFn(toId(selected));

    if (ret) {
      return { error: `Error while deleting ${label}` };
    } else {
      toast.success(`${label} deleted`);
    }
  };
</script>

<FormDialog
  title={`Delete ${label}`}
  description={`Do you really want to delete the ${labelLower} ${display(selected)}?`}
  confirm="Delete"
  confirmVariant="destructive"
  onsubmit={deleteItemConfirm}
  bind:open={deleteOpen}
  bind:isLoading
  schema={deleteSchema}
/>
<FormDialog
  bind:this={editComp}
  title={`Edit ${label}`}
  description={`Edit the ${labelLower} info for ${display(selected)} below`}
  confirm="Confirm"
  onsubmit={editItemConfirm}
  bind:open={editOpen}
  bind:isLoading
  class={editClass}
  schema={editSchema}
>
  {#snippet children({ props })}
    {#if selected}
      {@render editDialog?.({
        props: { ...props, ...fieldProps },
        item: selected
      })}
    {/if}
  {/snippet}
</FormDialog>
<div class="m-4 flex flex-1 flex-col space-y-3">
  <div class="ml-7 md:m-0">
    <h3 class="text-xl font-medium">{title}</h3>
    <p class="text-muted-foreground text-sm">
      {description}
    </p>
  </div>
  <Table filterColumn="name" {table} class="min-h-0 flex-1" {isLoading}>
    <FormDialog
      title={`Create ${label}`}
      description={`Enter the details for the new ${labelLower} below`}
      confirm="Create"
      trigger={{
        text: `Create ${label}`,
        variant: 'secondary',
        class: 'ml-2',
        disabled: createButtonDisabled
      }}
      onsubmit={createItem}
      onopen={startCreate}
      bind:isLoading
      schema={createSchema}
      class={createClass}
    >
      {#snippet children({ props })}
        {@render createDialog?.({ props: { ...props, ...fieldProps } })}
      {/snippet}
    </FormDialog>
  </Table>
</div>
