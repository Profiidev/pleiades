import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { z } from 'zod/v4';
import HideableInput from '$lib/components/form/hideable-input.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ shown: z.boolean() });

const children = () =>
  createRawSnippet(() => ({
    render: () => `<span data-testid="label-content">Token</span>`
  }));

const renderHideable = (shown: boolean) =>
  render(Harness, {
    props: {
      component: HideableInput,
      initial: { shown },
      props: {
        children: children(),
        id: 'token-field',
        key: 'shown',
        value: 'abc123'
      },
      schema
    }
  });

describe('HideableInput', () => {
  it('renders the label and readonly input when the field is truthy', () => {
    const { getByTestId, container } = renderHideable(true);
    expect(getByTestId('label-content')).toBeInTheDocument();
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('abc123');
    expect(input.readOnly).toBe(true);
    expect(input.id).toBe('token-field');
  });

  it('renders nothing when the field is falsy', () => {
    const { container } = renderHideable(false);
    expect(container.querySelector('input')).toBeNull();
  });
});
