import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { z } from 'zod/v4';
import Totp6 from '$lib/components/form/totp-6.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ code: z.string() });

const renderTotp = (extra: Record<string, unknown> = {}) =>
  render(Harness, {
    props: {
      component: Totp6,
      initial: { code: '' },
      props: { class: undefined, key: 'code', label: 'Code', ...extra },
      schema
    }
  });

describe('Totp6', () => {
  it('renders the label and the OTP input', () => {
    const { getByText, container } = renderTotp();
    expect(getByText('Code')).toBeInTheDocument();
    // Input-otp renders a hidden input collecting all six characters.
    expect(container.querySelector('input')).not.toBeNull();
  });

  it('renders six slots split into two groups', () => {
    const { container } = renderTotp();
    const slots = container.querySelectorAll('[data-slot="input-otp-slot"]');
    expect(slots.length).toBe(6);
  });

  it('applies the disabled prop', () => {
    const { container } = renderTotp({ disabled: true });
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
