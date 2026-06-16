import { describe, expect, it } from 'vitest';
import { ModeWatcher, toast } from '$lib/components/util/general';

describe('components/util/general', () => {
  it('re-exports the ModeWatcher component', () => {
    expect(ModeWatcher).toBeDefined();
  });

  it('re-exports the toast helper', () => {
    expect(toast).toBeDefined();
    expect(typeof toast).toBe('function');
  });
});
