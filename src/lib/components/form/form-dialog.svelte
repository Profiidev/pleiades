<script lang="ts" generics="V extends ZodValidationSchema">
  import * as Dialog from '../ui/dialog/index.js';
  import type { Snippet } from 'svelte';
  import {
    Button,
    type ButtonSize,
    type ButtonVariant
  } from '../ui/button/index.js';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import { type SuperForm } from 'sveltekit-superforms';
  import type { Error, FormEnctype, FormValue } from './types.js';
  import Form from './base-form.svelte';
  import { wait_for } from '$lib/util/interval.svelte';
  import { type ZodValidationSchema } from 'sveltekit-superforms/adapters';
  import BaseForm from './base-form.svelte';

  interface Props {
    title: string;
    description?: string;
    confirm: string;
    confirmVariant?: ButtonVariant;
    open?: boolean;
    class?: string;
    isLoading?: boolean;
    trigger?: {
      text?: string;
      variant?: ButtonVariant;
      class?: string;
      size?: ButtonSize;
      loadIcon?: boolean;
      disabled?: boolean;
    };
    onopen?: () => boolean | Promise<boolean>;
    onsubmit: (
      form: FormValue<V>
    ) => Error | undefined | void | Promise<Error | undefined | void>;
    children?: Snippet<
      [{ props: { formData: SuperForm<FormValue<V>>; disabled: boolean } }]
    >;
    triggerInner?: Snippet;
    schema: V;
    initialValue?: FormValue<V>;
    enctype?: FormEnctype;
  }

  let {
    title,
    description = '',
    confirm,
    confirmVariant = 'default',
    open = $bindable(false),
    class: className,
    trigger,
    isLoading = $bindable(false),
    onopen = () => true,
    onsubmit,
    children,
    triggerInner,
    schema,
    initialValue,
    enctype
  }: Props = $props();

  let formComp: BaseForm<V> | undefined = $state();
  let error = $state('');
  let formSetValue = $derived(formComp?.setValue);
  let formGetValue = $derived(formComp?.getValue);

  const submit = async (form: FormValue<V>) => {
    let ret = await onsubmit(form);
    if (!ret) {
      open = false;
    }
    return ret;
  };

  export const openFn = async () => {
    isLoading = true;
    if (await onopen()) {
      open = true;
      error = '';
    }
    isLoading = false;
  };

  export const setValue = async (value: FormValue<V>) => {
    if (await wait_for(() => formSetValue !== undefined, 10, 500)) {
      formSetValue!(value);
    }
  };

  export const getValue = () => {
    if (formGetValue) {
      return formGetValue();
    }
  };
</script>

{#if trigger}
  <Button
    variant={trigger.variant}
    onclick={openFn}
    class={trigger.class}
    size={trigger.size}
    disabled={isLoading || trigger.disabled}
  >
    {#if isLoading && trigger.loadIcon}
      <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
    {/if}
    {trigger.text}
    {@render triggerInner?.()}
  </Button>
{/if}
<Dialog.Root bind:open>
  <Dialog.Content class={className}>
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
    </Dialog.Header>
    <Form
      bind:this={formComp}
      bind:isLoading
      bind:error
      {schema}
      {initialValue}
      {enctype}
      onsubmit={submit}
      {children}
    >
      {#snippet footer({ defaultBtn })}
        <Dialog.Footer>
          {@render defaultBtn({ variant: confirmVariant, content: confirm })}
        </Dialog.Footer>
      {/snippet}
    </Form>
  </Dialog.Content>
</Dialog.Root>
