import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { fireEvent, waitFor } from '@testing-library/dom';
import { z } from 'zod/v4';
import type { SuperForm } from 'sveltekit-superforms';
import { get } from 'svelte/store';
import FormTags from '$lib/components/form/form-tags.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ tags: z.array(z.string()) });

const renderTags = (props: Record<string, unknown>, initial: string[] = []) => {
  let form!: SuperForm<Record<string, unknown>>;
  const result = render(Harness, {
    props: {
      bindForm: (f: SuperForm<Record<string, unknown>>) => (form = f),
      component: FormTags,
      initial: { tags: initial },
      props: { key: 'tags', label: 'Tags', ...props },
      schema
    }
  });
  return {
    ...result,
    get form() {
      return form;
    }
  };
};

describe('FormTags', () => {
  it('renders the label and existing tags', () => {
    const { getByText } = renderTags({}, ['existing']);
    expect(getByText('Tags')).toBeInTheDocument();
    expect(getByText('existing')).toBeInTheDocument();
  });

  it('renders the placeholder on the input', () => {
    const { getByPlaceholderText } = renderTags({ placeholder: 'Add tag' });
    expect(getByPlaceholderText('Add tag')).toBeInTheDocument();
  });

  it('writes a typed tag back into the form field on Enter', async () => {
    const harness = renderTags({ placeholder: 'Add tag' });
    const input = harness.getByPlaceholderText('Add tag') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'svelte' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() =>
      expect(get(harness.form.form).tags).toEqual(['svelte'])
    );
  });

  it('renders suggestions when the input is focused', async () => {
    const { getByPlaceholderText, getByText } = renderTags({
      placeholder: 'Add tag',
      suggestions: ['alpha', 'beta']
    });
    const input = getByPlaceholderText('Add tag') as HTMLInputElement;
    fireEvent.focus(input);
    await waitFor(() => {
      expect(getByText('alpha')).toBeInTheDocument();
      expect(getByText('beta')).toBeInTheDocument();
    });
  });
});
