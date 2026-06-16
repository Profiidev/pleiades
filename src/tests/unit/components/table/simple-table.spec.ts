import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import { z } from 'zod/v4';
import type { ComponentProps } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { createColumn } from '$lib/components/table/helpers.svelte';
import { renderComponent } from '$lib/components/ui/data-table';
import Actions from '$lib/components/table/actions.svelte';
import SimpleTable from '$lib/components/table/simple-table.svelte';
import { RequestError } from '$lib/backend/types.svelte';

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock('svelte-sonner', () => ({
  toast: {
    error: (...a: unknown[]) => toastError(...a),
    success: (...a: unknown[]) => toastSuccess(...a)
  }
}));

interface Item {
  id: string;
  name: string;
}

const data: Item[] = [{ id: '1', name: 'Alpha' }];

const emptySchema = z.object({});

const columns =
  (editFn: (id: string) => void, deleteFn: (id: string) => void) =>
  (): ColumnDef<Item>[] => [
    createColumn<string, Item>('name', 'Name'),
    {
      cell: ({ row }) =>
        renderComponent(Actions, {
          delete_disabled: false,
          edit: () => editFn(row.original.id),
          edit_disabled: false,
          remove: () => deleteFn(row.original.id)
        }),
      id: 'actions'
    }
  ];

const baseProps = (over: Record<string, unknown> = {}) =>
  ({
    columnData: undefined,
    columns: (editFn: (id: string) => void, deleteFn: (id: string) => void) =>
      columns(editFn, deleteFn)(),
    createButtonDisabled: false,
    createItemFn: vi.fn(async () => undefined),
    createSchema: emptySchema,
    data,
    deleteItemFn: vi.fn(async () => undefined),
    deleteSchema: emptySchema,
    description: 'Manage widgets',
    display: (item: Item | undefined) => item?.name,
    editItemFn: vi.fn(async () => undefined),
    editSchema: emptySchema,
    filter_keys: ['name'],
    label: 'Widget',
    title: 'Widgets',
    toId: (item: Item) => item.id,
    ...over
    // `render` erases the component's generics; cast to the resolved prop type.
  }) as unknown as ComponentProps<typeof SimpleTable>;

afterEach(() => {
  cleanup();
  toastSuccess.mockClear();
  toastError.mockClear();
});

describe('SimpleTable rendering', () => {
  it('renders the title and description', () => {
    const { getByText } = render(SimpleTable, { props: baseProps() });
    expect(getByText('Widgets')).toBeInTheDocument();
    expect(getByText('Manage widgets')).toBeInTheDocument();
  });

  it('renders a row for each data item', () => {
    const { getByText } = render(SimpleTable, { props: baseProps() });
    expect(getByText('Alpha')).toBeInTheDocument();
  });
});

describe('SimpleTable edit', () => {
  it('opens the edit dialog and confirms the edit (toasting on success)', async () => {
    const editItemFn = vi.fn(async () => undefined);
    const { container, getByText } = render(SimpleTable, {
      props: baseProps({ editItemFn })
    });
    // The first action button is the edit (pencil) button.
    const editButton = container.querySelectorAll(
      'tbody button'
    )[0] as HTMLButtonElement;
    fireEvent.click(editButton);
    await waitFor(() => expect(getByText('Edit Widget')).toBeInTheDocument());
    const dialog = getByText('Edit Widget').closest(
      '[role="dialog"]'
    ) as HTMLElement;
    const confirm = within(dialog).getByRole('button', { name: 'Confirm' });
    fireEvent.submit(confirm.closest('form')!);
    await waitFor(() => expect(editItemFn).toHaveBeenCalled());
    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith('Widget updated')
    );
  });

  it('maps a backend error to the configured message', async () => {
    const editItemFn = vi.fn(async () => RequestError.Conflict);
    const { container, getByText } = render(SimpleTable, {
      props: baseProps({
        editItemFn,
        errorMappings: { [RequestError.Conflict]: { error: 'Already exists' } }
      })
    });
    fireEvent.click(
      container.querySelectorAll('tbody button')[0] as HTMLButtonElement
    );
    await waitFor(() => expect(getByText('Edit Widget')).toBeInTheDocument());
    const dialog = getByText('Edit Widget').closest(
      '[role="dialog"]'
    ) as HTMLElement;
    const confirm = within(dialog).getByRole('button', { name: 'Confirm' });
    fireEvent.submit(confirm.closest('form')!);
    await waitFor(() => expect(editItemFn).toHaveBeenCalled());
    expect(toastSuccess).not.toHaveBeenCalled();
  });
});

describe('SimpleTable delete', () => {
  it('opens the delete dialog and confirms the deletion', async () => {
    const deleteItemFn = vi.fn(async () => undefined);
    const { container, getByText } = render(SimpleTable, {
      props: baseProps({ deleteItemFn })
    });
    const deleteButton = container.querySelectorAll(
      'tbody button'
    )[1] as HTMLButtonElement;
    fireEvent.click(deleteButton);
    await waitFor(() => expect(getByText('Delete Widget')).toBeInTheDocument());
    const dialog = getByText('Delete Widget').closest(
      '[role="dialog"]'
    ) as HTMLElement;
    const confirm = within(dialog).getByRole('button', { name: 'Delete' });
    fireEvent.submit(confirm.closest('form')!);
    await waitFor(() => expect(deleteItemFn).toHaveBeenCalledWith('1'));
    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith('Widget deleted')
    );
  });

  it('reports an error when deletion fails', async () => {
    const deleteItemFn = vi.fn(async () => RequestError.Other);
    const { container, getByText } = render(SimpleTable, {
      props: baseProps({ deleteItemFn })
    });
    fireEvent.click(
      container.querySelectorAll('tbody button')[1] as HTMLButtonElement
    );
    await waitFor(() => expect(getByText('Delete Widget')).toBeInTheDocument());
    const dialog = getByText('Delete Widget').closest(
      '[role="dialog"]'
    ) as HTMLElement;
    const confirm = within(dialog).getByRole('button', { name: 'Delete' });
    fireEvent.submit(confirm.closest('form')!);
    await waitFor(() => expect(deleteItemFn).toHaveBeenCalled());
    expect(toastSuccess).not.toHaveBeenCalled();
  });
});
