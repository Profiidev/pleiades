import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';
import { createColumn } from '$lib/components/table/helpers.svelte';
import Harness from './base-table-harness.svelte';

interface Item {
  name: string;
}

const columns = () => [createColumn<string, Item>('name', 'Name')];
const data: Item[] = [{ name: 'Alpha' }, { name: 'Beta' }];

describe('BaseTable', () => {
  it('renders a row for each entry', () => {
    const { getByText } = render(Harness, {
      props: { columns: columns(), data }
    });
    expect(getByText('Alpha')).toBeInTheDocument();
    expect(getByText('Beta')).toBeInTheDocument();
  });

  it('shows the empty placeholder when there are no rows', () => {
    const { getByText } = render(Harness, {
      props: { columns: columns(), data: [] }
    });
    expect(getByText('No results.')).toBeInTheDocument();
  });

  it('shows the loading placeholder when loading and empty', () => {
    const { getByText } = render(Harness, {
      props: { columns: columns(), data: [], isLoading: true }
    });
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('does not render the filter input by default', () => {
    const { queryByPlaceholderText } = render(Harness, {
      props: { columns: columns(), data }
    });
    expect(queryByPlaceholderText('Filter entries')).toBeNull();
  });

  it('renders the filter input and columns dropdown when hideFilter is set', () => {
    const { getByPlaceholderText, getByText } = render(Harness, {
      props: { columns: columns(), data, hideFilter: true }
    });
    expect(getByPlaceholderText('Filter entries')).toBeInTheDocument();
    expect(getByText('Columns')).toBeInTheDocument();
  });

  it('renders the filter snippet when provided', () => {
    const { getByTestId } = render(Harness, {
      props: { columns: columns(), data, withFilter: true }
    });
    expect(getByTestId('custom-filter')).toBeInTheDocument();
  });

  it('filters rows as the filter input changes', async () => {
    const { getByPlaceholderText, queryByText } = render(Harness, {
      props: { columns: columns(), data, hideFilter: true }
    });
    const input = getByPlaceholderText('Filter entries') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'Alpha' } });
    expect(queryByText('Alpha')).not.toBeNull();
    expect(queryByText('Beta')).toBeNull();
  });
});
