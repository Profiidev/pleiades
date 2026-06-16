import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { fireEvent, waitFor } from '@testing-library/dom';
import MultistepForm from '$lib/components/form/multistep-form.svelte';
import TestStage from './test-stage.svelte';

const makeStages = () => [
  { content: TestStage, data: { a: 1 }, title: 'Step One' },
  { content: TestStage, data: { b: 2 }, title: 'Step Two' }
];

const submitStage = (container: HTMLElement) =>
  fireEvent.submit(container.querySelector('form') as HTMLFormElement);

describe('MultistepForm', () => {
  it('renders the first stage title and step badges', () => {
    const { getByText, container } = render(MultistepForm, {
      props: { onsubmit: vi.fn(), stages: makeStages() }
    });
    expect(getByText('Step One')).toBeInTheDocument();
    // Two stages -> a badge row with two badges.
    expect(container.querySelectorAll('[data-slot="badge"]').length).toBe(2);
  });

  it('advances to the next stage on submit', async () => {
    const { getByText, container } = render(MultistepForm, {
      props: { onsubmit: vi.fn(), stages: makeStages() }
    });
    submitStage(container);
    await waitFor(() => expect(getByText('Step Two')).toBeInTheDocument());
  });

  it('calls onsubmit with the merged data after the final stage', async () => {
    const onsubmit = vi.fn();
    const { container } = render(MultistepForm, {
      props: { onsubmit, stages: makeStages() }
    });
    submitStage(container); // Stage 0 -> 1
    await waitFor(() => expect(container.textContent).toContain('Step Two'));
    submitStage(container); // Stage 1 (final) -> submit
    await waitFor(() => expect(onsubmit).toHaveBeenCalledWith({ a: 1, b: 2 }));
  });

  it('renders a cancel button when cancelHref is given', () => {
    const { container } = render(MultistepForm, {
      props: { cancelHref: '/back', onsubmit: vi.fn(), stages: makeStages() }
    });
    expect(container.querySelector('a[href="/back"]')).not.toBeNull();
  });

  it('starts on the configured initial step', () => {
    const { getByText } = render(MultistepForm, {
      props: { initStep: 1, onsubmit: vi.fn(), stages: makeStages() }
    });
    expect(getByText('Step Two')).toBeInTheDocument();
  });

  it('omits the badge row for a single stage', () => {
    const { container } = render(MultistepForm, {
      props: {
        onsubmit: vi.fn(),
        stages: [{ content: TestStage, data: {}, title: 'Only' }]
      }
    });
    expect(container.querySelectorAll('[data-slot="badge"]').length).toBe(0);
  });
});
