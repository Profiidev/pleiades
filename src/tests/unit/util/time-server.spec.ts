import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: false }));

describe('time.svelte without a browser', () => {
  it('does not load DateTime when not in the browser', async () => {
    const time = await import('$lib/util/time.svelte');
    // Give any (unexpected) dynamic import a chance to settle.
    await Promise.resolve();
    expect(time.DateTime.DateTime).toBeUndefined();
    // Re-exports are still available.
    expect(typeof time.getLocalTimeZone).toBe('function');
  });
});
