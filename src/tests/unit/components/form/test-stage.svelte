<script lang="ts">
  import type { Snippet } from 'svelte';

  // Minimal StageComponent used to drive multistep-form in tests. It renders the
  // provided footer snippet inside a <form>; submitting calls `onsubmit` with the
  // stage's data, and `getValue` exposes that data back to the parent.
  interface Props {
    initialValue?: Record<string, unknown>;
    onsubmit: (data: Record<string, unknown>) => unknown;
    footer: Snippet<[{ isLoading: boolean; isError: boolean }]>;
    isLoading?: boolean;
    data?: unknown;
  }

  let {
    initialValue,
    onsubmit,
    footer,
    isLoading = $bindable(false)
  }: Props = $props();

  export const getValue = () => initialValue ?? {};

  const handle = (e: SubmitEvent) => {
    e.preventDefault();
    onsubmit(getValue());
  };
</script>

<form onsubmit={handle}>
  {@render footer({ isLoading, isError: false })}
</form>
