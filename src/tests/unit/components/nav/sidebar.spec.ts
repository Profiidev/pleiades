import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Sidebar from '$lib/components/nav/sidebar/sidebar.svelte';

const children = createRawSnippet(() => ({
  render: () => `<main data-testid="page">content</main>`
}));

const items = [{ items: [{ href: '/', label: 'Home' }], label: 'Main' }];

const baseProps = {
  app_name: 'Pleiades',
  children,
  items,
  logout: vi.fn(async () => ({})),
  version: 'v1'
};

describe('Sidebar', () => {
  it('renders the header, nav items and page content', () => {
    const { getByText, getByTestId } = render(Sidebar, {
      props: {
        ...baseProps,
        user: { email: 'ann@example.com', name: 'Ann', permissions: [] }
      }
    });
    expect(getByText('Pleiades')).toBeInTheDocument();
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Ann')).toBeInTheDocument();
    expect(getByTestId('page')).toBeInTheDocument();
  });

  it('renders loading state when no user is provided', () => {
    const { getByText } = render(Sidebar, { props: baseProps });
    expect(getByText('Loading...')).toBeInTheDocument();
  });
});
