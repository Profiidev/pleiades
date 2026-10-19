<script lang="ts" generics="S extends FormRecord = FormRecord">
  import { fieldProxy } from 'sveltekit-superforms';
  import type {
    FormRecord,
    SuperForm,
    FormPath
  } from '$lib/components/form/types';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import type { Snippet } from 'svelte';

  interface Props {
    formData: SuperForm<S>;
    key: FormPath<S>;
    id: string;
    value: any;
    children: Snippet;
  }

  const { formData: form, key, id, value, children }: Props = $props();

  let field = $derived(fieldProxy(form, key));
</script>

{#if $field}
  <Label for={id} class="flex">
    {@render children()}
  </Label>
  <Input {id} {value} readonly />
{/if}
