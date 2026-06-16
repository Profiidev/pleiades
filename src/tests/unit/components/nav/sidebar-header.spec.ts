import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import SidebarHeader from '$lib/components/nav/sidebar/sidebar-header.svelte';
import Harness from './sidebar-harness.svelte';

const base = { app_name: 'Pleiades', version: 'v1.2.3' };

describe('SidebarHeader', () => {
  it('renders the app name and version', () => {
    const { getByText } = render(Harness, {
      props: { component: SidebarHeader, props: base }
    });
    expect(getByText('Pleiades')).toBeInTheDocument();
    expect(getByText('v1.2.3')).toBeInTheDocument();
  });

  it('links the header to the home route', () => {
    const { container } = render(Harness, {
      props: { component: SidebarHeader, props: base }
    });
    expect(container.querySelector('a[href="/"]')).not.toBeNull();
  });

  it('renders the toggle button with an accessible label', () => {
    const { container } = render(Harness, {
      props: { component: SidebarHeader, props: base }
    });
    expect(
      container.querySelector('[aria-label="Open/Close Sidebar"]')
    ).not.toBeNull();
  });
});
