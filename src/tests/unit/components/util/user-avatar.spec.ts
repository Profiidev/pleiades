import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import UserAvatar from '$lib/components/util/user-avatar.svelte';

describe('UserAvatar', () => {
  it('renders uppercased initials from the first two name parts', () => {
    // The image never loads under jsdom, so the fallback initials are shown.
    const { container } = render(UserAvatar, {
      props: { userId: '1', username: 'john quincy adams' }
    });
    expect(container.textContent).toContain('JQ');
  });

  it('falls back to "?" when no username is given', () => {
    const { container } = render(UserAvatar, { props: { userId: '1' } });
    expect(container.textContent).toContain('?');
  });

  it('applies the class to the avatar root', () => {
    const { container } = render(UserAvatar, {
      props: { class: 'custom-avatar', username: 'Jane' }
    });
    expect(container.querySelector('.custom-avatar')).not.toBeNull();
  });
});
