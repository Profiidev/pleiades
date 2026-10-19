<script lang="ts" generics="T, S extends FormRecord = FormRecord">
  import { fieldProxy } from 'sveltekit-superforms';
  import * as Form from '$lib/components/ui/form';
  import { type FormPath, type SuperForm } from 'sveltekit-superforms';
  import type { FormRecord } from '$lib/components/form/types';
  import { TagsInput } from '$lib/components/ui-extra/tags-input';

  interface Props {
    formData: SuperForm<S>;
    key: FormPath<S>;
    label: string;
    disabled?: boolean;
    suggestions?: string[];
    validate?: (val: string, tags: string[]) => string | undefined;
    onValueChange?: (selected: string[]) => void;
    placeholder?: string;
  }

  let {
    formData: form,
    key,
    label,
    disabled,
    onValueChange,
    suggestions,
    validate,
    placeholder
  }: Props = $props();

  let field = $derived(fieldProxy(form, key));
</script>

<Form.Field {form} name={key} class="gap-1/2 grid">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>{label}</Form.Label>
      {/* @ts-ignore */ null}
      <TagsInput
        {placeholder}
        bind:value={$field}
        {suggestions}
        {validate}
        {disabled}
        {onValueChange}
      />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
