import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';
import Actions from '$lib/components/table/actions.svelte';

describe('Actions', () => {
  it('calls edit when edit is a function', () => {
    const edit = vi.fn();
    const { container } = render(Actions, {
      props: {
        delete_disabled: false,
        edit,
        edit_disabled: false,
        remove: () => {}
      }
    });
    const editButton = container.querySelectorAll('button')[0];
    fireEvent.click(editButton);
    expect(edit).toHaveBeenCalledOnce();
  });

  it('renders the edit button as a link when edit is a string', () => {
    const { container } = render(Actions, {
      props: {
        delete_disabled: false,
        edit: '/edit/1',
        edit_disabled: false,
        remove: () => {}
      }
    });
    expect(container.querySelector('a[href="/edit/1"]')).not.toBeNull();
  });

  it('calls remove when the delete button is clicked', () => {
    const remove = vi.fn();
    const { container } = render(Actions, {
      props: {
        delete_disabled: false,
        edit: () => {},
        edit_disabled: false,
        remove
      }
    });
    const deleteButton = container.querySelectorAll('button')[1];
    fireEvent.click(deleteButton);
    expect(remove).toHaveBeenCalledOnce();
  });

  it('disables both buttons via the disabled props', () => {
    const { container } = render(Actions, {
      props: {
        delete_disabled: true,
        edit: () => {},
        edit_disabled: true,
        remove: () => {}
      }
    });
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(true);
  });
});
