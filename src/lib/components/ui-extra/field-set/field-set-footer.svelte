<script lang="ts">
  import { cn } from '../../../blocks/utils.js';
  import type { FieldSetFooterProps } from '#lib/components/ui-extra/field-set/types.js';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: FieldSetFooterProps = $props();
</script>

<div
  bind:this={ref}
  class={cn('border-t border-inherit px-6 py-3', className)}
  {...rest}
>
  {@render children?.()}
</div>
