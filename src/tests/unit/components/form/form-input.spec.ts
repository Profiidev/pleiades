import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { z } from 'zod/v4';
import { get } from 'svelte/store';
import type { SuperForm } from 'sveltekit-superforms';
import FormInput from '$lib/components/form/form-input.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ name: z.string() });

describe('FormInput', () => {
  it('renders the label and an input bound to the field value', () => {
    const { getByText, container } = render(Harness, {
      props: {
        component: FormInput,
        initial: { name: 'Alice' },
        props: { key: 'name', label: 'Name' },
        schema
      }
    });
    expect(getByText('Name')).toBeInTheDocument();
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe('Alice');
  });

  it('passes the disabled prop through to the input', () => {
    const { container } = render(Harness, {
      props: {
        component: FormInput,
        initial: { name: '' },
        props: { disabled: true, key: 'name', label: 'Name' },
        schema
      }
    });
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('reflects form store updates in the input', async () => {
    let form!: SuperForm<Record<string, unknown>>;
    const { container } = render(Harness, {
      props: {
        bindForm: (f: SuperForm<Record<string, unknown>>) => (form = f),
        component: FormInput,
        initial: { name: 'old' },
        props: { key: 'name', label: 'Name' },
        schema
      }
    });
    form.form.set({ name: 'new' });
    await Promise.resolve();
    const input = container.querySelector('input') as HTMLInputElement;
    expect(get(form.form).name).toBe('new');
    expect(input.value).toBe('new');
  });
});
