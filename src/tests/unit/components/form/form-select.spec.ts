import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { fireEvent, waitFor } from '@testing-library/dom';
import { z } from 'zod/v4';
import type { SuperForm } from 'sveltekit-superforms';
import { get } from 'svelte/store';
import FormSelect from '$lib/components/form/form-select.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ roles: z.array(z.string()) });
const data = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' }
];

describe('FormSelect', () => {
  it('renders the label and the multiselect trigger', () => {
    const { getByText } = render(Harness, {
      props: {
        component: FormSelect,
        initial: { roles: [] },
        props: { data, key: 'roles', label: 'Roles' },
        schema
      }
    });
    expect(getByText('Roles')).toBeInTheDocument();
    expect(getByText('No Roles')).toBeInTheDocument();
  });

  it('writes the selection back into the form field', async () => {
    let form!: SuperForm<Record<string, unknown>>;
    const { getByText } = render(Harness, {
      props: {
        bindForm: (f: SuperForm<Record<string, unknown>>) => (form = f),
        component: FormSelect,
        initial: { roles: [] },
        props: { data, key: 'roles', label: 'Roles' },
        schema
      }
    });
    fireEvent.click(getByText('No Roles'));
    fireEvent.click(await waitFor(() => getByText('Admin')));
    await waitFor(() => expect(get(form.form).roles).toEqual(['admin']));
  });
});
