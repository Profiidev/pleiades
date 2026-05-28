<script lang="ts" generics="S extends FormRecord = FormRecord">
  import { Switch } from '../ui/switch/index.js';
  import * as Form from '../ui/form/index.js';
  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  import type { FormRecord } from './types.js';
  import type { WithoutChildrenOrChild } from '$lib/utils.js';
  import { Switch as SwitchPrimitive } from 'bits-ui';

  interface Props {
    formData: SuperForm<S>;
    key: FormPath<S>;
    label: string;
    disabled?: boolean;
  }

  let {
    formData: form,
    key,
    label,
    disabled,
    ...restProps
  }: Props & WithoutChildrenOrChild<SwitchPrimitive.RootProps> = $props();

  let formData: any = $derived(form.form);
</script>

<Form.Field {form} name={key} class="mt-2 flex w-full items-center">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>{label}</Form.Label>
      <Switch
        {...props}
        {...restProps}
        bind:checked={$formData[key]}
        {disabled}
        class="ml-auto"
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
