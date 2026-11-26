<script lang="ts">
  import { useModalSub } from '#lib/components/ui-extra/modal/modal.svelte.js';
  import * as Dialog from '#lib/components/ui-extra/dialog/index.js';
  import * as Drawer from '#lib/components/ui-extra/drawer/index.js';
  import type { DialogDescriptionProps } from 'bits-ui';

  const modal = useModalSub();

  let { ref = $bindable(null), ...rest }: DialogDescriptionProps = $props();
</script>

{#if modal.view === 'desktop'}
  <Dialog.Description bind:ref {...rest} />
{:else}
  <Drawer.Description bind:ref {...rest} />
{/if}
