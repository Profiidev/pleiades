import { browser } from '$app/environment';
import type { DateTime as DateTimeType } from 'luxon';

export let DateTime: typeof DateTimeType | undefined = $state();
export * from '@internationalized/date';

if (browser) {
  import('luxon').then((luxon) => (DateTime = luxon.DateTime));
}
