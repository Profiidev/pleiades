<script lang="ts">
  import { cn } from '../../../blocks/utils.js';
  import type { AvatarGroupEtcProps } from '#lib/components/ui-extra/avatar-group/types.js';

  let {
    ref = $bindable(null),
    plus,
    class: className,
    ...rest
  }: AvatarGroupEtcProps = $props();
</script>

<div
  {...rest}
  bind:this={ref}
  class={cn(
    'bg-accent ring-background relative flex size-8 items-center justify-center rounded-full text-xs ring-2',
    className
  )}
>
  <span>+{plus}</span>
</div>
