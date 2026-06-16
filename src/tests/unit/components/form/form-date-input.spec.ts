import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { z } from 'zod/v4';
import FormDateInput from '$lib/components/form/form-date-input.svelte';
import Harness from './form-harness.svelte';

const schema = z.object({ date: z.date() });

const renderDate = (extra: Record<string, unknown> = {}) =>
  render(Harness, {
    props: {
      component: FormDateInput,
      initial: { date: new Date(2024, 0, 15) },
      props: { key: 'date', label: 'Birthday', ...extra },
      schema
    }
  });

describe('FormDateInput', () => {
  it('renders the label and a trigger button with the formatted date', () => {
    const { getByText, container } = renderDate();
    expect(getByText('Birthday')).toBeInTheDocument();
    const button = container.querySelector('button')!;
    expect(button).not.toBeNull();
    // Formatted as a localized date – should contain the year.
    expect(button.textContent).toContain('2024');
  });

  it('applies the disabled prop to the trigger', () => {
    const { container } = renderDate({ disabled: true });
    const button = container.querySelector('button')!;
    expect(button.disabled).toBe(true);
  });
});
