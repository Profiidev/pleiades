import type { Component, ComponentProps, Snippet } from 'svelte';
import type { ZodValidationSchema } from 'sveltekit-superforms/adapters';
import type { z } from 'zod/v4';
import type BaseForm from './base-form.svelte';

export type { SuperForm, FormPath, FormPathLeaves } from 'sveltekit-superforms';
export type { ZodValidationSchema };

export type FormRecord = Record<string, unknown>;

export type FormValue<V extends ZodValidationSchema> = z.infer<V>;

export interface Error<V extends ZodValidationSchema> {
  field?: keyof FormValue<V>;
  error: string;
}

export type FormEnctype =
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain'
  | undefined
  | null;

export interface StageProps<T = undefined> {
  initialValue?: any;
  onsubmit: ComponentProps<BaseForm<any>>['onsubmit'];
  footer: Snippet<[{ isLoading: boolean; isError: boolean }]>;
  isLoading: boolean;
  data: T;
}

export type StageComponent<T = undefined> = Component<
  StageProps<T>,
  { getValue: () => object | undefined }
>;

export interface Stage<T = undefined> {
  title: string;
  content: StageComponent<T>;
  data: object;
}
