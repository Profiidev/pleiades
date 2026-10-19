<script lang="ts" generics="S extends FormRecord = FormRecord">
  import { fieldProxy } from 'sveltekit-superforms';
  import { Switch } from '../ui/switch/index.js';
  import * as Form from '../ui/form/index.js';
  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import type { FormRecord } from './types.js';
  import type { WithoutChildrenOrChild } from '$lib/utils.js';
  import { Switch as SwitchPrimitive } from 'bits-ui';

  interface Props {
    formData: SuperForm<S>;
    key: FormPath<S>;
    /** Visible label; omit it for an unlabelled field and pass `aria-label` instead. */
    label?: string;
    disabled?: boolean;
  }

  let {
    formData: form,
    key,
    label,
    disabled,
    ...restProps
  }: Props & WithoutChildrenOrChild<SwitchPrimitive.RootProps> = $props();

  let field: any = $derived(fieldProxy(form, key));
</script>

<Form.Field {form} name={key} class="mt-2 flex w-full items-center">
  <Form.Control>
    {#snippet children({ props })}
      {#if label}
        <Form.Label>{label}</Form.Label>
      {/if}
      <Switch
        {...props}
        {...restProps}
        bind:checked={$field}
        {disabled}
        class="ml-auto"
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
