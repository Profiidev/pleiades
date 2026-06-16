<script lang="ts">
  import type { Component } from 'svelte';
  import { defaults, superForm, type SuperForm } from 'sveltekit-superforms';
  import {
    zod4,
    type ZodValidationSchema
  } from 'sveltekit-superforms/adapters';

  // Generic harness: builds a real SuperForm from a zod schema and renders the
  // component under test with it. `bindForm` lets a test capture the form
  // instance to assert on its store values.
  interface Props {
    schema: ZodValidationSchema;
    initial?: Record<string, unknown>;
    component: Component<any>;
    props?: Record<string, unknown>;
    bindForm?: (form: SuperForm<Record<string, unknown>>) => void;
  }

  let {
    schema,
    initial,
    component: Comp,
    props = {},
    bindForm
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  const form = superForm(defaults(initial, zod4(schema) as any), {
    // svelte-ignore state_referenced_locally
    validators: zod4(schema),
    SPA: true,
    invalidateAll: false
  });

  // svelte-ignore state_referenced_locally
  bindForm?.(form as SuperForm<Record<string, unknown>>);
</script>

<Comp formData={form} {...props} />
