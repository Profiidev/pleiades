import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';
import { fireEvent, waitFor } from '@testing-library/dom';
import { createRawSnippet } from 'svelte';
import { z } from 'zod/v4';
import BaseForm from '$lib/components/form/base-form.svelte';

const toastError = vi.fn();
vi.mock('svelte-sonner', () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args)
  }
}));

const schema = z.object({ name: z.string().min(1) });

afterEach(() => {
  cleanup();
  toastError.mockClear();
});

const submitForm = (container: HTMLElement) => {
  const form = container.querySelector('form')!;
  fireEvent.submit(form);
};

describe('BaseForm rendering', () => {
  it('renders the default submit button', () => {
    const { getByText } = render(BaseForm, {
      props: { onsubmit: () => {}, schema }
    });
    expect(getByText('Submit')).toBeInTheDocument();
  });

  it('honours a custom submit label', () => {
    const { getByText } = render(BaseForm, {
      props: { onsubmit: () => {}, schema, submitText: 'Save' }
    });
    expect(getByText('Save')).toBeInTheDocument();
  });

  it('renders the children snippet with form props', () => {
    const children = createRawSnippet(() => ({
      render: () => `<div data-testid="child">fields</div>`
    }));
    const { getByTestId } = render(BaseForm, {
      props: { children, onsubmit: () => {}, schema }
    });
    expect(getByTestId('child')).toBeInTheDocument();
  });
});

describe('BaseForm exported helpers', () => {
  it('getValue returns the current form data and setValue updates it', () => {
    const { component } = render(BaseForm, {
      props: { initialValue: { name: 'init' }, onsubmit: () => {}, schema }
    }) as unknown as {
      component: {
        getValue: () => { name: string };
        setValue: (v: { name: string }) => void;
      };
    };
    expect(component.getValue().name).toBe('init');
    component.setValue({ name: 'updated' });
    expect(component.getValue().name).toBe('updated');
  });

  it('setValue keeps existing values for keys not provided', () => {
    const { component } = render(BaseForm, {
      props: { initialValue: { name: 'keep' }, onsubmit: () => {}, schema }
    }) as unknown as {
      component: {
        getValue: () => { name: string };
        setValue: (v: Partial<{ name: string }>) => void;
      };
    };
    component.setValue({});
    expect(component.getValue().name).toBe('keep');
  });
});

describe('BaseForm submission', () => {
  it('calls onsubmit with the form data when valid', async () => {
    const onsubmit = vi.fn();
    const { container } = render(BaseForm, {
      props: { initialValue: { name: 'valid' }, onsubmit, schema }
    });
    submitForm(container);
    await waitFor(() =>
      expect(onsubmit).toHaveBeenCalledWith({ name: 'valid' })
    );
  });

  it('does not call onsubmit when the form is invalid', async () => {
    const onsubmit = vi.fn();
    const { container } = render(BaseForm, {
      props: { initialValue: { name: '' }, onsubmit, schema }
    });
    submitForm(container);
    await new Promise((r) => setTimeout(r, 50));
    expect(onsubmit).not.toHaveBeenCalled();
  });

  it('shows an error toast when onsubmit returns a non-field error', async () => {
    const onsubmit = vi.fn(() => ({ error: 'boom' }));
    const { container, getByText } = render(BaseForm, {
      props: { initialValue: { name: 'valid' }, onsubmit, schema }
    });
    submitForm(container);
    await waitFor(() => expect(toastError).toHaveBeenCalledWith('boom'));
    // The button flips to the retry state.
    await waitFor(() => expect(getByText('Retry')).toBeInTheDocument());
  });

  it('suppresses the toast when noErrorToast is set', async () => {
    const onsubmit = vi.fn(() => ({ error: 'boom' }));
    const { container } = render(BaseForm, {
      props: {
        initialValue: { name: 'valid' },
        noErrorToast: true,
        onsubmit,
        schema
      }
    });
    submitForm(container);
    await waitFor(() => expect(onsubmit).toHaveBeenCalled());
    expect(toastError).not.toHaveBeenCalled();
  });

  it('sets a field error and flips to the error state when onsubmit returns a field error', async () => {
    const onsubmit = vi.fn(() => ({ error: 'taken', field: 'name' as const }));
    const { container, findByText } = render(BaseForm, {
      props: { initialValue: { name: 'valid' }, onsubmit, schema }
    });
    submitForm(container);
    // Base-form renders no field of its own, so the per-field error text is not
    // Shown here, but the form enters its error (retry) state.
    expect(await findByText('Retry')).toBeInTheDocument();
    expect(onsubmit).toHaveBeenCalled();
    expect(toastError).not.toHaveBeenCalled();
  });

  it('does not toast or error when onsubmit returns an empty error string', async () => {
    const onsubmit = vi.fn(() => ({ error: '' }));
    const { container, queryByText } = render(BaseForm, {
      props: { initialValue: { name: 'valid' }, onsubmit, schema }
    });
    submitForm(container);
    await waitFor(() => expect(onsubmit).toHaveBeenCalled());
    expect(toastError).not.toHaveBeenCalled();
    expect(queryByText('Retry')).toBeNull();
  });
});
