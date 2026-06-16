import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import { z } from 'zod/v4';
import FormDialog from '$lib/components/form/form-dialog.svelte';

const schema = z.object({});

afterEach(() => cleanup());

const baseProps = (over: Record<string, unknown> = {}) => ({
  confirm: 'Go',
  onsubmit: vi.fn(),
  schema,
  title: 'Confirm Action',
  trigger: { text: 'Open' },
  ...over
});

describe('FormDialog', () => {
  it('renders the trigger button', () => {
    const { getByText } = render(FormDialog, { props: baseProps() });
    expect(getByText('Open')).toBeInTheDocument();
  });

  it('does not render a trigger when none is configured', () => {
    const { queryByText } = render(FormDialog, {
      props: baseProps({ trigger: undefined })
    });
    expect(queryByText('Open')).toBeNull();
  });

  it('opens the dialog when the trigger is clicked', async () => {
    const { getByText } = render(FormDialog, { props: baseProps() });
    fireEvent.click(getByText('Open'));
    await waitFor(() =>
      expect(getByText('Confirm Action')).toBeInTheDocument()
    );
  });

  it('does not open when onopen returns false', async () => {
    const onopen = vi.fn(async () => false);
    const { getByText, queryByRole } = render(FormDialog, {
      props: baseProps({ onopen })
    });
    fireEvent.click(getByText('Open'));
    await waitFor(() => expect(onopen).toHaveBeenCalled());
    expect(queryByRole('dialog')).toBeNull();
  });

  it('calls onsubmit when the dialog form is submitted', async () => {
    const onsubmit = vi.fn();
    const { getByText, getByRole } = render(FormDialog, {
      props: baseProps({ onsubmit })
    });
    fireEvent.click(getByText('Open'));
    const dialog = await waitFor(() => getByRole('dialog'));
    const confirm = within(dialog).getByRole('button', { name: 'Go' });
    fireEvent.submit(confirm.closest('form')!);
    await waitFor(() => expect(onsubmit).toHaveBeenCalled());
  });

  it('exposes getValue/setValue through the component instance', async () => {
    const { component } = render(FormDialog, {
      props: baseProps({
        initialValue: { name: 'start' },
        schema: z.object({ name: z.string() }),
        trigger: { text: 'Open' }
      })
    }) as unknown as {
      component: {
        openFn: () => Promise<void>;
        setValue: (v: { name: string }) => Promise<void>;
        getValue: () => { name: string } | undefined;
      };
    };
    await component.openFn();
    await component.setValue({ name: 'changed' });
    await waitFor(() => expect(component.getValue()?.name).toBe('changed'));
  });
});
