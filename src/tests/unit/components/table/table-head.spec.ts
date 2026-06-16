import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';
import TableHead from '$lib/components/table/table-head.svelte';

describe('TableHead', () => {
  it('renders the title text', () => {
    const { getByText } = render(TableHead, { props: { title: 'Name' } });
    expect(getByText('Name')).toBeInTheDocument();
  });

  it('forwards extra props such as onclick', () => {
    const onclick = vi.fn();
    const { container } = render(TableHead, {
      props: { onclick, title: 'Name' }
    });
    fireEvent.click(container.querySelector('button') as HTMLButtonElement);
    expect(onclick).toHaveBeenCalledOnce();
  });
});
