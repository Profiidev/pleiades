<script lang="ts">
  import { Tooltip as TooltipPrimitive } from 'bits-ui';
  import TooltipProvider from '#lib/components/ui-extra/tooltip/tooltip-provider.svelte';

  let { open = $bindable(false), ...restProps }: TooltipPrimitive.RootProps =
    $props();
</script>

<TooltipProvider>
  <TooltipPrimitive.Root bind:open {...restProps} />
</TooltipProvider>
