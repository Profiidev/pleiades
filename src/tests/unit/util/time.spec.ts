import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: true }));

describe('time.svelte', () => {
  it('re-exports @internationalized/date helpers', async () => {
    const time = await import('$lib/util/time.svelte');
    expect(typeof time.getLocalTimeZone).toBe('function');
    expect(typeof time.CalendarDate).toBe('function');
  });

  it('lazily loads luxon DateTime in the browser', async () => {
    const time = await import('$lib/util/time.svelte');
    // The dynamic import resolves on a microtask; wait for the mutation.
    await vi.waitFor(() => expect(time.DateTime.DateTime).toBeDefined());
    expect(time.DateTime.DateTime!.now().isValid).toBe(true);
  });
});
