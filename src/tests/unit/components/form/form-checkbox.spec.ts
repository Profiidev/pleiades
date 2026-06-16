import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { z } from 'zod/v4';
import FormCheckbox from '$lib/components/form/form-checkbox.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ agree: z.boolean() });

const renderCheckbox = (extra: Record<string, unknown> = {}) =>
  render(Harness, {
    props: {
      component: FormCheckbox,
      initial: { agree: true },
      props: { key: 'agree', label: 'Agree', ...extra },
      schema
    }
  });

describe('FormCheckbox', () => {
  it('renders the label and a checkbox', () => {
    const { getByText, container } = renderCheckbox();
    expect(getByText('Agree')).toBeInTheDocument();
    expect(container.querySelector('[role="checkbox"]')).not.toBeNull();
  });

  it('reflects the bound checked state', () => {
    const { container } = renderCheckbox();
    const box = container.querySelector('[role="checkbox"]');
    expect(box?.getAttribute('aria-checked')).toBe('true');
  });

  it('renders the checkbox before the label when switchOrder is set', () => {
    const { container } = renderCheckbox({ switchOrder: true });
    const box = container.querySelector('[role="checkbox"]');
    expect(box?.className).toContain('mr-2');
  });

  it('renders the checkbox after the label by default', () => {
    const { container } = renderCheckbox();
    const box = container.querySelector('[role="checkbox"]');
    expect(box?.className).toContain('ml-auto');
  });

  it('applies the disabled prop', () => {
    const { container } = renderCheckbox({ disabled: true });
    const box = container.querySelector('[role="checkbox"]');
    expect(
      box?.hasAttribute('disabled') ||
        box?.getAttribute('data-disabled') !== null
    ).toBe(true);
  });
});
