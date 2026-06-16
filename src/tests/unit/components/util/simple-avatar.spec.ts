import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import SimpleAvatar from '$lib/components/util/simple-avatar.svelte';

describe('SimpleAvatar', () => {
  it('renders the avatar fallback and applies the class', () => {
    const { container } = render(SimpleAvatar, {
      props: { class: 'custom-avatar', src: 'AAAA' }
    });
    // The fallback renders until the (data-uri) image loads, which never
    // Happens under jsdom, so the "?" placeholder is present.
    expect(container.textContent).toContain('?');
    expect(container.querySelector('.custom-avatar')).not.toBeNull();
  });
});
