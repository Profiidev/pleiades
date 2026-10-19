<script lang="ts" generics="S extends FormRecord = FormRecord">
  import { fieldProxy } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';
  import {
    type FormPath,
    type SuperForm,
    type FormRecord
  } from '$lib/components/form/types';
  import { Input } from '$lib/components/ui/input';
  import type {
    HTMLInputAttributes,
    HTMLInputTypeAttribute
  } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import Info from '@lucide/svelte/icons/info';

  type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

  type InputProps = WithElementRef<
    Omit<HTMLInputAttributes, 'type'> &
      (
        | { type: 'file'; files?: FileList }
        | { type?: InputType; files?: undefined }
      )
  >;

  interface Props {
    formData: SuperForm<S>;
    key: FormPath<S>;
    /** Visible label; omit it for an unlabelled field and pass `aria-label` instead. */
    label?: string;
    disabled?: boolean;
    tooltip?: string;
  }

  let {
    formData: form,
    key,
    label,
    disabled,
    tooltip,
    ...restProps
  }: InputProps & Props = $props();

  let field = $derived(fieldProxy(form, key));
</script>

<Form.Field {form} name={key} class="gap-1/2 grid">
  <Form.Control>
    {#snippet children({ props })}
      <div class="flex gap-2">
        {#if label}
          <Form.Label>{label}</Form.Label>
        {/if}
        {#if tooltip}
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Info class="size-4" />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>{tooltip}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        {/if}
      </div>
      <Input {disabled} {...props} {...restProps} bind:value={$field} />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
