import { browser } from '$app/environment';
import type { DateTime as DateTimeType } from 'luxon';

export let DateTime: { DateTime: typeof DateTimeType | undefined } = $state({
  DateTime: undefined
});
export * from '@internationalized/date';

if (browser) {
  import('luxon').then((luxon) => (DateTime.DateTime = luxon.DateTime));
}
