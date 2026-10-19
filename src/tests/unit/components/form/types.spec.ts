import { describe, expectTypeOf, it } from 'vitest';
import { z } from 'zod/v4';
import type {
  Error,
  StageProps,
  SubmitHandler
} from '$lib/components/form/types';

const schema = z.object({ name: z.string() });
type Handler = SubmitHandler<typeof schema>;

const none: Handler = () => {};
const asyncNone: Handler = async () => {};
const error: Handler = () => ({ error: 'bad', field: 'name' });
const asyncError: Handler = async () =>
  ({ error: 'bad' }) satisfies Error<typeof schema>;

describe('form types', () => {
  it('SubmitHandler receives the parsed form value', () => {
    expectTypeOf<Handler>().parameter(0).toEqualTypeOf<{ name: string }>();
  });

  it('accepts sync/async handlers returning nothing or an Error', () => {
    expectTypeOf(none).toBeFunction();
    expectTypeOf(asyncNone).toBeFunction();
    expectTypeOf(error).toBeFunction();
    expectTypeOf(asyncError).toBeFunction();
  });

  it('StageProps.onsubmit is a SubmitHandler', () => {
    expectTypeOf<StageProps['onsubmit']>().toEqualTypeOf<SubmitHandler<any>>();
  });
});
