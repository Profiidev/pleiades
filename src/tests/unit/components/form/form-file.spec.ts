import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { z } from 'zod/v4';
import FormFile from '$lib/components/form/form-file.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ file: z.any() });

describe('FormFile', () => {
  it('renders the label and a file input', () => {
    const { getByText, container } = render(Harness, {
      props: {
        component: FormFile,
        initial: { file: undefined },
        props: { key: 'file', label: 'Upload' },
        schema
      }
    });
    expect(getByText('Upload')).toBeInTheDocument();
    const input = container.querySelector('input')!;
    expect(input.type).toBe('file');
  });

  it('applies the disabled prop', () => {
    const { container } = render(Harness, {
      props: {
        component: FormFile,
        initial: { file: undefined },
        props: { disabled: true, key: 'file', label: 'Upload' },
        schema
      }
    });
    expect(container.querySelector('input')!.disabled).toBe(true);
  });
});
