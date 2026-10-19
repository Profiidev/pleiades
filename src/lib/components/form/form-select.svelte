<script lang="ts" generics="T, S extends FormRecord = FormRecord">
  import { fieldProxy } from 'sveltekit-superforms';
  import * as Form from '../ui/form/index.js';
  import { type FormPath, type SuperForm } from 'sveltekit-superforms';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import Multiselect, {
    type Group,
    type Item
  } from '../table/multiselect.svelte';
  import type { FormRecord } from './types.js';

  interface Props {
    formData: SuperForm<S>;
    key: FormPath<S>;
    /** Visible label; omit it for an unlabelled field and pass `aria-label` instead. */
    label?: string;
    disabled?: boolean;
    data: Group<T>[] | Item<T>[];
    filter?: (data: Item<T>) => boolean;
    compare?: (a: T, b: T) => boolean;
    single?: boolean;
    onSelectChange?: (selected: T[]) => void;
  }

  let {
    formData: form,
    key,
    label,
    disabled,
    ...restProps
  }: HTMLInputAttributes & Props = $props();

  let field = $derived(fieldProxy(form, key));
</script>

<Form.Field {form} name={key} class="gap-1/2 grid">
  <Form.Control>
    {#snippet children({ props })}
      {#if label}
        <Form.Label>{label}</Form.Label>
      {/if}
      {/* @ts-ignore */ null}
      <Multiselect
        {disabled}
        {label}
        {...props}
        {...restProps}
        bind:selected={$field}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
