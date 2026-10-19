import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { z } from 'zod/v4';
import { get } from 'svelte/store';
import type { SuperForm } from 'sveltekit-superforms';
import FormTextarea from '$lib/components/form/form-textarea.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ bio: z.string() });
const row = z.object({ bio: z.string() });
const rowsSchema = z.object({ rows: z.array(row) });

describe('FormTextarea', () => {
  it('renders the label and a textarea bound to the field value', () => {
    const { getByText, container } = render(Harness, {
      props: {
        component: FormTextarea,
        initial: { bio: 'hello' },
        props: { key: 'bio', label: 'Bio', rows: 4 },
        schema
      }
    });
    expect(getByText('Bio')).toBeInTheDocument();
    const textarea = container.querySelector('textarea')!;
    expect(textarea.value).toBe('hello');
    expect(textarea.rows).toBe(4);
  });

  it('passes the disabled prop through', () => {
    const { container } = render(Harness, {
      props: {
        component: FormTextarea,
        initial: { bio: '' },
        props: { disabled: true, key: 'bio', label: 'Bio' },
        schema
      }
    });
    expect(container.querySelector('textarea')!.disabled).toBe(true);
  });

  it('writes edits to nested keys like rows[0].bio', async () => {
    let form!: SuperForm<Record<string, unknown>>;
    const { container } = render(Harness, {
      props: {
        bindForm: (f: SuperForm<Record<string, unknown>>) => (form = f),
        component: FormTextarea,
        initial: { rows: [{ bio: 'a' }] },
        props: { key: 'rows[0].bio', label: 'Bio' },
        schema: rowsSchema
      }
    });
    const textarea = container.querySelector('textarea')!;
    expect(textarea.value).toBe('a');
    await fireEvent.input(textarea, { target: { value: 'b' } });
    expect(get(form.form).rows).toEqual([{ bio: 'b' }]);
  });

  it('renders no label element when label is omitted', () => {
    const { container, getByLabelText } = render(Harness, {
      props: {
        component: FormTextarea,
        initial: { bio: 'x' },
        props: { 'aria-label': 'Unlabelled', key: 'bio' },
        schema
      }
    });
    expect(container.querySelector('label')).toBeNull();
    expect(getByLabelText('Unlabelled').tagName).toBe('TEXTAREA');
  });
});
