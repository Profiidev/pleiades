import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import SidebarContent from '$lib/components/nav/sidebar/sidebar-content.svelte';
import Harness from './sidebar-harness.svelte';

const items = [
  {
    items: [
      { href: '/', label: 'Home' },
      { href: '/admin', label: 'Admin', requiredPermission: 'admin' }
    ],
    label: 'Main'
  },
  {
    items: [{ href: '/secret', label: 'Secret', requiredPermission: 'root' }],
    label: 'Empty'
  }
];

const user = {
  email: 'ann@example.com',
  name: 'Ann',
  permissions: ['admin']
};

describe('SidebarContent', () => {
  it('shows loading skeletons when there is no user', () => {
    const { getByText } = render(Harness, {
      props: { component: SidebarContent, props: { items, user: undefined } }
    });
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('renders items the user is permitted to see', () => {
    const { getByText, queryByText } = render(Harness, {
      props: { component: SidebarContent, props: { items, user } }
    });
    expect(getByText('Home')).toBeInTheDocument();
    // 'admin' permission is granted.
    expect(getByText('Admin')).toBeInTheDocument();
    // 'root' permission missing -> the whole 'Empty' group is dropped.
    expect(queryByText('Secret')).toBeNull();
    expect(queryByText('Empty')).toBeNull();
  });

  it('renders the group label', () => {
    const { getByText } = render(Harness, {
      props: { component: SidebarContent, props: { items, user } }
    });
    expect(getByText('Main')).toBeInTheDocument();
  });
});
