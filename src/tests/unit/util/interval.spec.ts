import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushSync } from 'svelte';
import { interval, sleep, wait_for } from '$lib/util/interval.svelte';
import { readInitial, trackInterval } from './interval-harness.svelte';

describe('sleep', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves after the given delay', async () => {
    let done = false;
    const p = sleep(500).then(() => (done = true));
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(500);
    await p;
    expect(done).toBe(true);
  });
});

describe('wait_for', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves immediately when the condition is already true', async () => {
    await expect(wait_for(() => true)).resolves.toBe(true);
  });

  it('resolves true once the condition becomes true', async () => {
    let ready = false;
    const p = wait_for(() => ready, 100);
    await vi.advanceTimersByTimeAsync(100);
    ready = true;
    await vi.advanceTimersByTimeAsync(100);
    await expect(p).resolves.toBe(true);
  });

  it('resolves false when max timeout elapses first', async () => {
    const p = wait_for(() => false, 100, 250);
    await vi.advanceTimersByTimeAsync(250);
    await expect(p).resolves.toBe(false);
  });

  it('clears the max timeout when the condition resolves first', async () => {
    let ready = false;
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const p = wait_for(() => ready, 100, 10_000);
    ready = true;
    await vi.advanceTimersByTimeAsync(100);
    await expect(p).resolves.toBe(true);
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});

describe('interval', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns the initial value from update()', () => {
    expect(readInitial()).toBe(1);
  });

  it('updates the value on each interval tick while tracked', async () => {
    const tracked = trackInterval();
    flushSync();
    expect(tracked.observed).toBe(0);

    tracked.setCounter(5);
    await vi.advanceTimersByTimeAsync(1000);
    flushSync();
    expect(tracked.observed).toBe(5);

    tracked.cleanup();
  });

  it('stops the interval after the effect root is destroyed', async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const tracked = trackInterval();
    flushSync();
    tracked.cleanup();
    // The keyed watcher cleanup is deferred via tick()
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(0);
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('does nothing outside of an effect tracking context', () => {
    const i = interval(() => 42, 1000);
    // Reading value outside of $effect.tracking should not throw and returns init
    expect(i.value).toBe(42);
  });
});
