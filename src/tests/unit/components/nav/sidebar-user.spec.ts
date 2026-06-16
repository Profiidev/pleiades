import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import SidebarUser from '$lib/components/nav/sidebar/sidebar-user.svelte';
import Harness from './sidebar-harness.svelte';

describe('SidebarUser', () => {
  it('renders the user name and email when a user is present', () => {
    const { getByText } = render(Harness, {
      props: {
        component: SidebarUser,
        props: {
          logout: vi.fn(async () => ({})),
          user: { email: 'ann@example.com', name: 'Ann', permissions: [] }
        }
      }
    });
    expect(getByText('Ann')).toBeInTheDocument();
    expect(getByText('ann@example.com')).toBeInTheDocument();
  });

  it('renders skeletons when there is no user', () => {
    const { container } = render(Harness, {
      props: {
        component: SidebarUser,
        props: { logout: vi.fn(async () => ({})), user: undefined }
      }
    });
    // No name/email text, only skeleton placeholders.
    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull();
  });
});
