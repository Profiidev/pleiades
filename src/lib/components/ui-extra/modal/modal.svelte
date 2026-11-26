<script lang="ts">
  import * as Dialog from '#lib/components/ui-extra/dialog/index.js';
  import * as Drawer from '#lib/components/ui-extra/drawer/index.js';
  import type { DialogRootProps } from 'bits-ui';
  import { useModal } from '#lib/components/ui-extra/modal/modal.svelte.js';

  let {
    open = $bindable(false),
    children,
    ...rest
  }: DialogRootProps = $props();

  const modal = useModal();
</script>

{#if modal.view === 'desktop'}
  <Dialog.Root bind:open {...rest}>
    {@render children?.()}
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open {...rest}>
    {@render children?.()}
  </Drawer.Root>
{/if}
