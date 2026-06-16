import { interval } from '$lib/util/interval.svelte';

// Rune-using helpers must live in a `.svelte.ts` module. These are imported by
// The plain `.spec.ts` (where `$effect` is unavailable) to drive the reactive
// `interval` store under test.

export const readInitial = (): number => {
  let result = 0;
  const cleanup = $effect.root(() => {
    const i = interval(() => 1, 1000);
    result = i.value;
  });
  cleanup();
  return result;
};

export interface TrackedInterval {
  setCounter: (n: number) => void;
  readonly observed: number;
  cleanup: () => void;
}

export const trackInterval = (): TrackedInterval => {
  let counter = 0;
  let observed = 0;
  const cleanup = $effect.root(() => {
    const i = interval(() => counter, 1000);
    $effect(() => {
      observed = i.value;
    });
  });
  return {
    cleanup,
    get observed() {
      return observed;
    },
    setCounter: (n: number) => (counter = n)
  };
};
