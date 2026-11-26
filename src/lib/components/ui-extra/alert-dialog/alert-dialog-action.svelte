<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
  import {
    buttonVariants,
    type ButtonVariant,
    type ButtonSize
  } from '#lib/components/ui-extra/button/index.js';
  import { cn } from '../../../blocks/utils.js';
  import { Spinner } from '#lib/components/ui-extra/spinner/index.js';

  let {
    ref = $bindable(null),
    class: className,
    variant = 'default',
    size = 'default',
    loading = false,
    children,
    ...restProps
  }: AlertDialogPrimitive.ActionProps & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
  } = $props();
</script>

<AlertDialogPrimitive.Action
  bind:ref
  data-slot="alert-dialog-action"
  class={cn(
    buttonVariants({ variant, size }),
    'cn-alert-dialog-action',
    className
  )}
  {...restProps}
>
  {#if loading}
    <Spinner data-icon="inline-start" />
  {/if}
  {@render children?.()}
</AlertDialogPrimitive.Action>
