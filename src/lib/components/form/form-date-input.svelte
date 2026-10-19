<script lang="ts" generics="S extends FormRecord = FormRecord">
  import { fieldProxy } from 'sveltekit-superforms';
  import * as Calendar from '$lib/components/ui/calendar';
  import * as Popover from '$lib/components/ui/popover';
  import * as Form from '$lib/components/ui/form';
  import { Button } from '$lib/components/ui/button';
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import {
    CalendarDate,
    fromDate,
    getLocalTimeZone,
    toCalendarDate,
    type DateValue
  } from '@internationalized/date';
  import type {
    FormPath,
    FormRecord,
    SuperForm
  } from '$lib/components/form/types';

  interface Props {
    formData: SuperForm<S>;
    key: FormPath<S>;
    label: string;
    disabled?: boolean;
    placeholder?: string;
    minValue?: DateValue;
    maxValue?: DateValue;
  }

  let {
    formData: form,
    key,
    label,
    disabled,
    placeholder,
    maxValue,
    minValue
  }: Props = $props();

  let open = $state(false);
  let field = $derived(fieldProxy(form, key));
  let date = $derived(
    toCalendarDate(fromDate($field as Date, getLocalTimeZone()))
  );
</script>

<Form.Field {form} name={key} class="mt-2 flex w-full flex-col">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>{label}</Form.Label>
      <Popover.Root bind:open>
        <Popover.Trigger {...props} {disabled}>
          {#snippet child({ props })}
            <Button
              {...props}
              variant="outline"
              class="cursor-pointer justify-between font-normal"
            >
              {date
                ? date
                    .toDate(getLocalTimeZone())
                    .toLocaleString(
                      navigator.languages || [navigator.language],
                      {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }
                    )
                : placeholder || 'Select date'}
              <CalendarIcon />
            </Button>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content class="w-auto overflow-hidden p-0" align="start">
          {/* @ts-ignore */ null}
          <Calendar.Calendar
            type="single"
            bind:value={date}
            captionLayout="dropdown"
            weekStartsOn={new Intl.Locale(navigator.language).getWeekInfo()
              .firstDay}
            onValueChange={(val) => {
              field.set(
                (val instanceof CalendarDate
                  ? val.toDate(getLocalTimeZone())
                  : null) as typeof $field
              );
              open = false;
            }}
            {minValue}
            {maxValue}
          />
        </Popover.Content>
      </Popover.Root>
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
