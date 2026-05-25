<script lang="ts" generics="S extends FormRecord = FormRecord">
  import * as Form from '$lib/components/ui/form';
  import {
    type FormPath,
    type SuperForm,
    type FormRecord
  } from '$lib/components/form/types';
  import * as Password from '$lib/components/ui-extra/password';
  import type { Snippet } from 'svelte';

  interface Props {
    formData: SuperForm<S>;
    key: FormPath<S>;
    label: string;
    disabled?: boolean;
    placeholder?: string;
    readonly?: boolean;
    children?: Snippet;
  }

  let {
    formData: form,
    key,
    label,
    disabled,
    placeholder,
    readonly,
    children: child
  }: Props = $props();

  let formData = $derived(form.form);
</script>

<Form.Field {form} name={key} class="gap-1/2 grid">
  <Form.Control>
    {#snippet children({ props })}
      <div class="flex items-center">
        <Form.Label>{label}</Form.Label>
        {@render child?.()}
      </div>
      <Password.Root>
        {/* @ts-ignore */ null}
        <Password.Input
          class="h-8"
          {disabled}
          {placeholder}
          {readonly}
          {...props}
          bind:value={$formData[key]}
        >
          <Password.ToggleVisibility />
        </Password.Input>
      </Password.Root>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
