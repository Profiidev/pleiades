<script lang="ts">
  import KeyRound from '@lucide/svelte/icons/key-round';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import { Button } from '../ui/button/index.js';
  import { FieldSeparator } from '../ui/field/index.js';

  interface Props {
    isLoading: boolean;
    passkeyClick: () => void;
    passkeyError: boolean;
  }

  let { isLoading, passkeyClick, passkeyError }: Props = $props();
</script>

<FieldSeparator class="*:data-[slot=field-separator-content]:bg-card"
  >Or continue with</FieldSeparator
>
<Button
  variant={passkeyError ? 'destructive' : 'outline'}
  type="button"
  disabled={isLoading}
  onclick={passkeyClick}
  class="cursor-pointer"
>
  {#if isLoading}
    <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
  {:else if passkeyError}
    <RotateCcw />
  {:else}
    <KeyRound class="mr-2 h-4 w-4" />
  {/if}
  {passkeyError ? 'Retry Passkey' : 'Passkey'}
</Button>
