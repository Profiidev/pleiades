<script lang="ts" generics="S extends FormRecord = FormRecord">
  import {
    fieldProxy,
    type FormPath,
    type SuperForm
  } from 'sveltekit-superforms';
  import * as Form from '../ui/form/index.js';
  import { Textarea } from '../ui/textarea/index.js';
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import type { FormRecord } from './types.js';

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
  }: Omit<HTMLTextareaAttributes, 'value'> & Props = $props();

  let field: any = $derived(fieldProxy(form, key));
</script>

<Form.Field {form} name={key} class="gap-1/2 grid">
  <Form.Control>
    {#snippet children({ props })}
      {#if label}
        <Form.Label>{label}</Form.Label>
      {/if}
      <Textarea {disabled} {...props} {...restProps} bind:value={$field} />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
