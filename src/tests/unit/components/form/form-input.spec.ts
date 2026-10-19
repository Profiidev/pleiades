import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { z } from 'zod/v4';
import { get } from 'svelte/store';
import type { SuperForm } from 'sveltekit-superforms';
import FormInput from '$lib/components/form/form-input.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ name: z.string() });
const row = z.object({ name: z.string() });
const rowsSchema = z.object({ rows: z.array(row) });

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
    const input = container.querySelector('input')!;
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
    const input = container.querySelector('input')!;
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
    const input = container.querySelector('input')!;
    expect(get(form.form).name).toBe('new');
    expect(input.value).toBe('new');
  });

  it('binds nested keys like rows[1].name', async () => {
    let form!: SuperForm<Record<string, unknown>>;
    const { container } = render(Harness, {
      props: {
        bindForm: (f: SuperForm<Record<string, unknown>>) => (form = f),
        component: FormInput,
        initial: { rows: [{ name: 'a' }, { name: 'b' }] },
        props: { key: 'rows[1].name', label: 'Name' },
        schema: rowsSchema
      }
    });
    const input = container.querySelector('input')!;
    expect(input.value).toBe('b');
    await fireEvent.input(input, { target: { value: 'c' } });
    expect(get(form.form).rows).toEqual([{ name: 'a' }, { name: 'c' }]);
  });
});
