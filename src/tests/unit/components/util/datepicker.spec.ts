import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { CalendarDate } from '@internationalized/date';
import Datepicker from '$lib/components/util/datepicker.svelte';

describe('Datepicker', () => {
  it('shows the placeholder when no value is set', () => {
    const { getByText } = render(Datepicker, { props: {} });
    expect(getByText('Select a date')).toBeInTheDocument();
  });

  it('formats the selected value in the trigger', () => {
    const { container } = render(Datepicker, {
      props: { value: new CalendarDate(2024, 1, 15) }
    });
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('January');
    expect(button.textContent).toContain('2024');
  });

  it('renders with start/end bounds provided', () => {
    const { container } = render(Datepicker, {
      props: {
        end: new CalendarDate(2024, 12, 31),
        start: new CalendarDate(2024, 1, 1)
      }
    });
    // A trigger button with the calendar icon is rendered.
    expect(container.querySelector('button')).not.toBeNull();
    expect(container.querySelector('svg')).not.toBeNull();
  });
});
