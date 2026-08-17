<script lang="ts" generics="V extends ZodValidationSchema">
  import type { Component, Snippet } from 'svelte';
  import { get } from 'svelte/store';
  import {
    defaults,
    setError,
    superForm,
    type SuperForm
  } from 'sveltekit-superforms';
  import {
    zod4,
    type ValidationAdapter,
    type ZodValidationSchema
  } from 'sveltekit-superforms/adapters';
  import { FormButton } from '../ui/form/index.js';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import RotateCCW from '@lucide/svelte/icons/rotate-ccw';
  import type { ButtonVariant } from '../ui/button/index.js';
  import { cn } from '../../utils.js';
  import type { Error, FormEnctype, FormValue } from './types.js';
  import { toast } from 'svelte-sonner';

  interface Props {
    schema: V;
    initialValue?: Partial<FormValue<V>>;
    onsubmit: (
      form: FormValue<V>
    ) => Error<V> | undefined | void | Promise<Error<V> | undefined | void>;
    children?: Snippet<
      [{ props: { formData: SuperForm<FormValue<V>>; disabled: boolean } }]
    >;
    footer?: Snippet<
      [
        {
          defaultBtn: Snippet<
            [
              {
                className?: string;
                variant?: ButtonVariant;
                content: string;
                icon?: Component;
              }
            ]
          >;
          isLoading: boolean;
          isError: boolean;
        }
      ]
    >;
    isLoading?: boolean;
    class?: string;
    enctype?: FormEnctype;
    noErrorToast?: boolean;
    submitText?: string;
    retryText?: string;
    submitIcon?: Component;
  }

  let {
    schema,
    initialValue,
    onsubmit,
    children,
    footer = defaultFooter,
    isLoading = $bindable(false),
    class: className,
    enctype,
    noErrorToast,
    submitText = 'Submit',
    retryText = 'Retry',
    submitIcon
  }: Props = $props();

  let isError = $state(false);

  // svelte-ignore state_referenced_locally
  let form = superForm(
    defaults(
      initialValue,
      zod4(schema) as ValidationAdapter<FormValue<V>, FormValue<V>>
    ),
    {
      validators: zod4(schema),
      SPA: true,
      invalidateAll: false,
      onUpdate: async ({ form, cancel }) => {
        if (!form.valid) return;

        isLoading = true;
        let ret = await onsubmit(form.data);
        isLoading = false;

        if (ret) {
          if (ret.field) {
            isError = true;
            setError(form, ret.field as '', ret.error, undefined);
          } else {
            if (ret.error !== '') {
              isError = true;
              if (!noErrorToast) {
                toast.error(ret.error);
              }
            } else {
              isError = false;
            }
            cancel();
          }
        }
      }
    }
  );

  let { enhance } = form;

  export const setValue = (value: FormValue<V>) => {
    let old = get(form.form);

    //@ts-ignore
    let newValue: FormValue<V> = {};
    for (const key in old) {
      newValue[key] = value[key] ?? old[key];
    }

    form.form.set(newValue);
  };

  export const getValue = () => {
    return get(form.form);
  };
</script>

<form method="POST" class={cn('grid gap-3', className)} use:enhance {enctype}>
  {@render children?.({ props: { formData: form, disabled: isLoading } })}
  {@render footer({ defaultBtn: formButton, isLoading, isError })}
</form>

{#snippet defaultFooter({
  defaultBtn
}: {
  defaultBtn: Snippet<
    [
      {
        className?: string;
        variant?: ButtonVariant;
        content: string;
        icon?: Component;
      }
    ]
  >;
})}
  {@render defaultBtn({
    variant: isError ? 'destructive' : undefined,
    content: isError ? retryText : submitText,
    icon: submitIcon
  })}
{/snippet}

{#snippet formButton(props: {
  className?: string;
  variant?: ButtonVariant;
  content: string;
  icon?: Component;
})}
  {@const prop = { ...props }}
  <FormButton
    class={cn('cursor-pointer', prop.className)}
    type="submit"
    disabled={isLoading}
    variant={prop.variant}
  >
    {#if isLoading}
      <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
    {:else if isError}
      <RotateCCW class="mr-2 h-4 w-4" />
    {:else if prop.icon}
      <prop.icon class="mr-2 h-4 w-4" />
    {/if}
    {prop.content}
  </FormButton>
{/snippet}
