import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { z } from 'zod/v4';
import FormInputPassword from '$lib/components/form/form-input-password.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ pw: z.string() });

const renderPw = (extra: Record<string, unknown> = {}) =>
  render(Harness, {
    props: {
      component: FormInputPassword,
      initial: { pw: 'secret' },
      props: { key: 'pw', label: 'Password', ...extra },
      schema
    }
  });

describe('FormInputPassword', () => {
  it('renders the label and a password input bound to the field', () => {
    const { getByText, container } = renderPw();
    expect(getByText('Password')).toBeInTheDocument();
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe('secret');
  });

  it('renders the visibility toggle', () => {
    const { container } = renderPw();
    expect(container.querySelector('button')).not.toBeNull();
  });

  it('renders an optional children snippet next to the label', () => {
    const children = createRawSnippet(() => ({
      render: () => `<span data-testid="extra">extra</span>`
    }));
    const { getByTestId } = renderPw({ children });
    expect(getByTestId('extra')).toBeInTheDocument();
  });

  it('applies disabled, readonly and placeholder props', () => {
    const { container } = renderPw({
      disabled: true,
      placeholder: 'enter',
      readonly: true
    });
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.readOnly).toBe(true);
    expect(input.placeholder).toBe('enter');
  });
});
