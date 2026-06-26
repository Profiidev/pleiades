import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { fireEvent, waitFor } from '@testing-library/dom';
import type { ComponentProps } from 'svelte';
import { createColumn } from '$lib/components/table/helpers.svelte';
import CleanTable from '$lib/components/table/clean-table.svelte';

interface Item {
  name: string;
}

const columns = () => [createColumn<string, Item>('name', 'Name')];

// Testing-library's `render` erases the component's generics, so the prop
// Object is cast to the resolved prop type to keep type-checking happy.
const renderClean = (props: Record<string, unknown>) =>
  render(CleanTable, {
    props: props as unknown as ComponentProps<typeof CleanTable>
  });

describe('CleanTable', () => {
  it('renders rows from a synchronous data array', () => {
    const { getByText } = renderClean({ columns, data: [{ name: 'Sync' }] });
    expect(getByText('Sync')).toBeInTheDocument();
  });

  it('renders rows once a data promise resolves', async () => {
    const { getByText } = renderClean({
      columns,
      data: Promise.resolve([{ name: 'Async' }])
    });
    await waitFor(() => expect(getByText('Async')).toBeInTheDocument());
  });

  it('passes columnData through to the columns factory', () => {
    const columnsWithData = (prefix: string) => [
      createColumn<string, Item>('name', `${prefix} Name`)
    ];
    const { getByText } = renderClean({
      columnData: 'Pretty',
      columns: columnsWithData,
      data: [{ name: 'Row' }]
    });
    expect(getByText('Pretty Name')).toBeInTheDocument();
  });

  it('falls back to an empty table when a promise resolves undefined', async () => {
    const { getByText } = renderClean({
      columns,
      data: Promise.resolve(undefined)
    });
    await waitFor(() => expect(getByText('No results.')).toBeInTheDocument());
  });

  it('does not render the search input without searchColumns', () => {
    const { queryByPlaceholderText } = renderClean({
      columns,
      data: [{ name: 'Row' }]
    });
    expect(queryByPlaceholderText('Search...')).toBeNull();
  });

  it('renders the search input when searchColumns is set', () => {
    const { getByPlaceholderText } = renderClean({
      columns,
      data: [{ name: 'Row' }],
      searchColumns: ['name']
    });
    expect(getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('filters rows by the search term across searchColumns', async () => {
    const { getByPlaceholderText, queryByText } = renderClean({
      columns,
      data: [{ name: 'Alpha' }, { name: 'Beta' }],
      searchColumns: ['name']
    });
    const input = getByPlaceholderText('Search...') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'alph' } });
    await waitFor(() => {
      expect(queryByText('Alpha')).not.toBeNull();
      expect(queryByText('Beta')).toBeNull();
    });
  });
});
