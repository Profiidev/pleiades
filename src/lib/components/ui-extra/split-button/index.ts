import Root from '#lib/components/ui-extra/split-button/split-button.svelte';
import Action from '#lib/components/ui-extra/split-button/split-button-action.svelte';
import Select from '#lib/components/ui-extra/split-button/split-button-select.svelte';
import SelectTrigger from '#lib/components/ui-extra/split-button/split-button-select-trigger.svelte';
import SelectAction from '#lib/components/ui-extra/split-button/split-button-select-action.svelte';
import SelectContent from '#lib/components/ui-extra/split-button/split-button-content.svelte';
// re-export select components
import {
  SelectGroup,
  SelectGroupHeading,
  SelectLabel,
  SelectSeparator
} from '#lib/components/ui-extra/select/index.js';

export type {
  SplitButtonProps,
  SplitButtonPropsWithoutHTML
} from '#lib/components/ui-extra/split-button/split-button.svelte';
export type { SplitButtonActionProps } from '#lib/components/ui-extra/split-button/split-button-action.svelte';
export type { SplitButtonSelectProps } from '#lib/components/ui-extra/split-button/split-button-select.svelte';
export type { SplitButtonSelectTriggerProps } from '#lib/components/ui-extra/split-button/split-button-select-trigger.svelte';
export type { SplitButtonSelectActionProps } from '#lib/components/ui-extra/split-button/split-button-select-action.svelte';
export type { SplitButtonClickEvent } from '#lib/components/ui-extra/split-button/split-button.svelte';

export {
  Root,
  Action,
  Select,
  SelectTrigger,
  SelectContent,
  SelectAction,
  SelectGroup,
  SelectGroupHeading,
  SelectLabel,
  SelectSeparator
};
