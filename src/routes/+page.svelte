<script lang="ts">
  import BaseForm from '$lib/components/form/base-form.svelte';
  import FormSwitch from '$lib/components/form/form-switch.svelte';
  import { z } from 'zod/v4';
</script>

<BaseForm
  schema={z.object({
    switch: z.boolean()
  })}
  onsubmit={(data) => console.log(data)}
>
  {#snippet children({ props })}
    <FormSwitch {...props} key="switch" label="123" disabled />
  {/snippet}
</BaseForm>
