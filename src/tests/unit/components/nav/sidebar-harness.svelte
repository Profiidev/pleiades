<script lang="ts">
  import type { Component } from 'svelte';
  import * as Sidebar from '$lib/components/ui/sidebar';

  // The sidebar sub-components call `Sidebar.useSidebar()`, which requires a
  // `Sidebar.Provider` ancestor. This harness supplies it.
  interface Props {
    component: Component<any>;
    props?: Record<string, unknown>;
  }

  let { component: Comp, props = {} }: Props = $props();
</script>

<Sidebar.Provider>
  <Comp {...props} />
</Sidebar.Provider>
