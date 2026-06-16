import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';
import LoginOtherOptions from '$lib/components/form/login-other-options.svelte';

describe('LoginOtherOptions', () => {
  it('shows the Passkey label in the idle state', () => {
    const { getByText } = render(LoginOtherOptions, {
      props: { isLoading: false, passkeyClick: () => {}, passkeyError: false }
    });
    expect(getByText('Passkey')).toBeInTheDocument();
  });

  it('shows the retry label and is destructive on error', () => {
    const { getByText } = render(LoginOtherOptions, {
      props: { isLoading: false, passkeyClick: () => {}, passkeyError: true }
    });
    expect(getByText('Retry Passkey')).toBeInTheDocument();
  });

  it('disables the button while loading', () => {
    const { container } = render(LoginOtherOptions, {
      props: { isLoading: true, passkeyClick: () => {}, passkeyError: false }
    });
    const button = container.querySelector('button')!;
    expect(button.disabled).toBe(true);
  });

  it('invokes passkeyClick when pressed', async () => {
    const passkeyClick = vi.fn();
    const { container } = render(LoginOtherOptions, {
      props: { isLoading: false, passkeyClick, passkeyError: false }
    });
    fireEvent.click(container.querySelector('button')!);
    expect(passkeyClick).toHaveBeenCalledOnce();
  });
});
