<script lang="ts">
  import { Questionnaire as QuestionnairePrimitive } from '@shadcn-svelte/primitives/questionnaire';
  import CheckIcon from '@lucide/svelte/icons/check';
  import { cn } from '$lib/utils.js';

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: QuestionnairePrimitive.ChoiceProps = $props();
</script>

<QuestionnairePrimitive.Choice
  bind:ref
  data-slot="questionnaire-choice"
  class={cn(
    'border-input dark:bg-input/20 hover:bg-muted/50 data-checked:border-primary/40 data-checked:bg-muted dark:data-checked:bg-muted data-invalid:border-destructive has-[>input:focus-visible]:border-ring has-[>input:focus-visible]:ring-ring/50 group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start gap-2.5 rounded-lg border bg-transparent px-3 py-2.5 text-start text-sm transition-colors outline-none select-none has-[>input:focus-visible]:ring-3',
    'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
    className
  )}
  {...restProps}
>
  <QuestionnairePrimitive.ChoiceInput
    data-slot="questionnaire-choice-input"
    class="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
  />
  <span
    aria-hidden="true"
    data-slot="questionnaire-choice-indicator"
    class="border-input dark:bg-input/30 group-data-checked/questionnaire-choice:bg-primary dark:group-data-checked/questionnaire-choice:bg-primary group-data-checked/questionnaire-choice:text-primary-foreground group-data-checked/questionnaire-choice:border-primary pointer-events-none relative flex size-4 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-[4px] border group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-data-[type=radio]/questionnaire-choice:rounded-full"
  >
    <span
      data-slot="questionnaire-choice-indicator-dot"
      class="bg-primary-foreground hidden size-2 rounded-full group-data-checked/questionnaire-choice:block group-data-[type=checkbox]/questionnaire-choice:hidden"
    ></span>
    <CheckIcon
      data-slot="questionnaire-choice-indicator-check"
      class="hidden size-3.5 group-data-checked/questionnaire-choice:block group-data-[type=radio]/questionnaire-choice:hidden"
    />
  </span>
  <QuestionnairePrimitive.ChoiceLabel
    data-slot="questionnaire-choice-label"
    class="flex min-w-0 flex-1 flex-col gap-0.5 leading-snug"
  >
    {@render children?.()}
  </QuestionnairePrimitive.ChoiceLabel>
  <QuestionnairePrimitive.ChoiceShortcut
    data-slot="questionnaire-choice-shortcut"
    class="border-input bg-background text-muted-foreground pointer-events-none ms-auto hidden size-5 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-md border font-mono text-[0.625rem] leading-none font-medium group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-data-[shortcut]/questionnaire-choice:inline-flex"
  />
</QuestionnairePrimitive.Choice>
