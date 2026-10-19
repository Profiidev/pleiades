<script lang="ts" generics="S extends FormRecord = FormRecord">
  import { fieldProxy } from 'sveltekit-superforms';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Form from '$lib/components/ui/form';
  import type {
    FormPath,
    SuperForm,
    FormRecord
  } from '$lib/components/form/types';
  import type { WithoutChildrenOrChild } from '$lib/utils';
  import { Checkbox as CheckboxPrimitive } from 'bits-ui';

  interface Props {
    formData: SuperForm<S>;
    key: FormPath<S>;
    /** Visible label; omit it for an unlabelled field and pass `aria-label` instead. */
    label?: string;
    disabled?: boolean;
    switchOrder?: boolean;
  }

  let {
    formData: form,
    key,
    label,
    disabled,
    switchOrder,
    ...restProps
  }: Props & WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();

  let field: any = $derived(fieldProxy(form, key));
</script>

<Form.Field {form} name={key} class="mt-2 flex w-full flex-col">
  <Form.Control>
    {#snippet children({ props })}
      {#if switchOrder}
        <div class="flex">
          <Checkbox
            {...props}
            {...restProps}
            {disabled}
            bind:checked={$field}
            class="mr-2"
          />
          {#if label}
            <Form.Label>{label}</Form.Label>
          {/if}
        </div>
      {:else}
        <div class="flex">
          {#if label}
            <Form.Label>{label}</Form.Label>
          {/if}
          <Checkbox
            {...props}
            {...restProps}
            {disabled}
            bind:checked={$field}
            class="ml-auto"
          />
        </div>
      {/if}
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
