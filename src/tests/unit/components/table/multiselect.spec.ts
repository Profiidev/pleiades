import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { fireEvent, waitFor } from '@testing-library/dom';
import Multiselect from '$lib/components/table/multiselect.svelte';

const items = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' }
];

const groups = [
  { items, label: 'Roles' },
  { items: [], label: 'Empty' }
];

describe('Multiselect trigger', () => {
  it('shows the default empty label', () => {
    const { getByText } = render(Multiselect, {
      props: { data: items, label: 'Roles', selected: [] }
    });
    expect(getByText('No Roles')).toBeInTheDocument();
  });

  it('uses a custom button prefix when provided', () => {
    const { getByText } = render(Multiselect, {
      props: { buttonPrefix: 'Any', data: items, label: 'Roles', selected: [] }
    });
    expect(getByText('Any Roles')).toBeInTheDocument();
  });

  it('shows joined labels for the current selection (flat items)', () => {
    const { getByText } = render(Multiselect, {
      props: { data: items, label: 'Roles', selected: ['admin', 'user'] }
    });
    expect(getByText('Admin, User')).toBeInTheDocument();
  });

  it('resolves labels from grouped data', () => {
    const { getByText } = render(Multiselect, {
      props: { data: groups, label: 'Roles', selected: ['user'] }
    });
    expect(getByText('User')).toBeInTheDocument();
  });

  it('disables the trigger when disabled', () => {
    const { container } = render(Multiselect, {
      props: { data: items, disabled: true, label: 'Roles', selected: [] }
    });
    expect(
      container.querySelector<HTMLButtonElement>('[role="combobox"]')!.disabled
    ).toBe(true);
  });
});

describe('Multiselect selection', () => {
  it('toggles an item on in multi mode and notifies via onSelectChange', async () => {
    const onSelectChange = vi.fn();
    const { getByText } = render(Multiselect, {
      props: { data: items, label: 'Roles', onSelectChange, selected: [] }
    });
    fireEvent.click(getByText('No Roles'));
    const option = await waitFor(() => getByText('Admin'));
    fireEvent.click(option);
    await waitFor(() => expect(onSelectChange).toHaveBeenCalledWith(['admin']));
  });

  it('replaces the selection and keeps a single value in single mode', async () => {
    const onSelectChange = vi.fn();
    const { getByText } = render(Multiselect, {
      props: {
        data: items,
        label: 'Roles',
        onSelectChange,
        selected: ['admin'],
        single: true
      }
    });
    fireEvent.click(getByText('Admin'));
    const option = await waitFor(() => getByText('User'));
    fireEvent.click(option);
    await waitFor(() => expect(onSelectChange).toHaveBeenCalledWith(['user']));
  });
});
