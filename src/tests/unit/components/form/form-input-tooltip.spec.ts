import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { z } from 'zod/v4';
import FormInputTooltip from '$lib/components/form/form-input-tooltip.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ name: z.string() });

const renderTooltip = (extra: Record<string, unknown> = {}) =>
  render(Harness, {
    props: {
      component: FormInputTooltip,
      initial: { name: 'x' },
      props: { key: 'name', label: 'Name', ...extra },
      schema
    }
  });

describe('FormInputTooltip', () => {
  it('renders label and input without a tooltip trigger by default', () => {
    const { getByText, container } = renderTooltip();
    expect(getByText('Name')).toBeInTheDocument();
    expect(container.querySelector('input')).not.toBeNull();
    // The info/tooltip trigger only exists when a tooltip is provided.
    expect(container.querySelector('[data-slot="tooltip-trigger"]')).toBeNull();
  });

  it('renders a tooltip trigger when a tooltip is provided', () => {
    const { container } = renderTooltip({ tooltip: 'Helpful' });
    expect(
      container.querySelector('[data-slot="tooltip-trigger"]')
    ).not.toBeNull();
  });

  it('applies the disabled prop to the input', () => {
    const { container } = renderTooltip({ disabled: true });
    expect(
      (container.querySelector('input') as HTMLInputElement).disabled
    ).toBe(true);
  });
});
