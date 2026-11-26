<script lang="ts">
  import { cn } from '../../../blocks/utils.js';
  import type { FieldSetTitleProps } from '#lib/components/ui-extra/field-set/types.js';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: FieldSetTitleProps = $props();
</script>

<div bind:this={ref} class={cn('p-6', className)} {...restProps}>
  {@render children?.()}
</div>
