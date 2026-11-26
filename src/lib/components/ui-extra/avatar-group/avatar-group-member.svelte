<script lang="ts">
  import AvatarRoot from '#lib/components/ui-extra/avatar/avatar.svelte';
  import { Avatar as AvatarPrimitive } from 'bits-ui';
  import { cn } from '../../../blocks/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: AvatarPrimitive.RootProps = $props();
</script>

<AvatarRoot
  bind:ref
  class={cn('bg-accent ring-background ring-2', className)}
  {...restProps}
/>
