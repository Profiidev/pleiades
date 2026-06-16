import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { z } from 'zod/v4';
import FormSwitch from '$lib/components/form/form-switch.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ enabled: z.boolean() });

const renderSwitch = (initial: boolean, extra: Record<string, unknown> = {}) =>
  render(Harness, {
    props: {
      component: FormSwitch,
      initial: { enabled: initial },
      props: { key: 'enabled', label: 'Enabled', ...extra },
      schema
    }
  });

describe('FormSwitch', () => {
  it('renders the label and a switch', () => {
    const { getByText, container } = renderSwitch(false);
    expect(getByText('Enabled')).toBeInTheDocument();
    expect(container.querySelector('[role="switch"]')).not.toBeNull();
  });

  it('reflects the bound checked state', () => {
    const { container } = renderSwitch(true);
    expect(
      container.querySelector('[role="switch"]')?.getAttribute('aria-checked')
    ).toBe('true');
  });

  it('applies the disabled prop', () => {
    const { container } = renderSwitch(false, { disabled: true });
    const sw = container.querySelector('[role="switch"]');
    expect(
      sw?.hasAttribute('disabled') || sw?.getAttribute('data-disabled') !== null
    ).toBe(true);
  });
});
