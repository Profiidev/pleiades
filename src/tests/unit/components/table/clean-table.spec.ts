import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { waitFor } from '@testing-library/dom';
import { createColumn } from '$lib/components/table/helpers.svelte';
import CleanTable from '$lib/components/table/clean-table.svelte';

interface Item {
  name: string;
}

const columns = () => [createColumn<string, Item>('name', 'Name')];

describe('CleanTable', () => {
  it('renders rows from a synchronous data array', () => {
    const { getByText } = render(CleanTable, {
      props: { columns, data: [{ name: 'Sync' }] }
    });
    expect(getByText('Sync')).toBeInTheDocument();
  });

  it('renders rows once a data promise resolves', async () => {
    const { getByText } = render(CleanTable, {
      props: {
        columns,
        data: Promise.resolve([{ name: 'Async' }])
      }
    });
    await waitFor(() => expect(getByText('Async')).toBeInTheDocument());
  });

  it('passes columnData through to the columns factory', () => {
    const columnsWithData = (prefix: string) => [
      createColumn<string, Item>('name', `${prefix} Name`)
    ];
    const { getByText } = render(CleanTable, {
      props: {
        columnData: 'Pretty',
        columns: columnsWithData,
        data: [{ name: 'Row' }]
      }
    });
    expect(getByText('Pretty Name')).toBeInTheDocument();
  });

  it('falls back to an empty table when a promise resolves undefined', async () => {
    const { getByText } = render(CleanTable, {
      props: {
        columns,
        data: Promise.resolve(undefined)
      }
    });
    await waitFor(() => expect(getByText('No results.')).toBeInTheDocument());
  });
});
