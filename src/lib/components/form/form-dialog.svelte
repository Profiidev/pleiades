<script lang="ts" generics="V extends ZodValidationSchema">
  import * as Dialog from '../ui/dialog/index.js';
  import type { Component, Snippet } from 'svelte';
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
    retryText?: string;
    confirmVariant?: ButtonVariant;
    confirmIcon?: Component;
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
    ) => Error<V> | undefined | void | Promise<Error<V> | undefined | void>;
    children?: Snippet<
      [{ props: { formData: SuperForm<FormValue<V>>; disabled: boolean } }]
    >;
    triggerInner?: Snippet;
    schema: V;
    initialValue?: FormValue<V>;
    enctype?: FormEnctype;
    noErrorToast?: boolean;
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
    enctype,
    retryText = 'Retry',
    confirmIcon,
    noErrorToast
  }: Props = $props();

  let formComp: BaseForm<V> | undefined = $state();
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
      {schema}
      {initialValue}
      {enctype}
      onsubmit={submit}
      {children}
      {noErrorToast}
    >
      {#snippet footer({ defaultBtn, isError })}
        <Dialog.Footer>
          {@render defaultBtn({
            variant: isError ? 'destructive' : confirmVariant,
            content: isError ? retryText : confirm,
            icon: confirmIcon
          })}
        </Dialog.Footer>
      {/snippet}
    </Form>
  </Dialog.Content>
</Dialog.Root>
