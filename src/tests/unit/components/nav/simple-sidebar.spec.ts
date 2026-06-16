import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import SimpleSidebar from '$lib/components/nav/simple-sidebar.svelte';

const items = [
  { href: '/', title: 'Home' },
  { href: '/settings', title: 'Settings' }
];

describe('SimpleSidebar', () => {
  it('renders a link for each item', () => {
    const { getByText, container } = render(SimpleSidebar, {
      props: { class: undefined, items }
    });
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Settings')).toBeInTheDocument();
    expect(container.querySelectorAll('a').length).toBe(2);
  });

  it('marks the item matching the current page as active', () => {
    // The mocked page url is http://localhost/ -> pathname '/'.
    const { container } = render(SimpleSidebar, {
      props: { class: undefined, items }
    });
    // The active item renders an extra highlight div.
    expect(container.querySelector('.bg-muted')).not.toBeNull();
  });

  it('applies the provided class to the nav element', () => {
    const { container } = render(SimpleSidebar, {
      props: { class: 'extra-nav', items }
    });
    expect(container.querySelector('nav.extra-nav')).not.toBeNull();
  });
});
